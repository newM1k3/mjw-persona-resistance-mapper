import { useEffect, useState } from 'react';
import { ScanSearch } from 'lucide-react';

const messages = [
  'Analyzing behavioral drivers...',
  'Scanning psychological frameworks...',
  'Isolating primary resistance...',
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-slate-700 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-slate-600 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-900 flex items-center justify-center">
              <ScanSearch size={28} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" />
      </div>

      <div className="text-center space-y-3">
        <p
          className={`text-cyan-400 text-lg font-medium tracking-wide transition-opacity duration-400 ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {messages[messageIndex]}
        </p>
        <p className="text-slate-600 text-sm">Running deep psychological analysis...</p>
      </div>

      <div className="flex gap-1.5">
        {messages.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === messageIndex ? 'bg-cyan-400 scale-125' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
