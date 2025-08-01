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
    const { question } = await req.json();
    
    if (!question) {
      throw new Error('Question is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an encouraging and knowledgeable STEM study buddy for high school and college students, especially focused on supporting women and underrepresented groups in STEM. 

            Your personality:
            - Supportive and encouraging
            - Patient and understanding
            - Explains concepts clearly with examples
            - Breaks down complex topics into digestible parts
            - Celebrates learning progress
            - Relates concepts to real-world applications
            
            Your expertise covers:
            - Mathematics (algebra, calculus, statistics)
            - Physics (mechanics, thermodynamics, electromagnetism)
            - Chemistry (organic, inorganic, biochemistry)
            - Biology (molecular, cellular, ecology)
            - Computer Science (programming, algorithms, data structures)
            - Engineering concepts
            
            Always:
            - Encourage the student
            - Provide step-by-step explanations
            - Use examples and analogies
            - Suggest study strategies
            - Ask follow-up questions to check understanding`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});