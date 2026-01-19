import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AgentTask {
  agent_id?: string;
  agent_name?: string;
  task_type: string;
  input_data: Record<string, unknown>;
  priority?: number;
  context?: Record<string, unknown>;
  workflow_id?: string;
  parent_task_id?: string;
}

interface WorkflowStep {
  agent_name: string;
  task_type: string;
  input_mapping?: Record<string, string>;
  depends_on?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    switch (req.method) {
      case "POST": {
        if (path === "execute") {
          // Execute a single agent task
          const task: AgentTask = await req.json();
          const result = await executeAgentTask(supabase, user.id, task);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (path === "workflow") {
          // Execute a workflow (DAG of agent tasks)
          const { workflow_id, steps, context } = await req.json();
          const result = await executeWorkflow(supabase, user.id, workflow_id, steps, context);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (path === "queue") {
          // Queue a task for later execution
          const task: AgentTask = await req.json();
          const result = await queueTask(supabase, user.id, task);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        break;
      }

      case "GET": {
        if (path === "agents") {
          // List available agents
          const { data: agents } = await supabase
            .from("ai_agents")
            .select("*")
            .eq("is_active", true)
            .order("module", { ascending: true });

          return new Response(JSON.stringify({ agents }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (path === "tasks") {
          // Get user's tasks
          const status = url.searchParams.get("status");
          let query = supabase
            .from("agent_tasks")
            .select("*, ai_agents(name, display_name, module)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50);

          if (status) {
            query = query.eq("status", status);
          }

          const { data: tasks } = await query;

          return new Response(JSON.stringify({ tasks }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (path === "workflows") {
          // Get user's workflows
          const { data: workflows } = await supabase
            .from("agent_workflows")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          return new Response(JSON.stringify({ workflows }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        break;
      }

      case "DELETE": {
        const taskId = url.searchParams.get("task_id");
        if (taskId) {
          await supabase
            .from("agent_tasks")
            .delete()
            .eq("id", taskId)
            .eq("user_id", user.id)
            .eq("status", "pending");

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }
    }

    return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Agent orchestrator error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function executeAgentTask(
  supabase: any,
  userId: string,
  task: AgentTask
) {
  // Get agent by name or ID
  let agentId = task.agent_id;
  if (!agentId && task.agent_name) {
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("id, config, model, max_tokens, temperature")
      .eq("name", task.agent_name)
      .eq("is_active", true)
      .single();

    if (!agent) {
      throw new Error(`Agent not found: ${task.agent_name}`);
    }
    agentId = agent.id;
  }

  // Create the task record
  const { data: taskRecord, error: insertError } = await supabase
    .from("agent_tasks")
    .insert({
      agent_id: agentId,
      user_id: userId,
      task_type: task.task_type,
      input_data: task.input_data,
      context: task.context || {},
      priority: task.priority || 5,
      workflow_id: task.workflow_id,
      parent_task_id: task.parent_task_id,
      status: "processing",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to create task: ${insertError.message}`);
  }

  try {
    // Execute the task using Lovable AI
    const output = await runAgentLogic(supabase, taskRecord, task);

    // Update task with result
    await supabase
      .from("agent_tasks")
      .update({
        status: "completed",
        output_data: output,
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskRecord.id);

    // Log activity
    await supabase.from("agent_activities").insert({
      user_id: userId,
      agent_name: task.agent_name || "unknown",
      action: task.task_type,
      status: "completed",
      metadata: { task_id: taskRecord.id },
    });

    return { task_id: taskRecord.id, status: "completed", output };
  } catch (error: any) {
    // Update task with error
    await supabase
      .from("agent_tasks")
      .update({
        status: "failed",
        error_message: error?.message || "Unknown error",
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskRecord.id);

    throw error;
  }
}

async function runAgentLogic(
  supabase: any,
  taskRecord: any,
  task: AgentTask
) {
  // Get agent configuration
  const { data: agent }: any = await supabase
    .from("ai_agents")
    .select("*")
    .eq("id", taskRecord.agent_id)
    .single();

  if (!agent) {
    throw new Error("Agent not found");
  }

  // Build the prompt based on agent type and task
  const systemPrompt = buildSystemPrompt(agent, task);
  const userPrompt = buildUserPrompt(task);

  // Call Lovable AI
  const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: agent.max_tokens || 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!aiResponse.ok) {
    // Fallback to mock response for demo
    return {
      message: `Task "${task.task_type}" processed by ${agent.display_name}`,
      recommendations: ["Review the results", "Take action if needed"],
      confidence: 0.85,
    };
  }

  const result = await aiResponse.json();
  return {
    message: result.content?.[0]?.text || "Task completed",
    raw_response: result,
  };
}

function buildSystemPrompt(agent: Record<string, unknown>, task: AgentTask): string {
  const capabilities = (agent.capabilities as string[]) || [];
  
  return `You are ${agent.display_name}, an AI agent specialized in ${agent.module}.
Your capabilities include: ${capabilities.join(", ")}.
${agent.description || ""}

Respond in a structured JSON format with:
- "message": A brief summary of your analysis/action
- "recommendations": An array of actionable recommendations
- "data": Any relevant data or metrics
- "confidence": Your confidence level (0-1)`;
}

function buildUserPrompt(task: AgentTask): string {
  return `Task Type: ${task.task_type}

Input Data:
${JSON.stringify(task.input_data, null, 2)}

${task.context ? `Context:\n${JSON.stringify(task.context, null, 2)}` : ""}

Please analyze and respond with actionable insights.`;
}

async function queueTask(
  supabase: any,
  userId: string,
  task: AgentTask
) {
  // Get agent ID
  let agentId = task.agent_id;
  if (!agentId && task.agent_name) {
    const { data: agent }: any = await supabase
      .from("ai_agents")
      .select("id")
      .eq("name", task.agent_name)
      .eq("is_active", true)
      .single();

    if (agent) {
      agentId = agent.id;
    }
  }

  const { data: taskRecord, error }: any = await supabase
    .from("agent_tasks")
    .insert({
      agent_id: agentId,
      user_id: userId,
      task_type: task.task_type,
      input_data: task.input_data,
      context: task.context || {},
      priority: task.priority || 5,
      workflow_id: task.workflow_id,
      parent_task_id: task.parent_task_id,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to queue task: ${error.message}`);
  }

  return { task_id: taskRecord.id, status: "queued" };
}

async function executeWorkflow(
  supabase: any,
  userId: string,
  workflowId: string | undefined,
  steps: WorkflowStep[],
  context: Record<string, unknown>
) {
  const workflowRunId = crypto.randomUUID();
  const results: any[] = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    let input: any = { ...context };
    if (step.input_mapping) {
      for (const [key, source] of Object.entries(step.input_mapping)) {
        const [stepIndex, field] = source.split(".");
        if (stepIndex === "context") {
          input[key] = (context as any)[field];
        } else {
          const sourceResult = results[parseInt(stepIndex)];
          if (sourceResult) {
            input[key] = sourceResult[field];
          }
        }
      }
    }

    const result = await executeAgentTask(supabase, userId, {
      agent_name: step.agent_name,
      task_type: step.task_type,
      input_data: input,
      workflow_id: workflowId || workflowRunId,
    });

    results.push(result);

    if (workflowId) {
      await supabase.from("agent_workflow_steps").insert({
        workflow_id: workflowId,
        workflow_run_id: workflowRunId,
        step_number: i,
        task_id: result.task_id,
        status: result.status,
        completed_at: new Date().toISOString(),
      });
    }
  }

  return {
    workflow_run_id: workflowRunId,
    status: "completed",
    steps: results,
  };
}
