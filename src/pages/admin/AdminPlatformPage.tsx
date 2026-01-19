import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookManagement } from "@/components/admin/WebhookManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { AgentTaskMonitor } from "@/components/admin/AgentTaskMonitor";
import { Webhook, Building2, Bot } from "lucide-react";

export default function AdminPlatformPage() {
  const [activeTab, setActiveTab] = useState("webhooks");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Management</h1>
        <p className="text-muted-foreground">
          Manage webhooks, organizations, and agent tasks
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="organizations" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agent Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="mt-6">
          <WebhookManagement />
        </TabsContent>

        <TabsContent value="organizations" className="mt-6">
          <OrganizationManagement />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <AgentTaskMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
