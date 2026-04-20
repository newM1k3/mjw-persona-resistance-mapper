import { ShieldAlert, Lightbulb, MessageSquare, Brain, AlertTriangle, Target, RotateCcw, ExternalLink } from 'lucide-react';
import type { ResistanceMap as ResistanceMapType } from '../types';

interface ResistanceMapProps {
  data: ResistanceMapType;
  onReset: () => void;
}

const frameworkBadgeColors: Record<ResistanceMapType['frameworkMatch']['frameworkName'], string> = {
  'Cialdini Principles': 'bg-violet-900/40 text-violet-300 border-violet-700',
  'Kahneman Loss Aversion': 'bg-amber-900/40 text-amber-300 border-amber-700',
  'Fogg Behavior Model': 'bg-cyan-900/40 text-cyan-300 border-cyan-700',
};

export default function ResistanceMap({ data, onReset }: ResistanceMapProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-16">
      <div className="text-center space-y-3 py-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-500">Resistance Map — Diagnostic Report</p>
        <div className="flex items-center justify-center gap-3">
          <Brain size={22} className="text-cyan-400" />
          <h1 className="text-3xl md:text-4xl font-black text-cyan-400 tracking-tight">{data.personaName}</h1>
        </div>
        <div className="w-20 h-px bg-cyan-500/40 mx-auto" />
        <p className="text-slate-400 text-sm max-w-md mx-auto">Your customer's psychological resistance has been isolated. The antidote follows.</p>
      </div>

      <div className="bg-slate-900 border border-red-900/50 rounded-2xl overflow-hidden shadow-2xl shadow-red-950/20">
        <div className="bg-gradient-to-r from-red-950/60 to-orange-950/40 px-6 py-4 border-b border-red-900/40 flex items-center gap-3">
          <ShieldAlert size={20} className="text-red-400" />
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-red-500">Section 01</p>
            <p className="text-white font-bold text-lg leading-tight">The Diagnosis</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">Primary Resistance</p>
            <p className="text-2xl font-black text-red-400">{data.primaryResistance.name}</p>
          </div>

          <p className="text-slate-300 leading-relaxed">{data.primaryResistance.description}</p>

          <div className="bg-orange-950/40 border border-orange-800/50 rounded-xl p-4 flex gap-3">
            <AlertTriangle size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-1">Hidden Fear</p>
              <p className="text-orange-200 font-medium leading-snug">"{data.primaryResistance.hiddenFear}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-cyan-900/50 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/20">
        <div className="bg-gradient-to-r from-cyan-950/60 to-teal-950/40 px-6 py-4 border-b border-cyan-900/40 flex items-center gap-3">
          <Lightbulb size={20} className="text-cyan-400" />
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-600">Section 02</p>
            <p className="text-white font-bold text-lg leading-tight">The Antidote</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-start gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">Framework</p>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-semibold ${frameworkBadgeColors[data.frameworkMatch.frameworkName]}`}>
                {data.frameworkMatch.frameworkName}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">Core Principle</p>
              <div className="flex items-center gap-2">
                <Target size={14} className="text-cyan-400" />
                <span className="text-cyan-300 font-bold text-base">{data.frameworkMatch.corePrinciple}</span>
              </div>
            </div>
          </div>

          <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-xl p-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-2">Why It Works</p>
            <p className="text-slate-300 leading-relaxed">{data.frameworkMatch.whyItWorks}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-950/20">
        <div className="bg-gradient-to-r from-emerald-950/60 to-green-950/40 px-6 py-4 border-b border-emerald-900/40 flex items-center gap-3">
          <MessageSquare size={20} className="text-emerald-400" />
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-600">Section 03</p>
            <p className="text-white font-bold text-lg leading-tight">The Action Plan</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {data.actionableTactics.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs font-bold">{idx + 1}</span>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-slate-200 font-semibold leading-snug">{item.tactic}</p>
                  <div className="bg-emerald-950/40 border-l-2 border-emerald-500 pl-4 py-3 pr-4 rounded-r-xl">
                    <p className="text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-1.5">Example Copy</p>
                    <p className="text-emerald-200 italic leading-relaxed">"{item.exampleCopy}"</p>
                  </div>
                </div>
              </div>
              {idx < data.actionableTactics.length - 1 && (
                <div className="ml-9 h-px bg-emerald-900/30" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto">
          <Brain size={20} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-snug">Knowing the resistance is only half the battle.</p>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">Learn how to script the entire conversation — from first touch to closed deal.</p>
        </div>
        <a
          href="https://mjwdesign.co/playbook"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 text-sm"
        >
          Get the MJW Communication Playbook
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors py-2 px-4 rounded-lg hover:bg-slate-800"
        >
          <RotateCcw size={14} />
          Run Another Analysis
        </button>
      </div>
    </div>
  );
}
