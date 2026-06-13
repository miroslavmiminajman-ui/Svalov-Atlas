/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Muscle, musclesData, MUSCLE_GROUPS } from '../data/muscles';
import { Search, Flame, Timer, Activity, Heart, ArrowRight, Compass, ShieldAlert, CheckCircle, Smile } from 'lucide-react';

interface StretchingGuideProps {
  onSelectAndLocateMuscle: (muscleId: string) => void;
}

export default function StretchingGuide({ onSelectAndLocateMuscle }: StretchingGuideProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [onlyTonic, setOnlyTonic] = useState(false);

  // Suggested quick tags to search
  const quickTags = ['Krk', 'Záda', 'Hýždě', 'Lýtka', 'Prsa', 'Hamstringy'];

  const filteredStretchMuscles = useMemo(() => {
    return musclesData.filter((muscle) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        muscle.nameCs.toLowerCase().includes(query) ||
        muscle.nameLa.toLowerCase().includes(query) ||
        muscle.stretching.toLowerCase().includes(query) ||
        muscle.group.toLowerCase().includes(query);

      // 2. Muscle Group
      const matchesGroup = selectedGroup === 'all' || muscle.groupKey === selectedGroup;

      // 3. Only Tonic (tendency to shorten)
      const matchesTonic = !onlyTonic || muscle.tendency === 'zkracování';

      return matchesSearch && matchesGroup && matchesTonic;
    }).sort((a, b) => {
      // Prioritize muscles with 'zkracování' (tonic) so they sit at the top
      if (a.tendency === 'zkracování' && b.tendency !== 'zkracování') return -1;
      if (a.tendency !== 'zkracování' && b.tendency === 'zkracování') return 1;
      return a.nameCs.localeCompare(b.nameCs);
    });
  }, [searchQuery, selectedGroup, onlyTonic]);

  return (
    <div className="bg-[#0F0F11] border border-[#27272A] rounded-2xl p-6 shadow-xl text-[#E4E4E7] flex flex-col gap-6" id="stretching-guide">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2.5 font-display">
            <Heart className="text-rose-500 fill-rose-500/10 animate-pulse" size={22} />
            Metodický Průvodce Protahováním
          </h3>
          <p className="text-xs text-[#71717A] mt-1">
            Uvolnění, regenerace a odstranění svalového zkratu pro správné držení těla (Prof. Janda)
          </p>
        </div>

        {/* Tonic Toggle Counter badge */}
        <button
          onClick={() => setOnlyTonic(!onlyTonic)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 border ${
            onlyTonic 
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
              : 'bg-[#121214] text-[#A1A1AA] border-[#27272A] hover:bg-[#1C1C1F]'
          }`}
          id="btn-toggle-tonic-only"
        >
          <Flame size={13} className={onlyTonic ? 'text-rose-450 animate-bounce' : 'text-[#71717A]'} />
          Jen ohrožené svaly (Zkracující se)
        </button>
      </div>

      {/* Janda stretching school tip cards */}
      <div className="bg-[#121214] border border-[#27272A] rounded-xl p-4 text-xs leading-relaxed text-[#D4D4D8] grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-bold text-rose-400 uppercase tracking-wide block mb-1">Pravidla správného strečinku svalů:</span>
          <ul className="list-disc pl-4 space-y-1 text-slate-300">
            <li><strong>Nejprve protáhnout, pak posílit:</strong> Zkrácené tonické svaly fungují jako brzda, nepustí protilehlý sval k aktivaci.</li>
            <li><strong>Plynulost nad silou:</strong> Nikdy v protažení nekmitat ani nechodit přes ostrou bolest. Tah musí být tupý a příjemný.</li>
          </ul>
        </div>
        <div>
          <span className="font-bold text-cyan-400 uppercase tracking-wide block mb-1">Dýchání a časování:</span>
          <ul className="list-disc pl-4 space-y-1 text-slate-300">
            <li><strong>Statická výdrž:</strong> Setrvejte v konečné poloze <strong>30 až 45 sekund</strong>. Ideálně 3 tiché nádechy a pomalé výdechy.</li>
            <li><strong>Asistence dechu:</strong> S nádechem sval mírně zpevněte, **s hlubokým výdechem a uvolněním** zvětšete rozsah protažení (postizometrická relaxace).</li>
          </ul>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Vyhledat sval pro strečink..."
            className="w-full bg-[#121214] border border-[#27272A] focus:border-rose-500/50 text-[#E4E4E7] placeholder-[#71717A] pl-10 pr-4 py-2 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-rose-500/30 focus:outline-none transition"
            id="stretching-search-input"
          />
        </div>

        {/* Muscle Group dropdown */}
        <div className="w-full sm:w-[180px] shrink-0">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full bg-[#121214] border border-[#27272A] text-[#D4D4D8] rounded-xl p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500/30"
            id="stretching-group-select"
          >
            <option value="all">Všechny partie</option>
            {Object.entries(MUSCLE_GROUPS).map(([key, info]) => (
              <option key={key} value={key}>
                {info.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List results counter */}
      <div className="flex items-center justify-between text-[11px] text-[#71717A] px-1 font-mono">
        <span>Seznam strečinkových návodů ({filteredStretchMuscles.length} svalů)</span>
        {onlyTonic && (
          <span className="text-rose-400 uppercase tracking-wide text-[9px] font-bold">Zobrazeny pouze svaly se zkrácenou tendencí</span>
        )}
      </div>

      {/* STRETCH CARDS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredStretchMuscles.map((muscle) => {
          const isTonic = muscle.tendency === 'zkracování';
          const groupInfo = MUSCLE_GROUPS[muscle.groupKey as keyof typeof MUSCLE_GROUPS];
          
          return (
            <div
              key={muscle.id}
              className={`bg-gradient-to-b from-[#121214] to-[#0F0F11] border rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#3F3F46] hover:shadow-lg hover:shadow-black/20 ${
                isTonic 
                  ? 'border-rose-500/10 hover:border-rose-500/30 shadow-sm shadow-rose-950/5' 
                  : 'border-[#27272A]'
              }`}
              id={`stretch-card-${muscle.id}`}
            >
              <div>
                {/* Visual badges row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-[#1C1C1F] text-[#A1A1AA] border border-[#27272A] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                      {groupInfo?.name || muscle.group}
                    </span>
                  </div>
                  
                  {isTonic ? (
                    <span className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                      <Flame size={10} />
                      Tonic / Zkracuje se
                    </span>
                  ) : (
                    <span className="text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Phasic / Ochabuje
                    </span>
                  )}
                </div>

                {/* Muscle names header */}
                <h4 className="text-sm font-bold text-white mb-0.5 font-display flex items-center gap-1.5">
                  {muscle.nameCs}
                </h4>
                <p className="text-[10px] text-[#71717A] font-mono italic mb-4">{muscle.nameLa}</p>

                {/* STRETCH INSTRUCTION BOX */}
                <div className="bg-[#09090B]/60 rounded-lg p-3.5 border border-[#27272A]/50 mb-4 flex flex-col gap-2.5">
                  <div className="flex items-start gap-2 text-xs">
                    <Compass className="text-rose-400 mt-0.5 shrink-0" size={13} />
                    <div>
                      <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wide block mb-0.5">Postup protažení:</span>
                      <p className="text-xs text-[#D4D4D8] leading-relaxed font-sans font-medium">{muscle.stretching}</p>
                    </div>
                  </div>

                  {/* Stretching cues */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#27272A]/30 text-[10px] text-[#A1A1AA] font-sans">
                    <div className="flex items-center gap-1.5">
                      <Timer className="text-rose-400 shrink-0" size={11} />
                      <span><strong>Trvání:</strong> 30–45s</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Activity className="text-[#34D399] shrink-0" size={11} />
                      <span><strong>Dech:</strong> Dlouhý výdech</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer actions */}
              <div className="pt-3 border-t border-[#27272A]/30 flex items-center justify-between">
                <span className="text-[9px] text-[#71717A] italic">
                  Upnutí: {muscle.origin.split(',')[0]} • {muscle.insertion.split(',')[0]}
                </span>
                
                <button
                  onClick={() => onSelectAndLocateMuscle(muscle.id)}
                  className="px-2.5 py-1 text-[10px] font-bold bg-[#1C1C1F] text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-black hover:border-transparent rounded transition-all duration-150 flex items-center gap-1 font-sans shadow"
                  id={`btn-locate-stretch-${muscle.id}`}
                >
                  Prohlédnout v Atlasu
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredStretchMuscles.length === 0 && (
          <div className="col-span-full text-center py-12 text-[#71717A] flex flex-col items-center justify-center gap-2">
            <ShieldAlert size={28} className="opacity-25" />
            <p className="text-xs">Žádné svaly neodpovídají zvoleným filtrům vyhledávání.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedGroup('all'); setOnlyTonic(false); }}
              className="text-xs text-rose-400 underline hover:text-rose-350 font-bold"
            >
              Resetovat filtry protažení
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
