import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MealPlanRequest {
  goal: 'lose_weight' | 'build_muscle' | 'maintain' | 'improve_endurance';
  dietType: string;
  allergies: string[];
  foodDislikes: string[];
  cookingTimePreference: string;
  mealsPerDay: number;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  durationDays: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      goal, 
      dietType, 
      allergies, 
      foodDislikes, 
      cookingTimePreference, 
      mealsPerDay,
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      durationDays = 7
    }: MealPlanRequest = await req.json();

    const allergyList = allergies?.length > 0 ? allergies.join(', ') : 'none';
    const dislikesList = foodDislikes?.length > 0 ? foodDislikes.join(', ') : 'none';
    
    const goalDescriptions: Record<string, string> = {
      lose_weight: 'weight loss with a caloric deficit while maintaining muscle mass',
      build_muscle: 'muscle building with adequate protein and slight caloric surplus',
      maintain: 'weight maintenance with balanced nutrition',
      improve_endurance: 'endurance training with emphasis on complex carbs and recovery nutrition'
    };

    const cookingDescriptions: Record<string, string> = {
      quick: '15-20 minutes max, simple recipes',
      moderate: '30-45 minutes, standard home cooking',
      elaborate: 'up to 1 hour, more complex dishes allowed'
    };

    const prompt = `You are an expert nutritionist creating a personalized ${durationDays}-day meal plan.

USER PROFILE:
- Goal: ${goalDescriptions[goal] || goal}
- Diet Type: ${dietType || 'standard'}
- Allergies: ${allergyList}
- Food Dislikes: ${dislikesList}
- Cooking Preference: ${cookingDescriptions[cookingTimePreference] || 'moderate'}
- Meals Per Day: ${mealsPerDay || 3}

DAILY TARGETS:
- Calories: ${dailyCalories} kcal
- Protein: ${proteinGrams}g
- Carbs: ${carbsGrams}g
- Fat: ${fatGrams}g

Generate a complete ${durationDays}-day meal plan as a JSON array. Each day should have ${mealsPerDay} meals.

IMPORTANT: Return ONLY valid JSON, no markdown or extra text.

Format each meal as:
{
  "day": 1,
  "meal_type": "breakfast" | "lunch" | "dinner" | "snack",
  "name": "Meal name",
  "description": "Brief description",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "macros": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "prep_time_minutes": number,
  "recipe": "Step by step cooking instructions"
}

Return an array of all meals for all ${durationDays} days.`;

    // Use Lovable AI endpoint
    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert nutritionist. Always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';
    
    // Parse the JSON response, handling potential markdown wrapping
    let meals;
    try {
      // Remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      meals = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse meal plan response');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      meals,
      summary: {
        totalDays: durationDays,
        mealsPerDay,
        dailyCalories,
        dailyProtein: proteinGrams,
        dailyCarbs: carbsGrams,
        dailyFat: fatGrams
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating meal plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
