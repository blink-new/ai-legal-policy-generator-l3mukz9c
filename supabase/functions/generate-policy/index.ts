
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import OpenAI from 'https://esm.sh/openai@4.20.1';

type PolicyType = 'privacy' | 'terms' | 'cookies';

interface RequestBody {
  businessDescription: string;
  policyType: PolicyType;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      status: 204,
    });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the request body
    const { businessDescription, policyType } = await req.json() as RequestBody;

    if (!businessDescription || !policyType) {
      return new Response(
        JSON.stringify({ error: 'Business description and policy type are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Get the OpenAI API key from Supabase
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const policyTypeNames = {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
    };

    const policyName = policyTypeNames[policyType];

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: `You are a legal document generator. Create a professional ${policyName} based on the business description provided. Format the response in markdown with proper sections and headings.`,
        },
        {
          role: 'user',
          content: `Generate a ${policyName} for the following business: ${businessDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract the generated policy from the response
    const generatedPolicy = response.choices[0].message.content || '';

    // Return the generated policy
    return new Response(
      JSON.stringify({ policy: generatedPolicy }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error generating policy:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate policy' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});