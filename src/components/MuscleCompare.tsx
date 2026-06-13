/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Muscle, musclesData } from '../data/muscles';
import { X, RefreshCw, Layers, Compass, HelpCircle } from 'lucide-react';

interface MuscleCompareProps {
  initialMuscle: Muscle | null;
  onClose: () => void;
}

export default function MuscleCompare({ initialMuscle, onClose }: MuscleCompareProps) {
  const [muscleA, setMuscleA] = useState<Muscle | null>(initialMuscle);
  const [muscleB, setMuscleB] = useState<Muscle | null>(null);

  // Filter out muscleA from selectors for muscleB
  const availableForB = musclesData.filter((m) => m.id !== muscleA?.id);
  const availableForA = musclesData.filter((m) => m.id !== muscleB?.id);

  const getTendencyBadge = (tendency: Muscle['tendency']) => {
    switch (tendency) {
      case 'zkracování':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'ochabování':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'přetěžování':
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="bg-[#0F0F11] border border-[#27272A] rounded-2xl p-6 shadow-2xl text-[#E4E4E7]" id="muscle-compare">
      {/* Title block */}
      <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-6">
        <div className="flex items-center gap-2">
          <RefreshCw className="text-cyan-400 animate-spin-slow" size={20} />
          <div>
            <h3 className="text-lg font-bold text-white font-display">Srovnávač Svalů (Komparátor)</h3>
            <p className="text-xs text-[#71717A]">Porovnejte dva svaly, jejich začátky, úpony, tendence a funkce</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#71717A] hover:text-[#A1A1AA] p-1.5 rounded-lg hover:bg-[#1C1C1F] border border-transparent hover:border-[#27272A] transition"
          id="btn-close-compare"
        >
          <X size={16} />
        </button>
      </div>

      {/* Grid of 2 selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* MUSCLE A panel */}
        <div className="flex flex-col gap-4 bg-[#121214]/60 p-5 rounded-xl border border-[#27272A]">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] font-display">Sval A (Základní)</label>
            <select
              value={muscleA?.id || ''}
              onChange={(e) => setMuscleA(musclesData.find((m) => m.id === e.target.value) || null)}
              className="w-full bg-[#121214] border border-[#27272A] text-white rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              id="select-muscle-a"
            >
              <option value="">-- Vyber sval --</option>
              {availableForA.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nameCs} ({m.nameLa})
                </option>
              ))}
            </select>
          </div>

          {muscleA ? (
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <h4 className="text-base font-bold text-white leading-tight font-display">{muscleA.nameCs}</h4>
                <p className="text-[11px] text-[#71717A] italic font-mono">{muscleA.nameLa}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[9px] bg-[#1C1C1F] text-[#D4D4D8] px-2.5 py-0.5 rounded border border-[#27272A] font-medium tracking-wide uppercase">
                    Skupina: {muscleA.group}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">Začátek svalu</span>
                <p className="text-xs text-[#D4D4D8] leading-relaxed">{muscleA.origin}</p>
              </div>

              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">Úpon svalu</span>
                <p className="text-xs text-[#D4D4D8] leading-relaxed">{muscleA.insertion}</p>
              </div>

              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">Pohybová tendence</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold inline-block border ${getTendencyBadge(muscleA.tendency)}`}>
                  Náchylnost k: {muscleA.tendency.toUpperCase()}
                </span>
                <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed">{muscleA.tendencyDesc}</p>
              </div>

              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1.5">Funkce</span>
                <div className="flex flex-wrap gap-1">
                  {muscleA.actions.map((act, i) => (
                    <span key={i} className="text-[10px] bg-[#1C1C1F] border border-[#27272A] px-2 py-0.5 rounded text-[#D4D4D8]">
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272A] bg-[#1C1C1F]/60 p-3 rounded-lg border border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">Uplatnění v životě</span>
                <p className="text-xs text-[#D4D4D8] leading-relaxed font-sans">{muscleA.realLifeExample}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-[#52525B] border border-dashed border-[#27272A] rounded-lg mt-2">
              <Layers size={32} className="opacity-15 mb-2 text-cyan-400 animate-pulse" />
              <p className="text-xs font-mono">Zvolte první sval k porovnání</p>
            </div>
          )}
        </div>

        {/* MUSCLE B panel */}
        <div className="flex flex-col gap-4 bg-[#121214]/60 p-5 rounded-xl border border-[#27272A]">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] font-display">Sval B (Srovnávací)</label>
            <select
              value={muscleB?.id || ''}
              onChange={(e) => setMuscleB(musclesData.find((m) => m.id === e.target.value) || null)}
              className="w-full bg-[#121214] border border-[#27272A] text-white rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              id="select-muscle-b"
            >
              <option value="">-- Vyber sval --</option>
              {availableForB.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nameCs} ({m.nameLa})
                </option>
              ))}
            </select>
          </div>

          {muscleB ? (
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <h4 className="text-base font-bold text-white leading-tight font-display">{muscleB.nameCs}</h4>
                <p className="text-[11px] text-[#71717A] italic font-mono">{muscleB.nameLa}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[9px] bg-[#1C1C1F] text-[#D4D4D8] px-2.5 py-0.5 rounded border border-[#27272A] font-medium tracking-wide uppercase">
                    Skupina: {muscleB.group}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">Začátek svalu</span>
                <p className="text-xs text-[#D4D4D8] leading-relaxed">{muscleB.origin}</p>
              </div>

              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">Úpon svalu</span>
                <p className="text-xs text-[#D4D4D8] leading-relaxed">{muscleB.insertion}</p>
              </div>

              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">Pohybová tendence</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold inline-block border ${getTendencyBadge(muscleB.tendency)}`}>
                  Náchylnost k: {muscleB.tendency.toUpperCase()}
                </span>
                <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed">{muscleB.tendencyDesc}</p>
              </div>

              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1.5">Funkce</span>
                <div className="flex flex-wrap gap-1">
                  {muscleB.actions.map((act, i) => (
                    <span key={i} className="text-[10px] bg-[#1C1C1F] border border-[#27272A] px-2 py-0.5 rounded text-[#D4D4D8]">
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272A] bg-[#1C1C1F]/60 p-3 rounded-lg border border-[#27272A]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">Uplatnění v životě</span>
                <p className="text-xs text-[#D4D4D8] leading-relaxed font-sans">{muscleB.realLifeExample}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-[#52525B] border border-dashed border-[#27272A] rounded-lg mt-2">
              <Layers size={32} className="opacity-15 mb-2 text-cyan-400 animate-pulse" />
              <p className="text-xs font-mono">Zvolte druhý sval k porovnání</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
