/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Muscle, MUSCLE_GROUPS } from '../data/muscles';
import AnatomyPointsMap from './AnatomyPointsMap';
import { getStretchingExerciseForMuscle } from '../data/stretchingExercises';
import { 
  Dumbbell, 
  RefreshCw, 
  Compass, 
  HelpCircle, 
  Flame, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Sparkles,
  Layers,
  BookOpen,
  Timer,
  CheckCircle2,
  Activity,
  Search
} from 'lucide-react';

interface MuscleDetailProps {
  muscle: Muscle;
  onAddToCompare?: (muscle: Muscle) => void;
  isComparing?: boolean;
}

export default function MuscleDetail({ 
  muscle, 
  onAddToCompare,
  isComparing = false
}: MuscleDetailProps) {
  // Determine color theme for the postural tendencies
  const getTendencyTheme = (tendency: Muscle['tendency']) => {
    switch (tendency) {
      case 'zkracování':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-500',
          badge: 'Tonic sval – náchylný ke zkrácení & přetížení',
          icon: 'AlertTriangle'
        };
      case 'ochabování':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          dot: 'bg-cyan-400',
          badge: 'Phasic sval – náchylný k ochabnutí & útlumu',
          icon: 'Minus'
        };
      case 'přetěžování':
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-500',
          badge: 'Náchylný k přetěžování při špatném stereotypu',
          icon: 'Flame'
        };
    }
  };

  const theme = getTendencyTheme(muscle.tendency);
  const groupInfo = MUSCLE_GROUPS[muscle.groupKey as keyof typeof MUSCLE_GROUPS] || {
    name: muscle.group,
    color: 'from-slate-500 to-slate-600'
  };

  return (
    <div 
      className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6 shadow-xl text-[#E4E4E7] flex flex-col gap-6 scroll-mt-24"
      id={`detail-${muscle.id}`}
    >
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#27272A]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[#1C1C1F] text-cyan-400 border border-cyan-500/20`}>
              {muscle.group}
            </span>
            <span className="text-[9px] bg-[#1C1C1F] text-[#71717A] border border-[#27272A] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
              Pohled: {muscle.view === 'anterior' ? 'Přední' : muscle.view === 'posterior' ? 'Zadní' : 'Oboustranný'}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-0.5 flex items-center gap-2 font-display">
            {muscle.nameCs}
          </h2>
          <p className="text-xs text-[#71717A] font-mono italic">{muscle.nameLa}</p>
        </div>

        {/* Action Buttons Area */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-start">
          <button
            onClick={() => {
              const searchInput = document.getElementById('muscle-search-input');
              if (searchInput) {
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                  searchInput.focus({ preventScroll: true });
                }, 500);
              }
            }}
            className="px-3 py-1.5 bg-[#1C1C1F] hover:bg-[#27272A] text-xs text-cyan-400 rounded border border-cyan-500/25 hover:border-cyan-400 transition flex items-center gap-1.5 font-semibold shadow cursor-pointer select-none"
            title="Sjet nahoru k vyhledávání"
            id="btn-back-to-search-detail"
          >
            <Search size={12} className="shrink-0 text-cyan-400" />
            Zpět k vyhledávání
          </button>

          {onAddToCompare && !isComparing && (
            <button
              onClick={() => onAddToCompare(muscle)}
              className="px-3 py-1.5 bg-[#1C1C1F] hover:bg-cyan-500 hover:text-black active:bg-cyan-600 text-xs text-[#D4D4D8] rounded border border-[#27272A] hover:border-transparent transition flex items-center gap-1.5 font-semibold shadow cursor-pointer select-none"
              title="Přidat do srovnávače svalů"
              id={`btn-add-compare-${muscle.id}`}
            >
              <RefreshCw size={12} className="shrink-0" />
              Srovnat s jiným
            </button>
          )}
        </div>
      </div>

      {/* Anatomického Upnutí Nákres */}
      <AnatomyPointsMap muscleId={muscle.id} />

      {/* Origin and Insertion Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origin / Začátek svalu */}
        <div className="bg-[#121214]/60 rounded-xl p-4 border border-[#27272A] hover:border-cyan-500/20 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex items-center justify-center w-5.5 h-5.5 rounded bg-cyan-950 text-cyan-400 font-bold text-xs border border-cyan-800/20">
              O
            </div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Začátek (Origo)</h4>
          </div>
          <p className="text-sm text-[#D4D4D8] leading-relaxed font-sans">{muscle.origin}</p>
        </div>

        {/* Insertion / Úpon svalu */}
        <div className="bg-[#121214]/60 rounded-xl p-4 border border-[#27272A] hover:border-cyan-500/20 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex items-center justify-center w-5.5 h-5.5 rounded bg-amber-950 text-amber-400 font-bold text-xs border border-amber-800/20">
              I
            </div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Úpon (Insertio)</h4>
          </div>
          <p className="text-sm text-[#D4D4D8] leading-relaxed font-sans">{muscle.insertion}</p>
        </div>
      </div>

      {/* Tendencies Block */}
      <div className={`rounded-xl border p-4 ${theme.bg}`}>
        <div className="flex items-center gap-2.5 mb-2.5 font-display">
          <span className={`w-2.5 h-2.5 rounded-full ${theme.dot} block animate-pulse`}></span>
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Svalové tendence a chování
          </h4>
        </div>
        <div className="text-[10px] font-bold bg-white/5 py-1 px-2.5 rounded-md inline-block mb-2 border border-white/5 uppercase tracking-wide">
          {theme.badge}
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          {muscle.tendencyDesc}
        </p>
      </div>

      {/* Movements & Real life example */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Movements / Funkce */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-1.5 font-display">
            <Compass size={14} className="text-cyan-400" />
            Vykonávané Pohyby (Funkce)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {muscle.actions.map((act, index) => (
              <span 
                key={index} 
                className="text-xs bg-[#1C1C1F] border border-[#27272A] hover:border-cyan-500/20 text-[#E4E4E7] px-2.5 py-1 rounded transition-colors font-medium"
              >
                {act}
              </span>
            ))}
          </div>
          <p className="text-xs text-[#71717A] italic leading-relaxed">
            {muscle.actionsDesc}
          </p>
        </div>

        {/* Real Life Example / Běžný život */}
        <div className="bg-gradient-to-br from-[#121214] to-[#0F0F11] p-4 rounded-xl border border-[#27272A]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-1.5 mb-2.5 font-display">
            <Sparkles size={14} className="text-cyan-400" />
            Uplatnění v běžném životě
          </h4>
          <p className="text-sm text-[#A1A1AA] leading-relaxed mb-3">
            {muscle.realLifeExample}
          </p>
          <div className="text-xs text-[#A1A1AA] bg-[#1C1C1F] py-1.5 px-3 rounded border border-[#27272A] flex items-center gap-2">
            <Dumbbell size={12} className="text-[#22D3EE] shrink-0" />
            <span>
              <strong>Doporučený cvik:</strong> {muscle.exerciseExample}
            </span>
          </div>
        </div>
      </div>


      {/* Medical/Trivia Notes */}
      {muscle.medicalNotes && (
        <div className="bg-[#121214] px-4 py-3 rounded-xl border border-[#27272A] flex items-start gap-2.5">
          <BookOpen className="text-cyan-400 shrink-0 mt-0.5" size={15} />
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 block mb-0.5 font-display">
              Anatomická a klinická zajímavost
            </span>
            <p className="text-xs text-[#D4D4D8] leading-relaxed">
              {muscle.medicalNotes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
