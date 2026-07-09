import { useState } from 'react';
import { ShieldAlert, Lightbulb, MessageSquare, Brain, AlertTriangle, Target, RotateCcw, ExternalLink, Copy, Check } from 'lucide-react';
import type { ResistanceMap as ResistanceMapType, WizardInput } from '../types';

interface ResistanceMapProps {
  data: ResistanceMapType;
  wizardInput: WizardInput | null;
  onReset: () => void;
}

// Hardened: uses .includes() to avoid exact-match failures from LLM hallucinations
function getFrameworkBadgeColor(frameworkName: string): string {
  if (frameworkName.toLowerCase().includes('cialdini')) return 'bg-violet-900/40 text-violet-300 border-violet-700';
  if (frameworkName.toLowerCase().includes('kahneman') || frameworkName.toLowerCase().includes('loss')) return 'bg-amber-900/40 text-amber-300 border-amber-700';
  if (frameworkName.toLowerCase().includes('fogg') || frameworkName.toLowerCase().includes('behavior')) return 'bg-cyan-900/40 text-cyan-300 border-cyan-700';
  return 'bg-slate-800 text-slate-300 border-slate-600';
}

// Dynamic CTA: surface a relevant next step based on the resistance type
function getDynamicCta(resistanceName: string): { headline: string; sub: string; label: string; href: string } {
  const lower = resistanceName.toLowerCase();
  if (lower.includes('authority') || lower.includes('trust') || lower.includes('credib')) {
    return {
      headline: 'Authority is the antidote. Script it.',
      sub: 'Learn how to build credibility into every touchpoint — from first email to close.',
      label: 'Get the Authority Playbook',
      href: 'https://mjwdesign.ca/playbook',
    };
  }
  if (lower.includes('price') || lower.includes('budget') || lower.includes('cost') || lower.includes('loss')) {
    return {
      headline: 'Price resistance is a framing problem.',
      sub: 'Discover how to reframe cost as risk — and make inaction feel more expensive than buying.',
      label: 'Get the Value Framing Playbook',
      href: 'https://mjwdesign.ca/playbook',
    };
  }
  if (lower.includes('social') || lower.includes('proof') || lower.includes('validation') || lower.includes('peer')) {
    return {
      headline: 'They need to see others like them succeed.',
      sub: 'Build a social proof engine that turns hesitation into confidence.',
      label: 'Get the Social Proof Playbook',
      href: 'https://mjwdesign.ca/playbook',
    };
  }
  // Default CTA
  return {
    headline: 'Knowing the resistance is only half the battle.',
    sub: 'Learn how to script the entire conversation — from first touch to closed deal.',
    label: 'Get the MJW Communication Playbook',
    href: 'https://mjwdesign.ca/playbook',
  };
}

// Format the resistance map as clean markdown for clipboard export
function formatAsMarkdown(data: ResistanceMapType, input: WizardInput | null): string {
  const lines: string[] = [];
  lines.push(`# Resistance Map: ${data.personaName}`);
  if (input) {
    lines.push('');
    lines.push(`**Business:** ${input.businessType}`);
    lines.push(`**Offer:** ${input.product}`);
  }
  lines.push('');
  lines.push('## The Diagnosis');
  lines.push(`**Primary Resistance:** ${data.primaryResistance.name}`);
  lines.push('');
  lines.push(data.primaryResistance.description);
  lines.push('');
  lines.push(`> **Hidden Fear:** "${data.primaryResistance.hiddenFear}"`);
  lines.push('');
  lines.push('## The Antidote');
  lines.push(`**Framework:** ${data.frameworkMatch.frameworkName}`);
  lines.push(`**Core Principle:** ${data.frameworkMatch.corePrinciple}`);
  lines.push('');
  lines.push(data.frameworkMatch.whyItWorks);
  lines.push('');
  lines.push('## The Action Plan');
  data.actionableTactics.forEach((item, idx) => {
    lines.push(`### ${idx + 1}. ${item.tactic}`);
    lines.push(`> "${item.exampleCopy}"`);
    lines.push('');
  });
  return lines.join('\n');
}

export default function ResistanceMap({ data, wizardInput, onReset }: ResistanceMapProps) {
  const [copied, setCopied] = useState(false);
  const cta = getDynamicCta(data.primaryResistance.name);

  const handleCopy = async () => {
    const text = formatAsMarkdown(data, wizardInput);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="text-center space-y-3 py-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-500">Resistance Map — Diagnostic Report</p>
        <div className="flex items-center justify-center gap-3">
          <Brain size={22} className="text-cyan-400" />
          <h1 className="text-3xl md:text-4xl font-black text-cyan-400 tracking-tight">{data.personaName}</h1>
        </div>
        <div className="w-20 h-px bg-cyan-500/40 mx-auto" />
        <p className="text-slate-400 text-sm max-w-md mx-auto">Your customer's psychological resistance has been isolated. The antidote follows.</p>
      </div>

      {/* Section 01 — Diagnosis */}
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

      {/* Section 02 — Antidote */}
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
              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-semibold ${getFrameworkBadgeColor(data.frameworkMatch.frameworkName)}`}>
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

      {/* Section 03 — Action Plan */}
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

      {/* Dynamic CTA */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto">
          <Brain size={20} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-snug">{cta.headline}</p>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">{cta.sub}</p>
        </div>
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 text-sm"
        >
          {cta.label}
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 text-sm font-medium transition-all py-2 px-4 rounded-lg border ${
            copied
              ? 'text-emerald-400 border-emerald-700 bg-emerald-950/30'
              : 'text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied to Clipboard!' : 'Copy as Markdown'}
        </button>

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
