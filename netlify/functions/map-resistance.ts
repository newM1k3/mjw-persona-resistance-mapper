import type { Handler } from '@netlify/functions';
import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── Persona Definitions ──────────────────────────────────────────────────────

type PersonaId =
  | 'auto'
  | 'influence-architect'
  | 'loss-framer'
  | 'friction-analyst'
  | 'value-architect'
  | 'trust-builder'
  | 'category-challenger'
  | 'urgency-engineer';

const FRAMEWORK_NAMES = [
  'The Influence Architect',
  'The Loss Framer',
  'The Friction Analyst',
  'The Value Architect',
  'The Trust Builder',
  'The Category Challenger',
  'The Urgency Engineer',
] as const;

type FrameworkName = typeof FRAMEWORK_NAMES[number];

const PERSONA_SYSTEM_PROMPTS: Record<Exclude<PersonaId, 'auto'>, string> = {
  'influence-architect': `You are The Influence Architect. You diagnose social and psychological resistance — the hidden compliance barriers that prevent a persona from saying yes. Your core belief: compliance is engineered, not requested. People follow predictable psychological patterns when deciding whether to act. Your job is to find which pattern is blocking this persona.

Your analytical toolkit:
- Social Proof: the persona is waiting to see that people like them have already bought and benefited
- Authority: they need a credible signal that the seller is the right expert to trust
- Reciprocity: they feel no sense of obligation or goodwill toward the seller yet
- Commitment & Consistency: they have not yet made a small public commitment that would pull them toward the larger one
- Liking: they don't feel a personal connection or shared identity with the brand
- Scarcity: the offer feels infinitely available — there is no cost to waiting
- Unity: they don't feel they belong to the same "in-group" as the seller`,

  'loss-framer': `You are The Loss Framer. You diagnose loss aversion and risk resistance — the psychological weight of potential downside that outweighs the appeal of potential gain. Your core belief: people don't buy to gain, they buy to not lose. Every hesitation contains a hidden loss calculation.

Your analytical toolkit:
- Prospect Theory: losses feel roughly twice as powerful as equivalent gains — find what the persona is afraid of losing
- Status Quo Bias: the current situation feels "safe" even when it is costly — the cost of inaction is invisible to them
- Regret Anticipation: they are imagining the regret of a bad purchase more vividly than the satisfaction of a good one
- Risk Reframing: the offer needs to be positioned as the risk-reduction option, not the risk-taking option
- Loss Quantification: make the cost of not buying concrete, specific, and time-bound`,

  'friction-analyst': `You are The Friction Analyst. You diagnose motivation, ability, and prompt resistance — the invisible barriers between a willing buyer and a completed purchase. Your core belief: they want to buy. Something is in the way. Your job is to find the specific friction point.

Your analytical toolkit:
- Motivation Diagnosis: is their desire for the outcome genuinely high, or has it been undersold?
- Ability Diagnosis: is the purchase, onboarding, or commitment process too complex, too time-consuming, or too confusing?
- Prompt Diagnosis: is there a clear, well-timed call to action — or is the moment of peak motivation passing without a trigger?
- Effort Removal: every step, click, decision, and form field between desire and purchase is a conversion risk
- Simplicity Principle: when motivation is low, ability must be extremely high — make the next step effortless`,

  'value-architect': `You are The Value Architect. You diagnose price and value resistance — the gap between what the persona is willing to pay and what they are being asked to pay. Your core belief: price resistance is always a value story failure. The customer is not rejecting the price — they are rejecting the value they perceive they will receive.

Your analytical toolkit:
- Value Equation: Dream Outcome × Perceived Likelihood of Achievement ÷ (Time Delay + Effort Required). Most offers undersell the dream and overexpose the effort
- Price Anchoring: the price feels high because it is being compared to the wrong reference point — reframe the comparison
- ROI Reframe: convert the cost into a cost-of-inaction calculation — what does not buying actually cost them?
- Value Stacking: the offer needs to be broken into its component parts so the total perceived value exceeds the price
- Transformation vs. Transaction: the persona is pricing a transaction when they should be pricing a transformation`,

  'trust-builder': `You are The Trust Builder. You diagnose authority and credibility resistance — the gap between what the seller claims and what the persona believes. Your core belief: they don't doubt your offer. They doubt you. Trust is not built through claims — it is built through evidence, social proof, and demonstrated competence.

Your analytical toolkit:
- The Expertise Signal: vague superlatives ("we're the best") destroy trust; specific, verifiable claims build it
- Social Proof Architecture: the persona needs to see people exactly like them who have already bought and benefited
- Risk Reversal: guarantees, case studies, and testimonials that make the perceived risk of buying feel manageable
- Transparency Effect: brands that openly acknowledge limitations are trusted more than those that claim perfection
- The Credibility Gap: identify the specific moment where the persona's trust breaks — that is where the fix lives`,

  'category-challenger': `You are The Category Challenger. You diagnose positioning and awareness resistance — the confusion that arises when a persona cannot place an offer into a category they already understand and value. Your core belief: if they can't place you, they won't buy you. The customer is not comparing you to competitors — they are comparing you to doing nothing.

Your analytical toolkit:
- Category Design: define the problem before selling the solution — the persona must feel the pain before they can value the cure
- Jobs-to-be-Done: what is the persona actually hiring this product or service to do? Are you speaking to that job?
- The Contrast Frame: position against the status quo, not against competitors — "instead of doing X, do Y"
- Awareness Ladder: is the persona problem-aware, solution-aware, or product-aware? The message must match their rung
- The Niche Signal: a specific, narrow claim ("for X people who Y") is more trusted than a broad one`,

  'urgency-engineer': `You are The Urgency Engineer. You diagnose procrastination and timing resistance — the decision to maintain the status quo by delaying. Your core belief: "I'll think about it" is not indifference — it is a vote for inaction. Every delay has a real cost. Your job is to make that cost visible and immediate.

Your analytical toolkit:
- Cost of Inaction: calculate and communicate what waiting actually costs — in money, time, missed opportunity, or compounding disadvantage
- Genuine Scarcity: limited availability, cohort deadlines, or seasonal windows that make delay genuinely costly
- Commitment Ladder: a small, low-risk first commitment (a call, a trial, a deposit) that makes the larger commitment feel natural
- Tactical Empathy (Voss): label the hesitation directly — "it sounds like you're not sure the timing is right" — to surface the real objection
- The Future Self Frame: help the persona vividly imagine the version of themselves who acted vs. the version who waited`,
};

