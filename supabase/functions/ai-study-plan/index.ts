import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { examDate, topics } = await req.json();
    
    if (!examDate || !topics) {
      throw new Error('Exam date and topics are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Calculate days until exam
    const today = new Date();
    const exam = new Date(examDate);
    const daysUntilExam = Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a study planning expert who creates detailed, realistic study schedules for students.
            
            Create a comprehensive study plan that:
            - Spreads topics evenly across available days
            - Includes specific daily tasks and goals
            - Balances study time with review sessions
            - Incorporates active learning techniques
            - Includes breaks and rest days
            - Suggests time estimates for each task
            
            Format the response as a JSON object with this structure:
            {
              "studyPlan": [
                {
                  "day": 1,
                  "date": "YYYY-MM-DD",
                  "topic": "Topic name",
                  "tasks": ["Task 1", "Task 2"],
                  "estimatedTime": "2-3 hours",
                  "type": "study" | "review" | "practice" | "rest"
                }
              ],
              "tips": ["Study tip 1", "Study tip 2"],
              "totalDays": number
            }`
          },
          {
            role: 'user',
            content: `Create a study plan for an exam on ${examDate} (${daysUntilExam} days from now). 
            Topics to cover: ${topics}
            
            Please create a detailed daily study schedule.`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let studyPlanText = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to structured response
    let studyPlan;
    try {
      studyPlan = JSON.parse(studyPlanText);
    } catch {
      // Create a simple structure if JSON parsing fails
      studyPlan = {
        studyPlan: [{
          day: 1,
          date: new Date().toISOString().split('T')[0],
          topic: topics,
          tasks: ["Review study plan created by AI"],
          estimatedTime: "1 hour",
          type: "study"
        }],
        tips: ["Follow the schedule consistently", "Take breaks every hour"],
        totalDays: daysUntilExam,
        rawResponse: studyPlanText
      };
    }

    return new Response(JSON.stringify(studyPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-study-plan function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});