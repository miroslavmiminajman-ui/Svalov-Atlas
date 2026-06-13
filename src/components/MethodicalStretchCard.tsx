/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Muscle } from '../data/muscles';
import { getStretchingExerciseForMuscle } from '../data/stretchingExercises';
import { 
  Timer, 
  CheckCircle2, 
  Activity, 
  Flame, 
  AlertTriangle,
  Dumbbell,
  Sparkles,
  Target
} from 'lucide-react';

interface MethodicalStretchCardProps {
  muscle: Muscle;
}

export default function MethodicalStretchCard({ 
  muscle 
}: MethodicalStretchCardProps) {
  const stretchEx = getStretchingExerciseForMuscle(muscle.id, muscle.stretching);

  // Define tendency-based styling for strengthening focus
  const getStrengtheningFocusBadge = (tendency: Muscle['tendency']) => {
    switch (tendency) {
      case 'zkracování':
        return {
          text: 'Spíše uvolňovat – prioritou je průtah, posílení v protažení',
          style: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        };
      case 'ochabování':
        return {
          text: 'Výrazný sklon k ochabování – prioritní cíl pro posílení a tonizaci',
          style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
        };
      case 'přetěžování':
      default:
        return {
          text: 'Náchylnost k přetížení – nutná maximální kontrola techniky',
          style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
    }
  };

  const focusBadge = getStrengtheningFocusBadge(muscle.tendency);

  return (
    <div 
      className="bg-gradient-to-b from-[#121214] to-[#0D0D0F] border border-[#27272A] rounded-2xl p-5 sm:p-6 flex flex-col gap-6 shadow-xl animate-fade-in" 
      id={`methodical-stretch-strength-${muscle.id}`}
    >
      {/* ========================================================================= */}
      {/* SECTION 1: METHODICAL STRETCHING (Metodický nácvik průtahu) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-5">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#27272A]/70">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
            <div>
              <h4 className="text-base font-bold text-white font-display">
                Metodický nácvik průtahu: <span className="text-rose-400">{muscle.nameCs}</span>
              </h4>
              <p className="text-xs text-[#71717A] mt-0.5">
                Odborný fyzioterapeutický postup pro uvolnění a snížení napětí ve svalových snopcích
              </p>
            </div>
          </div>
          <span className={`self-start sm:self-center text-[10px] font-bold px-3 py-1 rounded-lg uppercase border tracking-wider ${
            stretchEx.difficulty === 'Lehká' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : stretchEx.difficulty === 'Střední' 
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
                : 'bg-rose-500/10 text-rose-450 border-rose-500/20 animate-pulse'
          }`}>
            Obtížnost: {stretchEx.difficulty}
          </span>
        </div>

        {/* Steps List */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-3 font-mono">
            Návod k provedení průtahu krok za krokem:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {stretchEx.steps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-[#09090B]/60 rounded-xl p-4 border border-[#27272A]/40 flex gap-3.5 items-start hover:border-[#3F3F46]/60 transition-colors duration-150"
              >
                <span className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full bg-rose-950/60 border border-rose-500/30 text-[#FDA4AF] font-mono text-xs font-black shadow shadow-rose-950/60">
                  {idx + 1}
                </span>
                <p className="text-xs text-[#E4E4E7] leading-relaxed font-sans font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cues, Breathing, and Common Mistakes Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          {/* Key rules */}
          <div className="bg-[#1C1C1F]/30 p-4 rounded-xl border border-[#27272A]/40 flex flex-col justify-between hover:border-[#27272A]/80 transition duration-150">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-2.5 flex items-center gap-1.5 font-display w-full">
                <CheckCircle2 size={13} className="text-[#34D399]" />
                Klíčové zásady průtahu
              </span>
              <ul className="text-xs space-y-1.5 text-[#D4D4D8] list-disc pl-4 leading-relaxed font-sans font-medium">
                {stretchEx.cues.map((cue, i) => (
                  <li key={i}>{cue}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Breath & Timing */}
          <div className="bg-[#1C1C1F]/30 p-4 rounded-xl border border-[#27272A]/40 flex flex-col justify-between hover:border-[#27272A]/80 transition duration-150">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-2.5 flex items-center gap-1.5 font-display w-full">
                <Activity size={13} className="text-rose-400" />
                Asistence dechu
              </span>
              <p className="text-xs text-[#D4D4D8] leading-relaxed font-sans font-medium">
                {stretchEx.breathing}
              </p>
            </div>
            <div className="text-[10px] text-rose-450 bg-rose-500/5 border border-rose-500/10 py-1.5 px-2.5 rounded-lg font-mono font-bold inline-flex items-center gap-1.5 mt-3.5 self-start">
              <Timer size={12} className="shrink-0" />
              <span>Minimální výdrž: {stretchEx.duration}</span>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="bg-[#1C1C1F]/30 p-4 rounded-xl border border-[#27272A]/40 hover:border-[#27272A]/80 transition duration-150">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-350 mb-2.5 flex items-center gap-1.5 font-display w-full">
              <AlertTriangle size={13} className="text-amber-500 shrink-0" />
              Časté chyby při protažení
            </span>
            <ul className="text-xs space-y-1.5 text-orange-200/80 list-disc pl-4 leading-relaxed font-sans font-medium">
              {stretchEx.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Decorative elegant horizontal separator with a center diamond */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-[#27272A]/70"></div>
        <span className="flex-shrink mx-4 text-[#52525B] text-xs font-mono select-none">◆</span>
        <div className="flex-grow border-t border-[#27272A]/70"></div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: METHODICAL STRENGTHENING (Metodická aktivace a posílení) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-5">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#27272A]/70">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></div>
            <div>
              <h4 className="text-base font-bold text-white font-display">
                Metodická aktivace a posílení: <span className="text-cyan-400">{muscle.nameCs}</span>
              </h4>
              <p className="text-xs text-[#71717A] mt-0.5">
                Fyzioterapeutické postupy pro obnovu stability, motorické kontroly a síly svalových vláken
              </p>
            </div>
          </div>
          <span className={`self-start sm:self-center text-[10px] font-bold px-3 py-1 rounded-lg uppercase border tracking-wider ${focusBadge.style}`}>
            {focusBadge.text}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Detailed Strengthening Instructions */}
          <div className="lg:col-span-7 bg-[#09090B]/60 border border-[#27272A]/60 rounded-xl p-5 flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-2 font-mono">
                Postup klinického posílení a nápravné aktivace:
              </span>
              <p className="text-xs sm:text-sm text-[#E4E4E7] leading-relaxed font-sans font-semibold">
                {muscle.strengthening}
              </p>
            </div>

            {/* Micro kinesiological tip */}
            <div className="bg-[#1C1C1F]/40 p-3.5 rounded-lg border border-[#27272A]/40 mt-1 flex gap-3 items-start">
              <Sparkles size={16} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-300 tracking-wider block mb-0.5 font-display">
                  Metodické pravidlo pro nápravu
                </span>
                <p className="text-[11px] text-[#A1A1AA] leading-normal font-sans font-medium">
                  Cílené svalové zapojení vyžaduje vědomé soustředění na pohyb (mind-muscle connection). Cviky provádějte kontrolovaně v plném fyziologickém rozsahu pohybu a s izometrickou výdrží 1–2 vteřiny v bodě maximálního smrštění.
                </p>
              </div>
            </div>
          </div>

          {/* Core Exercise Highlight & Kinesiology actions */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Exercise box */}
            <div className="bg-gradient-to-br from-[#1C1C1F]/40 to-[#121214]/60 rounded-xl p-4 border border-[#27272A]/70 flex flex-col justify-between h-full gap-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-2.5 flex items-center gap-1.5 font-display w-full">
                  <Target size={13} className="text-cyan-400" />
                  Hlavní doporučený nápravný cvik
                </span>
                <p className="text-xs text-white leading-relaxed font-sans font-bold bg-[#09090B]/50 p-3 rounded-lg border border-[#27272A]/50">
                  {muscle.exerciseExample}
                </p>
              </div>

              {/* Functional movements bulleted list to anchor anatomy */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-2 font-mono">
                  Základní kineziologické funkce (pro zacílení):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {muscle.actions.map((act, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] bg-cyan-950/40 text-cyan-300 border border-cyan-800/30 px-2.5 py-1 rounded-md font-sans font-semibold"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