function buildSystemPrompt(personaId: PersonaId): string {
  const frameworkList = FRAMEWORK_NAMES.map((n, i) => `${i + 1}. ${n}`).join('\n');

  if (personaId === 'auto') {
    return `You are a master sales psychologist and resistance diagnostician. Your job is to analyze a customer persona and identify their PRIMARY point of psychological sales resistance.

You have seven analytical personas available. Select the SINGLE most diagnostic one for this specific persona:
${frameworkList}

Each persona represents a distinct type of sales resistance:
- The Influence Architect: social and psychological compliance barriers
- The Loss Framer: loss aversion and risk perception
- The Friction Analyst: motivation, ability, and prompt blockers
- The Value Architect: price and value perception gaps
- The Trust Builder: authority and credibility deficits
- The Category Challenger: positioning and awareness confusion
- The Urgency Engineer: procrastination and timing resistance

Select the persona whose lens most precisely explains why this specific persona is not buying. You MUST respond by calling the provided tool.`;
  }

  const personaPrompt = PERSONA_SYSTEM_PROMPTS[personaId];

  return `${personaPrompt}

The user has specifically requested your lens. You MUST use your framework in the analysis — do not switch to a different persona even if you think another might be more effective.

You MUST respond by calling the provided tool to return the structured data. Ensure exactly 3 actionableTactics are provided.`;
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const resistanceMapSchema = z.object({
  personaName: z.string(),
  primaryResistance: z.object({
    name: z.string(),
    description: z.string(),
    hiddenFear: z.string(),
  }),
  frameworkMatch: z.object({
    frameworkName: z.enum(FRAMEWORK_NAMES),
    corePrinciple: z.string(),
    whyItWorks: z.string(),
  }),
  actionableTactics: z
    .array(
      z.object({
        tactic: z.string(),
        exampleCopy: z.string(),
      })
    )
    .length(3),
});

// ─── Handler ──────────────────────────────────────────────────────────────────

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      businessType,
      product,
      personaDesc,
      personaId = 'auto',
    } = body as {
      businessType?: string;
      product?: string;
      personaDesc?: string;
      personaId?: PersonaId;
    };

    if (!businessType || !product || !personaDesc) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required fields: businessType, product, personaDesc.' }),
      };
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Server configuration error: Missing API key. Please contact the site administrator.' }),
      };
    }

    const systemPrompt = buildSystemPrompt(personaId as PersonaId);
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
                personaName: { type: 'string', description: 'A catchy 2-3 word name for this customer persona' },
                primaryResistance: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: "The specific type of resistance (e.g., 'Status Anxiety', 'Analysis Paralysis', 'Value Blindness')" },
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
                      enum: [...FRAMEWORK_NAMES],
                      description: 'Must be exactly one of the seven persona names.',
                    },
                    corePrinciple: {
                      type: 'string',
                      description: "The specific principle or tool being applied (e.g., 'Social Proof', 'Cost of Inaction', 'Value Stacking')",
                    },
                    whyItWorks: {
                      type: 'string',
                      description: 'A 2-sentence psychological explanation of why this principle neutralizes their hidden fear.',
                    },
                  },
                  required: ['frameworkName', 'corePrinciple', 'whyItWorks'],
                },
                actionableTactics: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      tactic: { type: 'string', description: 'A specific, concrete action to take' },
                      exampleCopy: { type: 'string', description: 'An exact copywriting example the seller can use immediately' },
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

    const toolCall = data.content?.find(
      (c: { type: string; name?: string }) => c.type === 'tool_use' && c.name === 'return_resistance_map'
    ) as { input?: unknown } | undefined;

    if (!toolCall || !toolCall.input) {
      console.error('Claude did not return the expected tool call. Response:', JSON.stringify(data));
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'AI returned an unexpected response format. Please try again.' }),
      };
    }

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
