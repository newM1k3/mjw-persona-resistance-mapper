import { useState } from 'react';
import { Brain, Building2, Package, User, ChevronRight, ChevronLeft, FlaskConical } from 'lucide-react';
import type { WizardInput, FrameworkOption } from '../types';

interface InputWizardProps {
  onSubmit: (data: WizardInput) => void;
  initialData?: WizardInput | null;
}

const steps = [
  { number: 1, label: 'The Business', icon: Building2 },
  { number: 2, label: 'The Offer', icon: Package },
  { number: 3, label: 'The Persona', icon: User },
  { number: 4, label: 'Framework', icon: FlaskConical },
];

const frameworkOptions: { value: FrameworkOption; label: string; desc: string }[] = [
  { value: 'All Frameworks', label: 'Auto-Select Best Fit', desc: 'AI picks the single most effective framework for this persona.' },
  { value: 'Cialdini Principles', label: 'Cialdini Principles', desc: 'Reciprocity, Commitment, Social Proof, Authority, Liking, Scarcity, Unity.' },
  { value: 'Kahneman Loss Aversion', label: 'Kahneman Loss Aversion', desc: 'Frame the offer around what the persona stands to lose by not acting.' },
  { value: 'Fogg Behavior Model', label: 'Fogg Behavior Model', desc: 'Diagnose and fix motivation, ability, or prompt blockers.' },
];

export default function InputWizard({ onSubmit, initialData }: InputWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessType, setBusinessType] = useState(initialData?.businessType ?? '');
  const [product, setProduct] = useState(initialData?.product ?? '');
  const [personaDesc, setPersonaDesc] = useState(initialData?.personaDesc ?? '');
  const [framework, setFramework] = useState<FrameworkOption>(initialData?.framework ?? 'All Frameworks');

  const canProceed = () => {
    if (currentStep === 1) return businessType.trim().length > 0;
    if (currentStep === 2) return product.trim().length > 0;
    if (currentStep === 3) return personaDesc.trim().length > 0;
    if (currentStep === 4) return true; // framework always has a default
    return false;
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else onSubmit({ businessType, product, personaDesc, framework });
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-px bg-slate-700 z-0" />
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            return (
              <div key={step.number} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-500 border-cyan-500 text-slate-900'
                      : isCompleted
                      ? 'bg-cyan-900 border-cyan-600 text-cyan-400'
                      : 'bg-slate-800 border-slate-600 text-slate-500'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`text-xs font-medium tracking-wide uppercase transition-colors duration-300 ${
                    isActive ? 'text-cyan-400' : isCompleted ? 'text-cyan-600' : 'text-slate-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-2">Step 01 — Context</p>
              <h2 className="text-2xl font-bold text-white leading-tight">What type of business are you running?</h2>
              <p className="text-slate-400 mt-2 text-sm">Be specific. "B2B SaaS for HR teams" is better than just "software".</p>
            </div>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
              placeholder="e.g. Escape Room, B2B SaaS, Luxury Spa, Online Coaching..."
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-5 py-4 text-white placeholder-slate-500 text-base focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-2">Step 02 — The Offer</p>
              <h2 className="text-2xl font-bold text-white leading-tight">What specific product or service are you selling?</h2>
              <p className="text-slate-400 mt-2 text-sm">Name the exact thing you want them to buy — a package, a plan, an experience.</p>
            </div>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
              placeholder="e.g. $299/month Enterprise Plan, 90-min couples massage, 6-week coaching program..."
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-5 py-4 text-white placeholder-slate-500 text-base focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-2">Step 03 — The Persona</p>
              <h2 className="text-2xl font-bold text-white leading-tight">Describe the customer you're trying to reach.</h2>
              <p className="text-slate-400 mt-2 text-sm">Who are they? What do they care about? What have they said or done that makes you think they might buy?</p>
            </div>
            <textarea
              value={personaDesc}
              onChange={(e) => setPersonaDesc(e.target.value)}
              placeholder="e.g. Mid-level marketing manager at a 50-person company. Interested in automation but always stalls before purchasing. Mentions budget concerns but has approved similar spend before. Seems to need approval from their boss..."
              rows={6}
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-5 py-4 text-white placeholder-slate-500 text-base focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-2">Step 04 — Framework</p>
              <h2 className="text-2xl font-bold text-white leading-tight">Which psychological framework should we apply?</h2>
              <p className="text-slate-400 mt-2 text-sm">Let the AI choose, or pin the analysis to a specific framework you want to use.</p>
            </div>
            <div className="space-y-3">
              {frameworkOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFramework(opt.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                    framework === opt.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  <p className={`font-semibold text-sm ${framework === opt.value ? 'text-cyan-300' : 'text-slate-300'}`}>{opt.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-0 disabled:pointer-events-none text-sm font-medium"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              canProceed()
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 hover:scale-105'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            {currentStep === 4 ? (
              <>
                <Brain size={16} />
                Map the Resistance
              </>
            ) : (
              <>
                Next
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
