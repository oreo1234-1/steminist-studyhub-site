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
    const { notes } = await req.json();
    
    if (!notes) {
      throw new Error('Notes content is required');
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
            content: `You are a helpful AI that creates flashcards from study notes. 
            Create 8-12 flashcards from the provided notes. 
            Return the response as a JSON array with objects containing "question" and "answer" fields.
            Focus on key concepts, definitions, formulas, and important facts.
            Make questions clear and answers concise but complete.`
          },
          {
            role: 'user',
            content: `Create flashcards from these notes: ${notes}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const flashcardsText = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to structured text
    let flashcards;
    try {
      flashcards = JSON.parse(flashcardsText);
    } catch {
      // If not valid JSON, create flashcards from the response
      const lines = flashcardsText.split('\n').filter(line => line.trim());
      flashcards = [];
      for (let i = 0; i < lines.length; i += 2) {
        if (lines[i] && lines[i + 1]) {
          flashcards.push({
            question: lines[i].replace(/^\d+\.?\s*/, '').replace(/^Q:\s*/, ''),
            answer: lines[i + 1].replace(/^A:\s*/, '')
          });
        }
      }
    }

    return new Response(JSON.stringify({ flashcards }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-flashcards function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});