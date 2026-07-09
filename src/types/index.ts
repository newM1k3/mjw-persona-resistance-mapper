export interface WizardInput {
  businessType: string;
  product: string;
  personaDesc: string;
  framework?: FrameworkOption;
}

export type FrameworkOption = 'Cialdini Principles' | 'Kahneman Loss Aversion' | 'Fogg Behavior Model' | 'All Frameworks';

export interface ResistanceMap {
  personaName: string;
  primaryResistance: {
    name: string;
    description: string;
    hiddenFear: string;
  };
  frameworkMatch: {
    frameworkName: 'Cialdini Principles' | 'Kahneman Loss Aversion' | 'Fogg Behavior Model';
    corePrinciple: string;
    whyItWorks: string;
  };
  actionableTactics: Array<{
    tactic: string;
    exampleCopy: string;
  }>;
}
