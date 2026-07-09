import type { Handler } from '@netlify/functions';
import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Define the expected response schema using Zod
const resistanceMapSchema = z.object({
  personaName: z.string(),
  primaryResistance: z.object({
    name: z.string(),
    description: z.string(),
    hiddenFear: z.string(),
  }),
  frameworkMatch: z.object({
    frameworkName: z.enum(['Cialdini Principles', 'Kahneman Loss Aversion', 'Fogg Behavior Model']),
    corePrinciple: z.string(),
    whyItWorks: z.string(),
  }),
  actionableTactics: z.array(
    z.object({
      tactic: z.string(),
      exampleCopy: z.string(),
    })
  ).length(3),
});

type FrameworkOption = 'Cialdini Principles' | 'Kahneman Loss Aversion' | 'Fogg Behavior Model' | 'All Frameworks';

function buildSystemPrompt(framework: FrameworkOption): string {
  const frameworkInstruction =
    framework === 'All Frameworks'
      ? `You must evaluate the resistance against all three frameworks and select the SINGLE most effective one for this specific persona:
1. Cialdini's 7 Principles of Persuasion
2. Kahneman's Loss Aversion (Prospect Theory)
3. Fogg Behavior Model (Motivation, Ability, Prompt)`
      : `The user has specifically requested you apply the **${framework}** framework. You MUST use this framework in your analysis. Do not switch to a different framework even if you think another might be more effective.`;

  return `You are an expert consumer psychologist and master sales strategist. Your job is to analyze a customer persona and identify their PRIMARY point of psychological sales resistance—the hidden fear, anxiety, or hesitation preventing them from buying.

${frameworkInstruction}

You MUST respond by calling the provided tool to return the structured data. Ensure exactly 3 actionableTactics are provided.`;
}

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');
    const { businessType, product, personaDesc, framework = 'All Frameworks' } = body as {
      businessType?: string;
      product?: string;
      personaDesc?: string;
      framework?: FrameworkOption;
    };

    if (!businessType || !product || !personaDesc) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Server configuration error: Missing API key. Please contact the site administrator.' }),
      };
    }

    const systemPrompt = buildSystemPrompt(framework as FrameworkOption);
    const userPrompt = `Business Type: ${businessType}\nProduct/Service: ${product}\nCustomer Persona: ${personaDesc}\n\nMap the psychological resistance.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        tools: [
          {
            name: 'return_resistance_map',
            description: 'Return the structured resistance map data.',
            input_schema: {
              type: 'object',
              properties: {
                personaName: { type: 'string', description: 'A catchy 2-3 word name for this persona' },
                primaryResistance: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: "The specific type of resistance (e.g., 'Status Anxiety', 'Analysis Paralysis')" },
                    description: { type: 'string', description: 'A 2-sentence explanation of why they are hesitating.' },
                    hiddenFear: { type: 'string', description: 'The unspoken fear driving the resistance.' },
                  },
                  required: ['name', 'description', 'hiddenFear'],
                },
                frameworkMatch: {
                  type: 'object',
                  properties: {
                    frameworkName: {
                      type: 'string',
                      enum: ['Cialdini Principles', 'Kahneman Loss Aversion', 'Fogg Behavior Model'],
                    },
                    corePrinciple: {
                      type: 'string',
                      description: "The specific principle to use (e.g., 'Social Proof', 'Increase Ability', 'Frame as Loss Avoidance')",
                    },
                    whyItWorks: {
                      type: 'string',
                      description: "A 2-sentence psychological explanation of why this principle neutralizes their hidden fear.",
                    },
                  },
                  required: ['frameworkName', 'corePrinciple', 'whyItWorks'],
                },
                actionableTactics: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      tactic: { type: 'string', description: 'Specific action to take' },
                      exampleCopy: { type: 'string', description: 'Exact copywriting example they can use' },
                    },
                    required: ['tactic', 'exampleCopy'],
                  },
                  minItems: 3,
                  maxItems: 3,
                },
              },
              required: ['personaName', 'primaryResistance', 'frameworkMatch', 'actionableTactics'],
            },
          },
        ],
        tool_choice: { type: 'tool', name: 'return_resistance_map' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Anthropic API error: ${response.status} ${errorText}`);
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to communicate with AI provider. Please try again shortly.' }),
      };
    }

    const data = await response.json();

    // Extract the tool use input
    const toolCall = data.content?.find((c: { type: string; name?: string }) => c.type === 'tool_use' && c.name === 'return_resistance_map') as { input?: unknown } | undefined;

    if (!toolCall || !toolCall.input) {
      console.error('Claude did not return the expected tool call. Response:', JSON.stringify(data));
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'AI returned an unexpected response format. Please try again.' }),
      };
    }

    // Validate against Zod schema before sending to client
    try {
      const validatedData = resistanceMapSchema.parse(toolCall.input);
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      };
    } catch (validationError) {
      console.error('Zod validation failed:', validationError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'AI returned data that failed schema validation. Please try again.' }),
      };
    }
  } catch (err) {
    console.error('Unhandled error in map-resistance:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'An unexpected server error occurred. Please try again.' }),
    };
  }
};

export { handler };
