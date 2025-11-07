import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user ID from authorization header if available
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      } catch (e) {
        console.log('Could not extract user ID:', e);
      }
    }

    const { description, settings } = await req.json();
    
    if (!description) {
      return new Response(JSON.stringify({ error: 'Description is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract settings with defaults
    const language = settings?.language || 'english';
    const tone = settings?.tone || 'engaging';
    const audience = settings?.audience || 'general';
    const contentType = settings?.contentType || 'general';

    const prompt = `
    You are PopMitra, an AI assistant that helps creators make their videos go viral. 
    
    Based on this content description: "${description}"
    
    GENERATION SETTINGS:
    - Language: ${language}
    - Tone: ${tone}
    - Target Audience: ${audience}
    - Content Type: ${contentType}
    
    Please generate:
    1. 5 catchy, viral video titles (each should be engaging and click-worthy)
    2. 1 SEO-optimized description (include hook line, keywords, call-to-action, and relevant emojis)
    3. 25 trending hashtags (mix of trending, niche, and general hashtags)
    4. 6 social media captions with different styles:
       - 2 modern/trendy captions (current slang, contemporary references)
       - 2 funny/humorous captions (witty, entertaining, meme-worthy)
       - 2 mixed style captions (inspirational, storytelling, or engaging questions)
    
    Format your response as a valid JSON object with this structure:
    {
      "titles": ["title1", "title2", "title3", "title4", "title5"],
      "description": "optimized description with emojis and CTA",
      "hashtags": ["#hashtag1", "#hashtag2", ..., "#hashtag25"],
      "captions": [
        {
          "text": "caption text here",
          "style": "modern"
        },
        {
          "text": "caption text here", 
          "style": "modern"
        },
        {
          "text": "caption text here",
          "style": "funny"
        },
        {
          "text": "caption text here",
          "style": "funny"
        },
        {
          "text": "caption text here",
          "style": "mixed"
        },
        {
          "text": "caption text here",
          "style": "mixed"
        }
      ]
    }
    
    Make sure captions are concise (2-3 sentences max), include relevant emojis, and are optimized for social media engagement. Each caption style should be distinct and authentic to that approach.
    `;

    console.log('Calling Gemini API with prompt for description:', description);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 4096,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate content' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid response structure from Gemini API');
      return new Response(JSON.stringify({ error: 'Invalid response from AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    try {
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const result = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (!result.titles || !result.description || !result.hashtags || !result.captions) {
        throw new Error('Invalid JSON structure');
      }

      console.log('Successfully parsed AI response');
      
      // Log the generation to database
      try {
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        await supabaseAdmin
          .from('content_generations')
          .insert({
            user_id: userId,
            description,
            settings
          });
        
        console.log('Generation logged to database');
      } catch (dbError) {
        console.error('Error logging generation:', dbError);
        // Don't fail the request if logging fails
      }
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI response:', generatedText);
      
      // Fallback: return a structured error with the raw response
      return new Response(JSON.stringify({ 
        error: 'Failed to parse AI response',
        rawResponse: generatedText
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});