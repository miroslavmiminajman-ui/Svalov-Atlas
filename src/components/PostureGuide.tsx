/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertTriangle, Shield, CheckCircle, RefreshCw, User, HelpCircle } from 'lucide-react';

export default function PostureGuide() {
  return (
    <div className="bg-[#0F0F11] border border-[#27272A] rounded-2xl p-6 shadow-xl text-[#E4E4E7] flex flex-col gap-6" id="posture-guide">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 font-display">
          <Shield className="text-cyan-400" size={22} />
          Svalové Disbalance & Držení Těla
        </h3>
        <p className="text-xs text-[#71717A] mt-1">
          Jak chronické tendence k ohybům a ochabování formují naši postavu (podle české školy fyzioterapie Prof. Jandy)
        </p>
      </div>

      {/* Intro info box */}
      <div className="bg-[#121214] border border-[#27272A] rounded-xl p-4 text-xs leading-relaxed text-[#D4D4D8]">
        <span className="font-bold text-cyan-400 uppercase tracking-wide block mb-1">Tonic vs. Phasic Svalstvo</span>
        <p className="mb-2">
          Lidské tělo se skládá ze dvou základních skupin svalů. **Tonické svaly** jsou evolučně starší, udržují naši polohu proti gravitaci a mají permanentní tendenci ke **zkracování, tuhnutí a přetěžování**.
        </p>
        <p>
          Naopak **fázické svaly** provádějí rychlé, dynamické pohyby a při nečinnosti mají silnou tendenci k **ochabování, prodlužování a útlumu**. Pokud necvičíme, vznikají typické zkřížené vzorce, které vedou k chronickým bolestem.
        </p>
      </div>

      {/* Syndrome tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* UPPER CROSSED SYNDROME */}
        <div className="bg-gradient-to-b from-[#121214] to-[#0F0F11] rounded-xl border border-rose-500/10 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-rose-400 shrink-0" size={18} />
              <h4 className="text-sm font-bold text-white font-display">Horní zkřížený syndrom (Krk & Ramena)</h4>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed">
              Charakterizuje předsunuté držení hlavy, ramena stočená dovnitř (protrakce) a zvětšený hrudní hrb (kyfóza). Častá příčina práce na notebooku a pohledu do telefonu.
            </p>

            <div className="space-y-3">
              <div className="bg-rose-950/15 border border-rose-900/20 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide block mb-1">🔴 ZKRÁCENÉ SVALY (Nutno protáhnout)</span>
                <ul className="text-xs text-slate-350 list-disc pl-4 space-y-0.5 font-medium">
                  <li>Prsní svaly (m. pectoralis major et minor)</li>
                  <li>Horní partii trapézu (m. trapezius)</li>
                  <li>Zdvihač hlavy (m. sternocleidomastoideus)</li>
                  <li>Kloněné svaly na krku (mm. scaleni)</li>
                </ul>
              </div>

              <div className="bg-cyan-950/15 border border-cyan-900/30 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide block mb-1">🔵 OCHABLÉ SVALY (Nutno aktivovat)</span>
                <ul className="text-xs text-slate-350 list-disc pl-4 space-y-0.5 font-medium">
                  <li>Mezilopatkové svaly (mm. rhomboidei)</li>
                  <li>Dolní a střední trapéz</li>
                  <li>Přední pilovitý sval (m. serratus anterior)</li>
                  <li>Hluboké ohybače hlavy a krku</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27272A] text-[11px] text-[#71717A] italic">
            💡 <strong>Rada:</strong> Než začnete posilovat záda těžkými vahami, důkladně uvolněte a protáhněte prsní svaly a dýchejte do břicha!
          </div>
        </div>

        {/* LOWER CROSSED SYNDROME */}
        <div className="bg-gradient-to-b from-[#121214] to-[#0F0F11] rounded-xl border border-cyan-500/10 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-cyan-400 shrink-0" size={18} />
              <h4 className="text-sm font-bold text-white font-display">Dolní zkřížený syndrom (Bedra & Pánev)</h4>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed">
              Projevuje se nadměrným prohnutím v bedrech (hyperlordóza), vystrčeným zadkem a břichem zapříčiněným překlopením pánve dopředu. Způsobeno neustálým celodenním sezením.
            </p>

            <div className="space-y-3">
              <div className="bg-rose-950/15 border border-rose-900/20 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide block mb-1">🔴 ZKRÁCENÉ SVALY (Nutno protáhnout)</span>
                <ul className="text-xs text-slate-350 list-disc pl-4 space-y-0.5 font-medium">
                  <li>Bedrokyčlostehenní ohybač (m. iliopsoas)</li>
                  <li>Vzpřimovač bederní páteře (m. erector spinae)</li>
                  <li>Přímý sval stehenní (m. rectus femoris)</li>
                  <li>Zadní strana stehen (hamstringy)</li>
                </ul>
              </div>

              <div className="bg-cyan-950/15 border border-cyan-900/30 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide block mb-1">🔵 OCHABLÉ SVALY (Nutno aktivovat)</span>
                <ul className="text-xs text-slate-350 list-disc pl-4 space-y-0.5 font-medium">
                  <li>Velký hýžďový sval (m. gluteus maximus)</li>
                  <li>Přímý sval břišní (m. rectus abdominis)</li>
                  <li>Příčný sval břišní (hluboký stabilizační systém)</li>
                  <li>Střední hýžďový sval</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27272A] text-[11px] text-[#71717A] italic">
            💡 <strong>Rada:</strong> Při "vystrčeném břiše" často nepomůže posilování zkracovačkami, nýbrž uvolnění bedrokyčelních ohybačů a posílení hýždí glute bridge!
          </div>
        </div>

      </div>

      {/* General recommendation card */}
      <div className="bg-[#121214] p-4 rounded-xl border border-[#27272A] flex items-start gap-3">
        <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={16} />
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">Metodika nápravy</span>
          <p className="text-xs text-[#D4D4D8] leading-relaxed">
            Pro vyvážený pohybový aparát platí pravidlo: **Nezkracovat zkrácené, nýbrž uvolňovat. Vždy nejprve uvolnit a protáhnout hypertónní tonické svaly, a teprve poté začít posilovat fázické (ochablé) svaly**, jinak bude zkrácený sval přebírat veškeré pohybové vzorce.
          </p>
        </div>
      </div>
    </div>
  );
}
