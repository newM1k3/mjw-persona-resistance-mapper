import { useState } from 'react';
import { Brain, Crosshair } from 'lucide-react';
import InputWizard from './components/InputWizard';
import LoadingState from './components/LoadingState';
import ResistanceMap from './components/ResistanceMap';
import type { ResistanceMap as ResistanceMapType, WizardInput } from './types';

type AppState = 'wizard' | 'loading' | 'results';

export default function App() {
  const [appState, setAppState] = useState<AppState>('wizard');
  const [result, setResult] = useState<ResistanceMapType | null>(null);
  const [wizardInput, setWizardInput] = useState<WizardInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: WizardInput) => {
    setError(null);
    setWizardInput(data);
    setAppState('loading');
    try {
      const response = await fetch('/api/map-resistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        const message = json?.error || 'Failed to analyze resistance.';
        throw new Error(message);
      }

      setResult(json as ResistanceMapType);
      setAppState('results');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setAppState('wizard');
    }
  };

  const handleReset = () => {
    setResult(null);
    setWizardInput(null);
    setError(null);
    setAppState('wizard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Crosshair size={16} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight tracking-tight">Persona Resistance Mapper</p>
              <p className="text-slate-500 text-xs">MJW Personal App Platform</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Brain size={12} className="text-cyan-700" />
            Powered by Claude 3.5 Sonnet
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {appState === 'wizard' && (
          <div className="space-y-10">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-cyan-400 tracking-wide uppercase">
                <Crosshair size={12} />
                Psychological Sales Intelligence
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">
                X-Ray Your Customer's{' '}
                <span className="text-cyan-400">Hidden Resistance</span>
              </h1>
              <p className="text-slate-400 leading-relaxed">
                Describe your target persona. Our AI identifies the exact psychological barrier blocking the sale — and gives you the tactical playbook to overcome it.
              </p>
            </div>

            {error && (
              <div className="max-w-2xl mx-auto bg-red-950/40 border border-red-800/50 rounded-xl px-5 py-4 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <InputWizard onSubmit={handleSubmit} initialData={wizardInput} />

            <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: '01', label: 'Cialdini Principles', desc: 'Persuasion science' },
                { icon: '02', label: 'Kahneman Theory', desc: 'Loss aversion mapping' },
                { icon: '03', label: 'Fogg Behavior', desc: 'Motivation + ability' },
              ].map((item) => (
                <div key={item.icon} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center space-y-1.5">
                  <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase">{item.icon}</p>
                  <p className="text-slate-300 text-sm font-semibold">{item.label}</p>
                  <p className="text-slate-600 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {appState === 'loading' && <LoadingState />}

        {appState === 'results' && result && (
          <ResistanceMap data={result} wizardInput={wizardInput} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
