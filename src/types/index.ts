// The canonical list of all available analytical personas
export type PersonaId =
  | 'auto'
  | 'influence-architect'
  | 'loss-framer'
  | 'friction-analyst'
  | 'value-architect'
  | 'trust-builder'
  | 'category-challenger'
  | 'urgency-engineer';

// The exact framework names the AI must return — kept as internal identifiers
export type FrameworkName =
  | 'The Influence Architect'
  | 'The Loss Framer'
  | 'The Friction Analyst'
  | 'The Value Architect'
  | 'The Trust Builder'
  | 'The Category Challenger'
  | 'The Urgency Engineer';

export interface PersonaDefinition {
  id: PersonaId;
  name: string;
  tagline: string;
  resistanceType: string;
  accentColor: string; // Tailwind colour key e.g. 'violet'
}

export const PERSONAS: PersonaDefinition[] = [
  {
    id: 'auto',
    name: 'Auto-Select Best Fit',
    tagline: 'AI picks the single most diagnostic persona for this persona.',
    resistanceType: 'auto',
    accentColor: 'slate',
  },
  {
    id: 'influence-architect',
    name: 'The Influence Architect',
    tagline: 'Compliance is engineered, not requested.',
    resistanceType: 'Social & Psychological Resistance',
    accentColor: 'violet',
  },
  {
    id: 'loss-framer',
    name: 'The Loss Framer',
    tagline: "People don't buy to gain — they buy to not lose.",
    resistanceType: 'Loss Aversion & Risk Resistance',
    accentColor: 'amber',
  },
  {
    id: 'friction-analyst',
    name: 'The Friction Analyst',
    tagline: 'They want to buy. Something is in the way.',
    resistanceType: 'Motivation, Ability & Prompt Resistance',
    accentColor: 'cyan',
  },
  {
    id: 'value-architect',
    name: 'The Value Architect',
    tagline: "The price isn't the problem. The value story is.",
    resistanceType: 'Price & Value Resistance',
    accentColor: 'emerald',
  },
  {
    id: 'trust-builder',
    name: 'The Trust Builder',
    tagline: "They don't doubt your offer. They doubt you.",
    resistanceType: 'Authority & Credibility Resistance',
    accentColor: 'blue',
  },
  {
    id: 'category-challenger',
    name: 'The Category Challenger',
    tagline: "If they can't place you, they won't buy you.",
    resistanceType: 'Positioning & Awareness Resistance',
    accentColor: 'indigo',
  },
  {
    id: 'urgency-engineer',
    name: 'The Urgency Engineer',
    tagline: '"I\'ll think about it" means "convince me the cost of waiting is real."',
    resistanceType: 'Procrastination & Timing Resistance',
    accentColor: 'orange',
  },
];

export interface WizardInput {
  businessType: string;
  product: string;
  personaDesc: string;
  personaId: PersonaId;
}

export interface ResistanceMap {
  personaName: string;
  primaryResistance: {
    name: string;
    description: string;
    hiddenFear: string;
  };
  frameworkMatch: {
    frameworkName: FrameworkName;
    corePrinciple: string;
    whyItWorks: string;
  };
  actionableTactics: Array<{
    tactic: string;
    exampleCopy: string;
  }>;
}
