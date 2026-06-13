/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Muscle, MUSCLE_GROUPS, musclesData } from '../data/muscles';

interface AnatomyModelProps {
  selectedMuscleId: string | null;
  onSelectMuscle: (id: string | null) => void;
  filteredMuscles: Muscle[];
}

export default function AnatomyModel({
  selectedMuscleId,
  onSelectMuscle: onSelectMuscleProp,
  filteredMuscles,
}: AnatomyModelProps) {
  const [activeView, setActiveView] = useState<'anterior' | 'posterior'>('anterior');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Helper to check if a muscle has been selected (handles zone maps and aliases)
  const isSelected = (id: string) => {
    if (!selectedMuscleId) return false;
    if (selectedMuscleId === id) return true;
    const selectedMuscle = musclesData.find(m => m.id === selectedMuscleId);
    return selectedMuscle ? (selectedMuscle.highlightId === id || selectedMuscle.id === id) : false;
  };

  // Helper to check if a muscle is present in the current filter list
  const isFiltered = (id: string) => {
    return filteredMuscles.some((m) => m.id === id || m.highlightId === id);
  };

  // Helper to check if a muscle/zone is hovered
  const isHovered = (id: string) => {
    if (!hoveredId) return false;
    if (hoveredId === id) return true;
    const muscle = filteredMuscles.find((m) => m.id === hoveredId);
    return muscle ? (muscle.highlightId === id || muscle.id === id) : false;
  };

  // Intercept the onSelectMuscle to allow cycling through muscles in the same SVG zone/group
  const onSelectMuscle = (zoneId: string | null) => {
    if (zoneId === null) {
      onSelectMuscleProp(null);
      return;
    }
    // intercept selection to support muscle groups / splits in that zone
    const matching = filteredMuscles.filter((m) => m.id === zoneId || m.highlightId === zoneId);
    if (matching.length === 0) {
      onSelectMuscleProp(zoneId);
      return;
    }

    const currentIdx = matching.findIndex(m => m.id === selectedMuscleId);
    if (currentIdx !== -1) {
      if (currentIdx === matching.length - 1) {
        onSelectMuscleProp(null);
      } else {
        onSelectMuscleProp(matching[currentIdx + 1].id);
      }
    } else {
      onSelectMuscleProp(matching[0].id);
    }
  };

  // Styling helper for the muscle zones
  const getZoneClassName = (id: string, groupKey: string) => {
    const isSel = isSelected(id);
    const isHov = isHovered(id);
    const isFilt = isFiltered(id);

    let base = 'transition-all duration-300 cursor-pointer stroke-white/20 stroke-1';
    
    if (!isFilt) {
      return `${base} fill-gray-800/10 opacity-30 cursor-not-allowed pointer-events-none`;
    }

    if (isSel) {
      return `${base} fill-cyan-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.73)] z-20 stroke-cyan-200 stroke-2`;
    }

    if (isHov) {
      return `${base} fill-cyan-450 opacity-95 z-10 stroke-cyan-100`;
    }

    // Default colors based on muscle groups
    switch (groupKey) {
      case 'neck':
        return `${base} fill-amber-500/40 hover:fill-amber-500/60`;
      case 'chest':
        return `${base} fill-rose-500/40 hover:fill-rose-500/60`;
      case 'back':
        return `${base} fill-emerald-500/40 hover:fill-emerald-500/60`;
      case 'abdomen':
        return `${base} fill-cyan-500/40 hover:fill-cyan-500/60`;
      case 'shoulder':
        return `${base} fill-violet-500/40 hover:fill-violet-500/60`;
      case 'arms':
        return `${base} fill-pink-500/40 hover:fill-pink-500/60`;
      case 'forearms':
        return `${base} fill-fuchsia-500/40 hover:fill-fuchsia-500/60`;
      case 'hips':
        return `${base} fill-indigo-500/40 hover:fill-indigo-500/60`;
      case 'glutes':
        return `${base} fill-teal-500/40 hover:fill-teal-500/60`;
      case 'thighs_front':
        return `${base} fill-orange-500/30 hover:fill-orange-500/50`;
      case 'thighs_back':
        return `${base} fill-purple-500/40 hover:fill-purple-500/60`;
      case 'calves':
        return `${base} fill-yellow-500/40 hover:fill-yellow-500/60`;
      default:
        return `${base} fill-slate-500/40 hover:fill-slate-500/60`;
    }
  };

  // Label resolving
  const getHoveredName = () => {
    if (!hoveredId) return null;
    // first try to find direct match
    let muscle = filteredMuscles.find((m) => m.id === hoveredId);
    if (!muscle) {
      // try to find first muscle matching this as highlightId
      muscle = filteredMuscles.find((m) => m.highlightId === hoveredId);
    }
    if (muscle) {
      // If there are multiple matching in this zone, show that clicking cycles them!
      const allZone = filteredMuscles.filter(m => m.id === muscle.id || m.highlightId === (muscle.highlightId || muscle.id));
      if (allZone.length > 1) {
        return `${muscle.nameCs} (klikáním přepínáte: ${allZone.map(z => z.nameCs.replace(/(Čtyřhlavého svalu|Dvojhlavý sval stehenní)/i, '').trim()).join(' / ')})`;
      }
      return `${muscle.nameCs} (${muscle.nameLa})`;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6 shadow-xl" id="anatomy-model">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Interaktivní Model Těla
          </h3>
          <p className="text-xs text-[#71717A]">Klepnutím nebo přejetím zobrazíte anatomický rozbor</p>
        </div>

        {/* View Toggle tabs - aligned vertically */}
        <div className="flex flex-col gap-1 w-full sm:w-40 bg-[#121214] p-1 rounded-xl border border-[#27272A] self-start sm:self-center">
          <button
            onClick={() => setActiveView('anterior')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold select-none transition-all border shrink-0 w-full text-center ${
              activeView === 'anterior'
                ? 'bg-[#1C1C1F] text-cyan-400 border-[#27272A] shadow-md shadow-black/40'
                : 'text-[#71717A] hover:text-[#A1A1AA] border-transparent'
            }`}
            id="btn-anterior-view"
          >
            Přední pohled
          </button>
          <button
            onClick={() => setActiveView('posterior')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold select-none transition-all border shrink-0 w-full text-center ${
              activeView === 'posterior'
                ? 'bg-[#1C1C1F] text-cyan-400 border-[#27272A] shadow-md shadow-black/40'
                : 'text-[#71717A] hover:text-[#A1A1AA] border-transparent'
            }`}
            id="btn-posterior-view"
          >
            Zadní pohled
          </button>
        </div>
      </div>

      {/* Model Canvas area */}
      <div className="relative flex-1 flex items-center justify-center min-h-[460px] bg-[#121214]/60 rounded-xl border border-[#27272A]/80 p-4 overflow-hidden">
        
        {/* Dynamic Tooltip */}
        <div className="absolute top-4 left-4 right-4 text-center pointer-events-none z-30 transition-all">
          {getHoveredName() ? (
            <div className="inline-flex items-center gap-2 bg-[#1C1C1F] text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-full text-xs font-medium shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              {getHoveredName()}
            </div>
          ) : (
            <span className="text-[#52525B] text-xs">Klepněte nebo najeďte na sval pro prozkoumání</span>
          )}
        </div>

        {/* SVG Drawing Canvas of Body */}
        {activeView === 'anterior' ? (
          /* ANTERIOR (FRONT) VIEW */
          <svg
            viewBox="0 0 240 500"
            className="w-full h-full max-h-[520px] select-none"
            id="anterior-svg"
          >
            {/* Outline background body silhouette for styling */}
            <path
              d="M120,40 C132,40 135,15 120,15 C105,15 108,39 120,40 Z M120,40 L120,70"
              className="stroke-slate-800 stroke-2 fill-none"
            />
            {/* Base skeletal torso back plate */}
            <rect x="90" y="80" width="60" height="150" rx="20" className="fill-[#1A1A1E]/80 stroke-[#27272A] stroke-1" />
            <rect x="110" y="230" width="20" height="140" rx="5" className="fill-[#1A1A1E]/80 stroke-[#27272A]/80 stroke-1" />

            {/* --- NECK FRONT --- */}
            {/* Zdvihač hlavy (Sternocleidomastoid) Left */}
            <path
              id="sternocleidomastoid-left"
              d="M110,50 C105,53 103,63 105,74 C100,74 97,71 105,55 Z"
              className={getZoneClassName('sternocleidomastoid', 'neck')}
              onMouseEnter={() => setHoveredId('sternocleidomastoid')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('sternocleidomastoid') && onSelectMuscle('sternocleidomastoid')}
            />
            {/* Zdvihač hlavy (Sternocleidomastoid) Right */}
            <path
              id="sternocleidomastoid-right"
              d="M130,50 C135,53 137,63 135,74 C140,74 143,71 135,55 Z"
              className={getZoneClassName('sternocleidomastoid', 'neck')}
              onMouseEnter={() => setHoveredId('sternocleidomastoid')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('sternocleidomastoid') && onSelectMuscle('sternocleidomastoid')}
            />
            {/* Kloněné svaly (Scalenes) */}
            <path
              id="scalenes-left"
              d="M102,52 C98,58 95,66 98,72 L103,72 C101,65 101,57 102,52 Z"
              className={getZoneClassName('scalene_muscles', 'neck')}
              onMouseEnter={() => setHoveredId('scalene_muscles')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('scalene_muscles') && onSelectMuscle('scalene_muscles')}
            />
            <path
              id="scalenes-right"
              d="M138,52 C142,58 145,66 142,72 L137,72 C139,65 139,57 138,52 Z"
              className={getZoneClassName('scalene_muscles', 'neck')}
              onMouseEnter={() => setHoveredId('scalene_muscles')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('scalene_muscles') && onSelectMuscle('scalene_muscles')}
            />

            {/* --- SHOULDER DELTOIDS FRONT --- */}
            {/* Deltový sval (Deltoideus) Left */}
            <path
              id="deltoid-left"
              d="M93,75 C77,78 70,95 72,110 C75,108 81,102 85,90 Z"
              className={getZoneClassName('deltoideus', 'shoulder')}
              onMouseEnter={() => setHoveredId('deltoideus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('deltoideus') && onSelectMuscle('deltoideus')}
            />
            {/* Deltový sval (Deltoideus) Right */}
            <path
              id="deltoid-right"
              d="M147,75 C163,78 170,95 168,110 C165,108 159,102 155,90 Z"
              className={getZoneClassName('deltoideus', 'shoulder')}
              onMouseEnter={() => setHoveredId('deltoideus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('deltoideus') && onSelectMuscle('deltoideus')}
            />

            {/* --- CHEST --- */}
            {/* Velký sval prsní (Pectoralis major) Left */}
            <path
              id="pectoralis-major-left"
              d="M120,76 L120,111 C110,115 101,118 90,115 C88,103 89,90 95,78 C105,75 110,75 120,76 Z"
              className={getZoneClassName('pectoralis_major', 'chest')}
              onMouseEnter={() => setHoveredId('pectoralis_major')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('pectoralis_major') && onSelectMuscle('pectoralis_major')}
            />
            {/* Velký sval prsní (Pectoralis major) Right */}
            <path
              id="pectoralis-major-right"
              d="M120,76 L120,111 C130,115 139,118 150,115 C152,103 151,90 145,78 C135,75 130,75 120,76 Z"
              className={getZoneClassName('pectoralis_major', 'chest')}
              onMouseEnter={() => setHoveredId('pectoralis_major')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('pectoralis_major') && onSelectMuscle('pectoralis_major')}
            />
            {/* Malý sval prsní - rendered deep inside the left pectoralis */}
            <path
              id="pectoralis-minor-deep"
              d="M132,84 L142,95 L132,100 Z"
              className={getZoneClassName('pectoralis_minor', 'chest')}
              onMouseEnter={() => setHoveredId('pectoralis_minor')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('pectoralis_minor') && onSelectMuscle('pectoralis_minor')}
            />
            {/* Přední sval pilovitý (Serratus anterior) */}
            <path
              id="serratus-left"
              d="M87,118 C85,125 84,136 86,145 C89,142 91,135 91,120 Z"
              className={getZoneClassName('serratus_anterior', 'chest')}
              onMouseEnter={() => setHoveredId('serratus_anterior')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('serratus_anterior') && onSelectMuscle('serratus_anterior')}
            />
            <path
              id="serratus-right"
              d="M153,118 C155,125 156,136 154,145 C151,142 149,135 149,120 Z"
              className={getZoneClassName('serratus_anterior', 'chest')}
              onMouseEnter={() => setHoveredId('serratus_anterior')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('serratus_anterior') && onSelectMuscle('serratus_anterior')}
            />

            {/* --- ARMS --- */}
            {/* Biceps Left */}
            <path
              id="biceps-left"
              d="M71,114 C65,124 64,139 67,152 C71,150 74,142 74,124 Z"
              className={getZoneClassName('biceps_brachii', 'arms')}
              onMouseEnter={() => setHoveredId('biceps_brachii')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('biceps_brachii') && onSelectMuscle('biceps_brachii')}
            />
            {/* Biceps Right */}
            <path
              id="biceps-right"
              d="M169,114 C175,124 176,139 173,152 C169,150 166,142 166,124 Z"
              className={getZoneClassName('biceps_brachii', 'arms')}
              onMouseEnter={() => setHoveredId('biceps_brachii')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('biceps_brachii') && onSelectMuscle('biceps_brachii')}
            />
            {/* Forearm (Brachioradialis) Left */}
            <path
              id="forearm-left"
              d="M66,155 C57,170 54,195 56,220 L62,220 C64,200 68,180 69,158 Z"
              className={getZoneClassName('brachioradialis', 'forearms')}
              onMouseEnter={() => setHoveredId('brachioradialis')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('brachioradialis') && onSelectMuscle('brachioradialis')}
            />
            {/* Forearm (Brachioradialis) Right */}
            <path
              id="forearm-right"
              d="M174,155 C183,170 186,195 184,220 L178,220 C176,200 172,180 171,158 Z"
              className={getZoneClassName('brachioradialis', 'forearms')}
              onMouseEnter={() => setHoveredId('brachioradialis')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('brachioradialis') && onSelectMuscle('brachioradialis')}
            />

            {/* --- ABDOMEN --- */}
            {/* Přímý sval břišní (Rectus abdominis) */}
            <path
              id="rectus-abdominis"
              d="M109,122 L131,122 L131,195 L109,195 Z"
              className={getZoneClassName('rectus_abdominis', 'abdomen')}
              onMouseEnter={() => setHoveredId('rectus_abdominis')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('rectus_abdominis') && onSelectMuscle('rectus_abdominis')}
            />
            {/* Šikmé svaly břišní (Obliques) Left */}
            <path
              id="oblique-left"
              d="M107,122 L107,195 C98,185 93,165 94,122 Z"
              className={getZoneClassName('obliques', 'abdomen')}
              onMouseEnter={() => setHoveredId('obliques')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('obliques') && onSelectMuscle('obliques')}
            />
            {/* Šikmé svaly břišní (Obliques) Right */}
            <path
              id="oblique-right"
              d="M133,122 L133,195 C142,185 147,165 146,122 Z"
              className={getZoneClassName('obliques', 'abdomen')}
              onMouseEnter={() => setHoveredId('obliques')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('obliques') && onSelectMuscle('obliques')}
            />
            {/* Příčný sval břišní (Transversus abdominis) - horizontal band at bottom */}
            <path
              id="transversus-abdominis"
              d="M99,196 C105,198 135,198 141,196 L135,212 L105,212 Z"
              className={getZoneClassName('transversus_abdominis', 'abdomen')}
              onMouseEnter={() => setHoveredId('transversus_abdominis')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('transversus_abdominis') && onSelectMuscle('transversus_abdominis')}
            />

            {/* --- PELVIS & HIPS FRONT --- */}
            {/* Sval bedrokyčlostehenní (Iliopsoas) Left */}
            <path
              id="iliopsoas-left"
              d="M108,214 L114,214 L112,240 L104,233 Z"
              className={getZoneClassName('iliopsoas', 'hips')}
              onMouseEnter={() => setHoveredId('iliopsoas')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('iliopsoas') && onSelectMuscle('iliopsoas')}
            />
            {/* Sval bedrokyčlostehenní (Iliopsoas) Right */}
            <path
              id="iliopsoas-right"
              d="M132,214 L126,214 L128,240 L136,233 Z"
              className={getZoneClassName('iliopsoas', 'hips')}
              onMouseEnter={() => setHoveredId('iliopsoas')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('iliopsoas') && onSelectMuscle('iliopsoas')}
            />

            {/* --- THIGHS FRONT --- */}
            {/* Kvadriceps (Quadriceps femoris) Left - Divided */}
            {/* Rectus femoris Left */}
            <path
              id="rectus-femoris-left"
              d="M96,241 C94,270 93,300 97,330 C100,330 102,300 103,270 L101,241 Z"
              className={getZoneClassName('rectus_femoris', 'thighs_front')}
              onMouseEnter={() => setHoveredId('rectus_femoris')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('rectus_femoris') && onSelectMuscle('rectus_femoris')}
            />
            {/* Vastus lateralis Left */}
            <path
              id="vastus-lateralis-left"
              d="M94,241 C88,270 85,310 93,340 C95,335 96,300 96,252 Z"
              className={getZoneClassName('vastus_lateralis', 'thighs_front')}
              onMouseEnter={() => setHoveredId('vastus_lateralis')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('vastus_lateralis') && onSelectMuscle('vastus_lateralis')}
            />
            {/* Vastus medialis Left */}
            <path
              id="vastus-medialis-left"
              d="M102,270 L104,295 C107,310 107,325 101,338 C102,310 101,280 102,270 Z"
              className={getZoneClassName('vastus_medialis', 'thighs_front')}
              onMouseEnter={() => setHoveredId('vastus_medialis')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('vastus_medialis') && onSelectMuscle('vastus_medialis')}
            />

            {/* Kvadriceps (Quadriceps femoris) Right - Divided */}
            {/* Rectus femoris Right */}
            <path
              id="rectus-femoris-right"
              d="M144,241 C146,270 147,300 143,330 C140,330 138,300 137,270 L139,241 Z"
              className={getZoneClassName('rectus_femoris', 'thighs_front')}
              onMouseEnter={() => setHoveredId('rectus_femoris')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('rectus_femoris') && onSelectMuscle('rectus_femoris')}
            />
            {/* Vastus lateralis Right */}
            <path
              id="vastus-lateralis-right"
              d="M146,241 C152,270 155,310 147,340 C145,335 144,300 144,252 Z"
              className={getZoneClassName('vastus_lateralis', 'thighs_front')}
              onMouseEnter={() => setHoveredId('vastus_lateralis')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('vastus_lateralis') && onSelectMuscle('vastus_lateralis')}
            />
            {/* Vastus medialis Right */}
            <path
              id="vastus-medialis-right"
              d="M138,270 L136,295 C133,310 133,325 139,338 C138,310 139,280 138,270 Z"
              className={getZoneClassName('vastus_medialis', 'thighs_front')}
              onMouseEnter={() => setHoveredId('vastus_medialis')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('vastus_medialis') && onSelectMuscle('vastus_medialis')}
            />
            {/* Krejčovský sval (Sartorius) Left (diagonal band) */}
            <path
              id="sartorius-left"
              d="M100,240 C95,260 106,310 105,338 C100,320 101,280 100,240"
              className={getZoneClassName('sartorius', 'thighs_front')}
              onMouseEnter={() => setHoveredId('sartorius')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('sartorius') && onSelectMuscle('sartorius')}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Krejčovský sval (Sartorius) Right (diagonal band) */}
            <path
              id="sartorius-right"
              d="M140,240 C145,260 134,310 135,338 C140,320 139,280 140,240"
              className={getZoneClassName('sartorius', 'thighs_front')}
              onMouseEnter={() => setHoveredId('sartorius')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('sartorius') && onSelectMuscle('sartorius')}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Přitahovače stehna (Adduktory) Left */}
            <path
              id="adductors-left"
              d="M109,241 L116,241 L112,310 L108,290 Z"
              className={getZoneClassName('adductor_magnus', 'thighs_front')}
              onMouseEnter={() => setHoveredId('adductor_magnus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('adductor_magnus') && onSelectMuscle('adductor_magnus')}
            />
            {/* Přitahovače stehna (Adduktory) Right */}
            <path
              id="adductors-right"
              d="M131,241 L124,241 L128,310 L132,290 Z"
              className={getZoneClassName('adductor_magnus', 'thighs_front')}
              onMouseEnter={() => setHoveredId('adductor_magnus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('adductor_magnus') && onSelectMuscle('adductor_magnus')}
            />

            {/* --- SHINS AND FEET --- */}
            {/* Přední sval holenní (Tibialis anterior) Left */}
            <path
              id="tibialis-left"
              d="M93,365 C91,390 91,425 96,450 L91,450 C86,420 86,390 89,365 Z"
              className={getZoneClassName('tibialis_anterior', 'calves')}
              onMouseEnter={() => setHoveredId('tibialis_anterior')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('tibialis_anterior') && onSelectMuscle('tibialis_anterior')}
            />
            {/* Přední sval holenní (Tibialis anterior) Right */}
            <path
              id="tibialis-right"
              d="M147,365 C149,390 149,425 144,450 L149,450 C154,420 154,390 151,365 Z"
              className={getZoneClassName('tibialis_anterior', 'calves')}
              onMouseEnter={() => setHoveredId('tibialis_anterior')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('tibialis_anterior') && onSelectMuscle('tibialis_anterior')}
            />
          </svg>
        ) : (
          /* POSTERIOR (BACK) VIEW */
          <svg
            viewBox="0 0 240 500"
            className="w-full h-full max-h-[520px] select-none"
            id="posterior-svg"
          >
            {/* Outline body silhouette */}
            <path
              d="M120,40 C132,40 135,15 120,15 C105,15 108,39 120,40 Z M120,40 L120,70"
              className="stroke-slate-850 stroke-2 fill-none"
            />
            <rect x="90" y="80" width="60" height="150" rx="20" className="fill-[#1A1A1E]/80 stroke-[#27272A] stroke-1" />
            <rect x="110" y="230" width="20" height="140" rx="5" className="fill-[#1A1A1E]/80 stroke-[#27272A]/40 stroke-1" />

            {/* --- NECK & UPPER BACK TRAPEZIUS --- */}
            {/* Trapézový sval (Trapezius) - distinct diamond shape on the back */}
            <path
              id="trapezius-full"
              d="M120,48 L142,75 L152,90 L120,135 L88,90 L98,75 Z"
              className={getZoneClassName('trapezius', 'back')}
              onMouseEnter={() => setHoveredId('trapezius')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('trapezius') && onSelectMuscle('trapezius')}
            />
            {/* Malý rombický sval (Rhomboid Minor) */}
            <path
              id="rhomboid-minor"
              d="M109,98 L131,98 L129.5,104 L110.5,104 Z"
              className={getZoneClassName('rhomboideus_minor', 'back')}
              onMouseEnter={() => setHoveredId('rhomboideus_minor')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('rhomboideus_minor') && onSelectMuscle('rhomboideus_minor')}
            />
            {/* Velký rombický sval (Rhomboid Major) */}
            <path
              id="rhomboid-major"
              d="M110.5,104 L129.5,104 L126,114 L114,114 Z"
              className={getZoneClassName('rhomboideus_major', 'back')}
              onMouseEnter={() => setHoveredId('rhomboideus_major')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('rhomboideus_major') && onSelectMuscle('rhomboideus_major')}
            />

            {/* --- MIDDLE & LOWER BACK --- */}
            {/* Široký sval zádový (Latissimus dorsi) Left */}
            <path
              id="latissimus-left"
              d="M120,135 L87,130 C80,150 82,185 100,205 L120,205 Z"
              className={getZoneClassName('latissimus_dorsi', 'back')}
              onMouseEnter={() => setHoveredId('latissimus_dorsi')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('latissimus_dorsi') && onSelectMuscle('latissimus_dorsi')}
            />
            {/* Široký sval zádový (Latissimus dorsi) Right */}
            <path
              id="latissimus-right"
              d="M120,135 L153,130 C160,150 158,185 140,205 L120,205 Z"
              className={getZoneClassName('latissimus_dorsi', 'back')}
              onMouseEnter={() => setHoveredId('latissimus_dorsi')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('latissimus_dorsi') && onSelectMuscle('latissimus_dorsi')}
            />
            {/* Vzpřimovač páteře (Erector spinae) - deep vertical strips along lumbar */}
            <path
              id="erector-left"
              d="M110,135 L110,210 L117,210 L117,135 Z"
              className={getZoneClassName('erector_spinae', 'back')}
              onMouseEnter={() => setHoveredId('erector_spinae')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('erector_spinae') && onSelectMuscle('erector_spinae')}
            />
            <path
              id="erector-right"
              d="M123,135 L123,210 L130,210 L130,135 Z"
              className={getZoneClassName('erector_spinae', 'back')}
              onMouseEnter={() => setHoveredId('erector_spinae')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('erector_spinae') && onSelectMuscle('erector_spinae')}
            />
            {/* Čtvercový sval bederní (Quadratus lumborum) */}
            <path
              id="quadratus-lumborum-left"
              d="M100,195 L110,195 L108,210 L98,210 Z"
              className={getZoneClassName('quadratus_lumborum', 'abdomen')}
              onMouseEnter={() => setHoveredId('quadratus_lumborum')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('quadratus_lumborum') && onSelectMuscle('quadratus_lumborum')}
            />
            <path
              id="quadratus-lumborum-right"
              d="M140,195 L130,195 L132,210 L142,210 Z"
              className={getZoneClassName('quadratus_lumborum', 'abdomen')}
              onMouseEnter={() => setHoveredId('quadratus_lumborum')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('quadratus_lumborum') && onSelectMuscle('quadratus_lumborum')}
            />

            {/* --- SHOULDERS POSTERIOR --- */}
            {/* Deltový sval (Deltoideus posterior) Left */}
            <path
              id="deltoid-posterior-left"
              d="M93,75 C85,78 74,90 75,103 C80,103 84,95 88,88 Z"
              className={getZoneClassName('deltoideus', 'shoulder')}
              onMouseEnter={() => setHoveredId('deltoideus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('deltoideus') && onSelectMuscle('deltoideus')}
            />
            {/* Deltový sval (Deltoideus posterior) Right */}
            <path
              id="deltoid-posterior-right"
              d="M147,75 C155,78 166,90 165,103 C160,103 156,95 152,88 Z"
              className={getZoneClassName('deltoideus', 'shoulder')}
              onMouseEnter={() => setHoveredId('deltoideus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('deltoideus') && onSelectMuscle('deltoideus')}
            />

            {/* --- ROTATOR CUFF & TERES MAJOR (Scapular region) --- */}
            {/* Supraspinatus Left */}
            <path
              id="supraspinatus-left"
              d="M90,78 L104,80 L102,85 L88,83 Z"
              className={getZoneClassName('supraspinatus', 'shoulder')}
              onMouseEnter={() => setHoveredId('supraspinatus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('supraspinatus') && onSelectMuscle('supraspinatus')}
            />
            {/* Supraspinatus Right */}
            <path
              id="supraspinatus-right"
              d="M150,78 L136,80 L138,85 L152,83 Z"
              className={getZoneClassName('supraspinatus', 'shoulder')}
              onMouseEnter={() => setHoveredId('supraspinatus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('supraspinatus') && onSelectMuscle('supraspinatus')}
            />

            {/* Infraspinatus Left */}
            <path
              id="infraspinatus-left"
              d="M86,85 L106,87 L102,96 L88,94 Z"
              className={getZoneClassName('infraspinatus', 'shoulder')}
              onMouseEnter={() => setHoveredId('infraspinatus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('infraspinatus') && onSelectMuscle('infraspinatus')}
            />
            {/* Infraspinatus Right */}
            <path
              id="infraspinatus-right"
              d="M154,85 L134,87 L138,96 L152,94 Z"
              className={getZoneClassName('infraspinatus', 'shoulder')}
              onMouseEnter={() => setHoveredId('infraspinatus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('infraspinatus') && onSelectMuscle('infraspinatus')}
            />

            {/* Teres minor Left */}
            <path
              id="teres-minor-left"
              d="M82,95 L100,98 L98,103 L80,100 Z"
              className={getZoneClassName('teres_minor', 'shoulder')}
              onMouseEnter={() => setHoveredId('teres_minor')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('teres_minor') && onSelectMuscle('teres_minor')}
            />
            {/* Teres minor Right */}
            <path
              id="teres-minor-right"
              d="M158,95 L140,98 L142,103 L160,100 Z"
              className={getZoneClassName('teres_minor', 'shoulder')}
              onMouseEnter={() => setHoveredId('teres_minor')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('teres_minor') && onSelectMuscle('teres_minor')}
            />

            {/* Teres major Left */}
            <path
              id="teres-major-left"
              d="M80,102 C85,108 95,112 97,112 L101,104 L82,100 Z"
              className={getZoneClassName('teres_major', 'shoulder')}
              onMouseEnter={() => setHoveredId('teres_major')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('teres_major') && onSelectMuscle('teres_major')}
            />
            {/* Teres major Right */}
            <path
              id="teres-major-right"
              d="M160,102 C155,108 145,112 143,112 L139,104 L158,100 Z"
              className={getZoneClassName('teres_major', 'shoulder')}
              onMouseEnter={() => setHoveredId('teres_major')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('teres_major') && onSelectMuscle('teres_major')}
            />

            {/* --- BACK ARMS --- */}
            {/* Triceps brachii Left */}
            <path
              id="triceps-left"
              d="M74,114 C65,124 64,139 67,152 C71,150 74,142 74,124 Z"
              className={getZoneClassName('triceps_brachii', 'arms')}
              onMouseEnter={() => setHoveredId('triceps_brachii')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('triceps_brachii') && onSelectMuscle('triceps_brachii')}
            />
            {/* Triceps brachii Right */}
            <path
              id="triceps-right"
              d="M166,114 C175,124 176,139 173,152 C169,150 166,142 166,124 Z"
              className={getZoneClassName('triceps_brachii', 'arms')}
              onMouseEnter={() => setHoveredId('triceps_brachii')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('triceps_brachii') && onSelectMuscle('triceps_brachii')}
            />

            {/* --- HIPS & GLUTES --- */}
            {/* Velký sval hýžďový (Gluteus maximus) Left */}
            <path
              id="gluteus-max-left"
              d="M93,212 C90,225 93,250 110,250 C114,242 119,235 120,212 Z"
              className={getZoneClassName('gluteus_maximus', 'glutes')}
              onMouseEnter={() => setHoveredId('gluteus_maximus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('gluteus_maximus') && onSelectMuscle('gluteus_maximus')}
            />
            {/* Velký sval hýžďový (Gluteus maximus) Right */}
            <path
              id="gluteus-max-right"
              d="M147,212 C150,225 147,250 130,250 C126,242 121,235 120,212 Z"
              className={getZoneClassName('gluteus_maximus', 'glutes')}
              onMouseEnter={() => setHoveredId('gluteus_maximus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('gluteus_maximus') && onSelectMuscle('gluteus_maximus')}
            />
            {/* Střední sval hýžďový (Gluteus medius) Left */}
            <path
              id="gluteus-med-left"
              d="M91,208 C86,212 87,225 94,233 C94,228 94,218 91,208 Z"
              className={getZoneClassName('gluteus_medius', 'glutes')}
              onMouseEnter={() => setHoveredId('gluteus_medius')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('gluteus_medius') && onSelectMuscle('gluteus_medius')}
            />
            {/* Střední sval hýžďový (Gluteus medius) Right */}
            <path
              id="gluteus-med-right"
              d="M149,208 C154,212 153,225 146,233 C146,228 146,218 149,208 Z"
              className={getZoneClassName('gluteus_medius', 'glutes')}
              onMouseEnter={() => setHoveredId('gluteus_medius')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('gluteus_medius') && onSelectMuscle('gluteus_medius')}
            />
            {/* Malý sval hýžďový (Gluteus minimus) Left */}
            <path
              id="gluteus-min-left"
              d="M89,215 C87,218 88,223 91,226 L91,220 Z"
              className={getZoneClassName('gluteus_minimus', 'glutes')}
              onMouseEnter={() => setHoveredId('gluteus_minimus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('gluteus_minimus') && onSelectMuscle('gluteus_minimus')}
            />
            {/* Malý sval hýžďový (Gluteus minimus) Right */}
            <path
              id="gluteus-min-right"
              d="M151,215 C153,218 152,223 149,226 L149,220 Z"
              className={getZoneClassName('gluteus_minimus', 'glutes')}
              onMouseEnter={() => setHoveredId('gluteus_minimus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('gluteus_minimus') && onSelectMuscle('gluteus_minimus')}
            />

            {/* --- BACK THIGHS (HAMSTRINGS) --- */}
            {/* Hamstringy (Zadní strana stehna) Left - Divided */}
            {/* Biceps femoris Left (Lateral) */}
            <path
              id="biceps-femoris-left"
              d="M93,252 C88,270 85,310 91,340 L97,340 C97,310 99,280 101,252 Z"
              className={getZoneClassName('biceps_femoris', 'thighs_back')}
              onMouseEnter={() => setHoveredId('biceps_femoris')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('biceps_femoris') && onSelectMuscle('biceps_femoris')}
            />
            {/* Semitendinosus / Semimembranosus Left (Medial) */}
            <path
              id="semitendinosus-left"
              d="M101,252 C99,280 97,310 97,340 L103,340 C108,310 109,280 110,252 Z"
              className={getZoneClassName('semitendinosus', 'thighs_back')}
              onMouseEnter={() => setHoveredId('semitendinosus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('semitendinosus') && onSelectMuscle('semitendinosus')}
            />

            {/* Hamstringy (Zadní strana stehna) Right - Divided */}
            {/* Biceps femoris Right (Lateral) */}
            <path
              id="biceps-femoris-right"
              d="M147,252 C152,280 155,310 149,340 L143,340 C143,310 141,280 139,252 Z"
              className={getZoneClassName('biceps_femoris', 'thighs_back')}
              onMouseEnter={() => setHoveredId('biceps_femoris')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('biceps_femoris') && onSelectMuscle('biceps_femoris')}
            />
            {/* Semitendinosus / Semimembranosus Right (Medial) */}
            <path
              id="semitendinosus-right"
              d="M139,252 C141,280 143,310 143,340 L137,340 C132,310 131,280 130,252 Z"
              className={getZoneClassName('semitendinosus', 'thighs_back')}
              onMouseEnter={() => setHoveredId('semitendinosus')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('semitendinosus') && onSelectMuscle('semitendinosus')}
            />

            {/* --- BACK CALVES --- */}
            {/* Trojhlavý sval lýtkový (Triceps surae) Left */}
            <path
              id="calves-left"
              d="M93,355 C88,375 88,395 91,415 C95,415 101,390 100,355 Z"
              className={getZoneClassName('triceps_surae', 'calves')}
              onMouseEnter={() => setHoveredId('triceps_surae')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('triceps_surae') && onSelectMuscle('triceps_surae')}
            />
            {/* Trojhlavý sval lýtkový (Triceps surae) Right */}
            <path
              id="calves-right"
              d="M147,355 C152,375 152,395 149,415 C145,415 139,390 140,355 Z"
              className={getZoneClassName('triceps_surae', 'calves')}
              onMouseEnter={() => setHoveredId('triceps_surae')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => isFiltered('triceps_surae') && onSelectMuscle('triceps_surae')}
            />
          </svg>
        )}
      </div>

      {/* Map Legend indicators */}
      <div className="mt-4 pt-4 border-t border-[#27272A] grid grid-cols-3 gap-2 text-[10px] text-[#71717A] font-mono">
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-2 h-2 rounded-full bg-rose-500/50 block"></span>
          <span>Trup / Hrudník</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-2 h-2 rounded-full bg-cyan-400 block"></span>
          <span>Dolní končetiny</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-2 h-2 rounded-full bg-violet-500/50 block"></span>
          <span>Ramena & Paže</span>
        </div>
      </div>
    </div>
  );
}
