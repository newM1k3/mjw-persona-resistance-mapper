import type { Handler } from '@netlify/functions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SYSTEM_PROMPT = `You are an expert consumer psychologist and master sales strategist. Your job is to analyze a customer persona and identify their PRIMARY point of psychological sales resistance—the hidden fear, anxiety, or hesitation preventing them from buying.

You must evaluate the resistance against three frameworks:
1. Cialdini's 7 Principles of Persuasion
2. Kahneman's Loss Aversion (Prospect Theory)
3. Fogg Behavior Model (Motivation, Ability, Prompt)

Select the SINGLE most effective framework and principle to overcome their specific resistance.

Respond ONLY with a valid JSON object matching this exact structure:
{
  "personaName": "A catchy 2-3 word name for this persona",
  "primaryResistance": {
    "name": "The specific type of resistance (e.g., 'Status Anxiety', 'Analysis Paralysis')",
    "description": "A 2-sentence explanation of why they are hesitating.",
    "hiddenFear": "The unspoken fear driving the resistance."
  },
  "frameworkMatch": {
    "frameworkName": "Must be exactly: 'Cialdini Principles', 'Kahneman Loss Aversion', or 'Fogg Behavior Model'",
    "corePrinciple": "The specific principle to use (e.g., 'Social Proof', 'Increase Ability', 'Frame as Loss Avoidance')",
    "whyItWorks": "A 2-sentence psychological explanation of why this principle neutralizes their hidden fear."
  },
  "actionableTactics": [
    {
      "tactic": "Specific action to take",
      "exampleCopy": "Exact copywriting example they can use"
    }
  ]
}
Ensure exactly 3 actionableTactics are provided.`;

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };

  try {
    const { businessType, product, personaDesc } = JSON.parse(event.body || '{}');
    if (!businessType || !product || !personaDesc) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const userPrompt = `Business Type: ${businessType}\nProduct/Service: ${product}\nCustomer Persona: ${personaDesc}\n\nMap the psychological resistance.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) throw new Error('Anthropic API error');
    const data = await response.json();

    let rawContent = data.content?.[0]?.text || '';
    rawContent = rawContent.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: rawContent,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Failed to map resistance.' }) };
  }
};

export { handler };
