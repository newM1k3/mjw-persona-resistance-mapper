import { useState } from 'react';
import { Brain, Building2, Package, User, ChevronRight, ChevronLeft } from 'lucide-react';

interface InputWizardProps {
  onSubmit: (data: { businessType: string; product: string; personaDesc: string }) => void;
}

const steps = [
  {
    number: 1,
    label: 'The Business',
    icon: Building2,
  },
  {
    number: 2,
    label: 'The Offer',
    icon: Package,
  },
  {
    number: 3,
    label: 'The Persona',
    icon: User,
  },
];

export default function InputWizard({ onSubmit }: InputWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessType, setBusinessType] = useState('');
  const [product, setProduct] = useState('');
  const [personaDesc, setPersonaDesc] = useState('');

  const canProceed = () => {
    if (currentStep === 1) return businessType.trim().length > 0;
    if (currentStep === 2) return product.trim().length > 0;
    if (currentStep === 3) return personaDesc.trim().length > 0;
    return false;
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else if (canProceed()) onSubmit({ businessType, product, personaDesc });
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
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
            {currentStep === 3 ? (
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
