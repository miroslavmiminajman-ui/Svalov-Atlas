/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';

interface Point {
  x: number;
  y: number;
  name: string; // Detail description of the exact bone site
}

interface MusclePlacement {
  origin: Point;
  insertion: Point;
  viewBox: string;
  zoomName: string; // e.g. "Krk a hlava", "Rameno a paže"
}

// Coordinate database for matching Origin and Insertion of all 43 muscles
// Skeleton standard coordinates scale is based on full body SVG of height 400, width 200
const PLACEMENTS_DB: Record<string, MusclePlacement> = {
  trapezius: {
    origin: { x: 100, y: 38, name: 'Spodinová kost lebeční, trnové výběžky krčních a hrudních obratlů (C1–Th12)' },
    insertion: { x: 124, y: 56, name: 'Vnější třetina klíční kosti, nadpažek (acromion) a hřeben lopatky' },
    viewBox: '40 20 120 150',
    zoomName: 'Horní polovina zad (posterior)'
  },
  latissimus_dorsi: {
    origin: { x: 100, y: 135, name: 'Trnové výběžky Th7–L5, bederní fascie a zadní hřeben kosti kyčelní' },
    insertion: { x: 126, y: 70, name: 'Přední strana pažní kosti (crista tuberculi minoris)' },
    viewBox: '40 50 120 160',
    zoomName: 'Široká zádová oblast (posterior)'
  },
  sternocleidomastoid: {
    origin: { x: 100, y: 53, name: 'Horní část kosti hrudní (sternum) a vnitřní konec klíční kosti' },
    insertion: { x: 92, y: 30, name: 'Skočitý výběžek spánkové kosti (processus mastoideus) za uchem' },
    viewBox: '70 15 60 70',
    zoomName: 'Přední oblast krku (anterior)'
  },
  scalene_muscles: {
    origin: { x: 100, y: 38, name: 'Příčné výběžky krčních obratlů C2–C7' },
    insertion: { x: 90, y: 58, name: 'Vnější povrch prvního a druhého žebra' },
    viewBox: '70 20 60 60',
    zoomName: 'Hluboké svaly krku (anterior)'
  },
  pectoralis_major: {
    origin: { x: 100, y: 75, name: 'Vnitřní polovina klíční kosti, hrudní kost a chrupavky 1.–6. žebra' },
    insertion: { x: 122, y: 76, name: 'Vnější hrana žlábku pažní kosti (crista tuberculi majoris)' },
    viewBox: '50 40 100 110',
    zoomName: 'Prsní krajina (anterior)'
  },
  pectoralis_minor: {
    origin: { x: 112, y: 85, name: 'Přední strana 3., 4. a 5. žebra u jejich chrupavek' },
    insertion: { x: 122, y: 58, name: 'Zobákovitý výběžek lopatky (processus coracoideus)' },
    viewBox: '60 40 85 90',
    zoomName: 'Hluboká prsní krajina (anterior)'
  },
  serratus_anterior: {
    origin: { x: 124, y: 95, name: 'Vnější plocha horních 9 žeber (zubatý začátek)' },
    insertion: { x: 110, y: 75, name: 'Vnitřní okraj lopatky ze strany u žeber' },
    viewBox: '50 40 100 110',
    zoomName: 'Boční strana hrudníku (anterior)'
  },
  erector_spinae: {
    origin: { x: 100, y: 192, name: 'Zadní plocha křížové kosti, kyčelní hřeben a trny bederních obratlů L1–L5' },
    insertion: { x: 100, y: 68, name: 'Trnové a příčné výběžky hrudních obratlů a zadní úhly žeber až po týl' },
    viewBox: '50 40 100 170',
    zoomName: 'Oblast podél páteře (posterior)'
  },
  rhomboideus_minor: {
    origin: { x: 100, y: 64, name: 'Trnové výběžky posledních dvou krčních obratlů C6–C7' },
    insertion: { x: 88, y: 70, name: 'Vnitřní okraj lopatky v úrovni hřebene lopatky (margo medialis)' },
    viewBox: '60 40 80 80',
    zoomName: 'Mezilopatková oblast - m. rhomboideus minor (posterior)'
  },
  rhomboideus_major: {
    origin: { x: 100, y: 78, name: 'Trnové výběžky prvních čtyř hrudních obratlů Th1–Th4' },
    insertion: { x: 88, y: 84, name: 'Vnitřní okraj lopatky pod hřebenem lopatky až k dolnímu úhlu' },
    viewBox: '60 40 80 80',
    zoomName: 'Mezilopatková oblast - m. rhomboideus major (posterior)'
  },
  rectus_abdominis: {
    origin: { x: 100, y: 185, name: 'Spona stydká a horní okraj stydké kosti (os pubis)' },
    insertion: { x: 100, y: 78, name: 'Mečovitý výběžek hrudní kosti (processus xiphoideus) a chrupavky 5.–7. žebra' },
    viewBox: '55 60 90 140',
    zoomName: 'Přímý sval břišní (anterior)'
  },
  obliques: {
    origin: { x: 126, y: 95, name: 'Vnější povrchy dolních osmi žeber (5.–12. žebro)' },
    insertion: { x: 92, y: 175, name: 'Hřeben kosti kyčelní, slabiny a široká aponeuroza do linea alba' },
    viewBox: '50 70 100 130',
    zoomName: 'Šikmé svalstvo břicha (anterior)'
  },
  transversus_abdominis: {
    origin: { x: 122, y: 110, name: 'Vnitřní plocha dolních 6 žebrových chrupavek, bederní fascie a kyčelní hřeben' },
    insertion: { x: 100, y: 140, name: 'Vazivová čára uprostřed břicha (linea alba) a stydká kost' },
    viewBox: '50 80 100 120',
    zoomName: 'Hluboký stabilizační korzet (anterior)'
  },
  deltoideus: {
    origin: { x: 126, y: 56, name: 'Vnější třetina klíční kosti, nadpažek lopatky a hřeben lopatky' },
    insertion: { x: 134, y: 85, name: 'Deltová drsnatina na vnější ploše kosti pažní (tuberositas deltoidea)' },
    viewBox: '80 35 80 100',
    zoomName: 'Ramenní kloub (humeroscapular)'
  },
  biceps_brachii: {
    origin: { x: 124, y: 56, name: 'Dvě hlavy na lopatce: nadkloubní hrbol (dlouhá hlava) a zobákovitý výběžek (krátká hlava)' },
    insertion: { x: 148, y: 120, name: 'Drsnatina vřetenní kosti těsně pod loktem (tuberositas radii) a šlašitá aponeuróza' },
    viewBox: '90 40 80 110',
    zoomName: 'Přední strana paže (anterior)'
  },
  triceps_brachii: {
    origin: { x: 120, y: 66, name: 'Tři hlavy: podkloubní hrbol lopatky (dlouhá hlava) a zadní dřík pažní kosti' },
    insertion: { x: 142, y: 118, name: 'Okovec loketní kosti (olecranon ulnae) – pevný hrot lokte' },
    viewBox: '90 40 80 110',
    zoomName: 'Zadní strana paže (posterior)'
  },
  brachioradialis: {
    origin: { x: 140, y: 108, name: 'Vnější boční dolní hrana pažní kosti' },
    insertion: { x: 152, y: 165, name: 'Bodcovitý výběžek vřetenní kosti na vnější straně zápěstí' },
    viewBox: '110 90 70 110',
    zoomName: 'Předloketní oblast (posterior)'
  },
  gluteus_maximus: {
    origin: { x: 102, y: 178, name: 'Zadní část kosti kyčelní, křížové kosti a kostrče' },
    insertion: { x: 120, y: 218, name: 'Drsnatina na kosti stehenní (tuberositas glutea) a do ploché povázky stehna (IT trakt)' },
    viewBox: '60 140 80 110',
    zoomName: 'Pánevní hýžďová oblast (posterior)'
  },
  gluteus_medius: {
    origin: { x: 114, y: 168, name: 'Vnější plocha lopaty kosti kyčelní (mezi linea glutea anterior a posterior)' },
    insertion: { x: 122, y: 195, name: 'Velký chocholík kosti stehenní (trochanter major)' },
    viewBox: '70 140 70 95',
    zoomName: 'Boční hýžďová oblast (posterior)'
  },
  gluteus_minimus: {
    origin: { x: 114, y: 175, name: 'Hluboká vnější část lopaty kosti kyčelní pod středním hýžďovým svalem' },
    insertion: { x: 122, y: 195, name: 'Přední plocha velkého chocholíku kosti stehenní (trochanter major)' },
    viewBox: '70 145 75 85',
    zoomName: 'Hluboká pánevní oblast (posterior)'
  },
  rectus_femoris: {
    origin: { x: 84, y: 185, name: 'Přední dolní kyčelní trn (spina iliaca anterior inferior) nad kyčelním kloubem' },
    insertion: { x: 78, y: 272, name: 'Společnou šlachou kvadricepsu na čéšku (patella) a přes patelární vaz na holenní kost' },
    viewBox: '50 170 100 130',
    zoomName: 'Přední strana stehna (anterior)'
  },
  vastus_lateralis: {
    origin: { x: 80, y: 202, name: 'Vnější hrana velkého chocholíku kosti stehenní a drsné čáry' },
    insertion: { x: 76, y: 270, name: 'Boční horní okraj čéšky a šlacha kvadricepsu' },
    viewBox: '45 180 80 110',
    zoomName: 'Vnější hlava kvadricepsu (anterior)'
  },
  vastus_medialis: {
    origin: { x: 84, y: 212, name: 'Vnitřní dřík a vnitřní hrana drsné čáry kosti stehenní' },
    insertion: { x: 80, y: 270, name: 'Vnitřní horní okraj čéšky a šlacha kvadricepsu' },
    viewBox: '50 180 80 110',
    zoomName: 'Vnitřní hlava kvadricepsu (anterior)'
  },
  vastus_intermedius: {
    origin: { x: 82, y: 215, name: 'Přední a boční plocha dříku kosti stehenní (pod přímým stehenním svalem)' },
    insertion: { x: 78, y: 270, name: 'Horní základna čéšky – splývá do šlachy čtyřhlavého svalu' },
    viewBox: '50 180 80 110',
    zoomName: 'Prostřední hlava kvadricepsu (anterior)'
  },
  sartorius: {
    origin: { x: 76, y: 170, name: 'Přední horní kyčelní trn (spina iliaca anterior superior) – hrot pánve' },
    insertion: { x: 81, y: 280, name: 'Husí noha (pes anserinus) na vnitřní straně holenní kosti pod kolenem' },
    viewBox: '45 160 90 140',
    zoomName: 'Přední šikmá stehenní dráha (anterior)'
  },
  biceps_femoris: {
    origin: { x: 88, y: 192, name: 'Sedací hrbol (dlouhá hlava) a drsná čára stehenní kosti (krátká hlava)' },
    insertion: { x: 70, y: 278, name: 'Hlava lýtkové kosti (caput fibulae) na vnější straně kolenního kloubu' },
    viewBox: '40 170 100 130',
    zoomName: 'Vnější zadní strana stehna (posterior)'
  },
  semitendinosus: {
    origin: { x: 88, y: 192, name: 'Sedací hrbol pánevní kosti (spolu s dlouhou hlavou bicepsu stehenního)' },
    insertion: { x: 80, y: 280, name: 'Vnitřní horní okraj holenní kosti (pes anserinus) vedle sartoria' },
    viewBox: '45 170 90 130',
    zoomName: 'Vnitřní hamstringový sval (posterior)'
  },
  semimembranosus: {
    origin: { x: 88, y: 192, name: 'Sedací hrbol (poloblanitý sval, začíná plochou šlachou více hluboko)' },
    insertion: { x: 79, y: 276, name: 'Vnitřní zadní kondyl kosti holenní (condylus medialis tibiae)' },
    viewBox: '45 170 90 130',
    zoomName: 'Hluboký hamstringový sval (posterior)'
  },
  adductor_magnus: {
    origin: { x: 90, y: 198, name: 'Dolní rameno pubické kosti a spodní sedací hrbol kosti pánve' },
    insertion: { x: 80, y: 248, name: 'Linea aspera a přitahovací hrbolek nad vnitřním kondylem kosti stehenní' },
    viewBox: '55 175 90 110',
    zoomName: 'Vnitřní strana stehna (anterior)'
  },
  triceps_surae: {
    origin: { x: 78, y: 268, name: 'Stehenní kondyly nad kolenem (gastrocnemius) a zadní dřík holenní & lýtkové kosti (soleus)' },
    insertion: { x: 72, y: 350, name: 'Patní kost přes Achillovu šlachu (tuber calcanei)' },
    viewBox: '40 240 100 130',
    zoomName: 'Zadní strana lýtka (posterior)'
  },
  tibialis_anterior: {
    origin: { x: 79, y: 278, name: 'Horní dvě třetiny vnější plochy holenní kosti a mezikostní blána' },
    insertion: { x: 70, y: 355, name: 'Vnitřní klínová kost a báze první záprstní kosti na chodidle' },
    viewBox: '40 250 100 130',
    zoomName: 'Přední strana bérce (anterior)'
  },
  iliopsoas: {
    origin: { x: 100, y: 130, name: 'M. psoas: těla obratlů T12–L5. M. iliacus: vnitřní jáma kyčelní pánve' },
    insertion: { x: 116, y: 202, name: 'Malý otočník kosti stehenní (trochanter minor) – vnitřní horní femur' },
    viewBox: '60 110 80 110',
    zoomName: 'Bedro-kyčlo-stehenní ohybač (anterior)'
  },
  quadratus_lumborum: {
    origin: { x: 110, y: 162, name: 'Zadní hřeben kyčelní kosti a kyčelní bederní vaz' },
    insertion: { x: 104, y: 130, name: 'Dolní okraj 12. žebra a příčné výběžky bederních obratlů L1–L4' },
    viewBox: '60 115 80 80',
    zoomName: 'Hluboká bederní oblast (posterior)'
  },
  supraspinatus: {
    origin: { x: 118, y: 58, name: 'Jáma nad hřebenem lopatky (fossa supraspinata)' },
    insertion: { x: 126, y: 56, name: 'Nejvyšší bod velkého hrbolu kosti pažní (tuberculum majus)' },
    viewBox: '90 40 60 60',
    zoomName: 'Nadhřebenová rotátorová manžeta (posterior)'
  },
  infraspinatus: {
    origin: { x: 114, y: 68, name: 'Podhřebenová jáma lopatky (fossa infraspinata)' },
    insertion: { x: 126, y: 58, name: 'Střední fazeta velkého hrbolu kosti pažní (tuberculum majus)' },
    viewBox: '90 40 60 60',
    zoomName: 'Podhřebenová rotátorová manžeta (posterior)'
  },
  teres_minor: {
    origin: { x: 118, y: 76, name: 'Horní dvě třetiny vnějšího okraje zadní plochy lopatky' },
    insertion: { x: 126, y: 60, name: 'Dolní fazeta velkého hrbolu kosti pažní (tuberculum majus)' },
    viewBox: '90 40 60 60',
    zoomName: 'Zadní rotátorová manžeta (posterior)'
  },
  teres_major: {
    origin: { x: 120, y: 84, name: 'Dorsální plocha dolního úhlu lopatky (angulus inferior scapulae)' },
    insertion: { x: 126, y: 66, name: 'Přední hrana malého hrbolku kosti pažní (humerus) pod úponem m. latissimus' },
    viewBox: '90 40 60 60',
    zoomName: 'Sval zádový pomocný doplňující lopatku (posterior)'
  },
  subscapularis: {
    origin: { x: 118, y: 64, name: 'Podlopatková jáma na přední straně lopatky (přiléhající k žebrům)' },
    insertion: { x: 125, y: 59, name: 'Malý hrbol kosti pažní (tuberculum minus)' },
    viewBox: '90 40 60 60',
    zoomName: 'Přední rotátorová manžeta (anterior)'
  },
  tensor_fasciae_latae: {
    origin: { x: 76, y: 170, name: 'Přední horní trn kyčelní (spina iliaca anterior superior) – vnější okraj' },
    insertion: { x: 68, y: 225, name: 'Do stehenní povázky ( tractus iliotibialis) vedoucí na vnější koleno' },
    viewBox: '45 150 75 110',
    zoomName: 'Vnější kyčelní rýha (anterior)'
  },
  serratus_posterior_superior: {
    origin: { x: 100, y: 52, name: 'Trnové výběžky obratlů C6–Th2 a vazivový šíjový pruh' },
    insertion: { x: 116, y: 68, name: 'Zadní úhly 2., 3., 4. a 5. žebra' },
    viewBox: '70 35 60 60',
    zoomName: 'Horní hluboká zádová pilovitá vrstva (posterior)'
  },
  serratus_posterior_inferior: {
    origin: { x: 100, y: 116, name: 'Trnové výběžky obratlů Th11–L2' },
    insertion: { x: 118, y: 126, name: 'Spodní okraje dolních 4 žeber (9.–12. žebro)' },
    viewBox: '70 95 60 60',
    zoomName: 'Spodní hluboká zádová pilovitá vrstva (posterior)'
  },
  diaphragma: {
    origin: { x: 100, y: 110, name: 'Vnitřní povrch dolních 6 žebrových chrupavek, bederní obratle L1-L3 a mečovitý výběžek' },
    insertion: { x: 100, y: 100, name: 'Šlašité centrum bránice (centrum tendineum) – kopule uprostřed' },
    viewBox: '60 80 80 80',
    zoomName: 'Brániční hrudní klenba (anterior)'
  },
  piriformis: {
    origin: { x: 100, y: 185, name: 'Přední (vnitřní) plocha křížové kosti (os sacrum)' },
    insertion: { x: 118, y: 192, name: 'Horní okraj velkého chocholíku kosti stehenní (trochanter major)' },
    viewBox: '70 160 60 65',
    zoomName: 'Hluboké pánevní svalstvo (posterior)'
  },
  tibialis_posterior: {
    origin: { x: 120, y: 280, name: 'Zadní plocha kosti holenní, lýtkové a mezikostní vazivové membrány' },
    insertion: { x: 124, y: 350, name: 'Lodičkovitá kost zánártní a šlašité výběžky pod chodidlem na klínové kosti' },
    viewBox: '95 250 60 120',
    zoomName: 'Zadní hluboká vrstva bérce (posterior)'
  },
  fibularis_longus: {
    origin: { x: 126, y: 276, name: 'Hlava a horní dvě třetiny vnější strany lýtkové kosti (fibula)' },
    insertion: { x: 123, y: 355, name: 'Podbíhá chodidlo příčným směrem k první klínové kosti a prvnímu metatarsu' },
    viewBox: '95 250 60 120',
    zoomName: 'Vnější lýtková skupina (anterior)'
  }
};

interface AnatomyPointsMapProps {
  muscleId: string;
}

export default function AnatomyPointsMap({ muscleId }: AnatomyPointsMapProps) {
  const placement = useMemo(() => {
    return PLACEMENTS_DB[muscleId] || null;
  }, [muscleId]);

  if (!placement) {
    return (
      <div className="bg-[#121214] border border-[#27272A] rounded-xl p-4 text-center text-xs text-[#71717A]">
        Schématický nákres upnutí svalu není dostupný pro toto ID svalu.
      </div>
    );
  }

  const { origin, insertion, viewBox, zoomName } = placement;

  // Render a responsive dynamic SVG drawing
  return (
    <div className="relative bg-[#121214]/80 border border-[#27272A] rounded-xl p-3 flex flex-col gap-2 shadow-inner overflow-hidden select-none">
      
      {/* Visual Header / Zoom State indicators */}
      <div className="flex items-center justify-between text-[10px] text-[#71717A]">
        <span className="font-mono bg-[#1C1C1F] border border-[#27272A] px-2 py-0.5 rounded text-cyan-400 font-bold uppercase tracking-wider">
          Anatomické Upnutí (Nákres)
        </span>
        <span className="italic font-medium">{zoomName}</span>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative h-[220px] bg-[#09090B] rounded-lg border border-[#27272A]/40 flex items-center justify-center p-2">
        <svg
          viewBox={viewBox}
          className="w-full h-full text-zinc-700 transition-all duration-500"
          id={`svg-skeletal-map-${muscleId}`}
        >
          {/* DEFINITIONS FOR GRADIENTS AND GLOW EFFECT */}
          <defs>
            <linearGradient id={`gradient-${muscleId}`} x1={origin.x} y1={origin.y} x2={insertion.x} y2={insertion.y} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" /> {/* Origin Cyan */}
              <stop offset="50%" stopColor="#EF4444" /> {/* Muscle Belly Crimson */}
              <stop offset="100%" stopColor="#F59E0B" /> {/* Insertion Amber */}
            </linearGradient>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* === STYLIZED SKELETAL BACKDROP CHASSIS === */}
          {/* Skull */}
          <circle cx="100" cy="30" r="14" stroke="#52525B" strokeWidth="1" fill="#18181B" opacity="0.4" />
          <path d="M 94 38 L 94 44 L 106 44 L 106 38 Z" stroke="#52525B" strokeWidth="1" fill="#18181B" opacity="0.4" />
          
          {/* Spine Vertebrae column */}
          <path d="M 100 44 L 100 170" stroke="#3F3F46" strokeWidth="2" strokeDasharray="3, 3" opacity="0.6" />
          
          {/* Rib Cage Outline Arcs */}
          {/* Left Ribs */}
          <path d="M 100 62 Q 80 64 82 72 Q 100 78 100 78" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M 100 74 Q 74 78 76 88 Q 100 94 100 94" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M 100 86 Q 70 92 72 104 Q 100 110 100 110" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M 100 98 Q 68 106 70 120 Q 100 126 100 126" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M 100 110 Q 68 120 70 136 Q 100 142 100 142" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.2" />
          <path d="M 100 122 Q 70 132 72 152 Q 100 156 100 156" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.2" />
          <path d="M 100 134 Q 74 144 76 164 L 100 166" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.15" />

          {/* Right Ribs */}
          <path d="M 100 62 Q 120 64 118 72 Q 100 78 100 78" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M 100 74 Q 126 78 124 88 Q 100 94 100 94" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M 100 86 Q 130 92 128 104 Q 100 110 100 110" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M 100 98 Q 132 106 130 120 Q 100 126 100 126" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M 100 110 Q 132 120 130 136 Q 100 142 100 142" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.2" />
          <path d="M 100 122 Q 130 132 128 152 Q 100 156 100 156" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.2" />
          <path d="M 100 134 Q 126 144 124 164 L 100 166" stroke="#3F3F46" strokeWidth="0.8" fill="none" opacity="0.15" />

          {/* Clavicles */}
          <path d="M 100 52 Q 87 50 74 56" stroke="#52525B" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M 100 52 Q 113 50 126 56" stroke="#52525B" strokeWidth="1.5" fill="none" opacity="0.4" />

          {/* Scapulas (Back shoulder blades) */}
          <path d="M 74 56 L 80 85 L 94 70 Z" stroke="#3F3F46" strokeWidth="0.8" fill="#18181B" opacity="0.25" />
          <path d="M 126 56 L 120 85 L 106 70 Z" stroke="#3F3F46" strokeWidth="0.8" fill="#18181B" opacity="0.25" />

          {/* Sternum (Chest Bone Plate) */}
          <path d="M 100 52 L 100 115" stroke="#52525B" strokeWidth="3" opacity="0.4" />

          {/* Arms (Humerus, Elbow joint, Forearms, Hands) */}
          {/* Left Arm */}
          <circle cx="74" cy="56" r="3" stroke="#3F3F46" strokeWidth="1" fill="#18181B" opacity="0.4" />
          <line x1="74" y1="56" x2="58" y2="116" stroke="#52525B" strokeWidth="2.2" opacity="0.35" />
          <circle cx="58" cy="116" r="2.5" stroke="#3F3F46" strokeWidth="1" fill="#18181B" opacity="0.4" />
          <line x1="58" y1="116" x2="46" y2="174" stroke="#52525B" strokeWidth="1.8" opacity="0.3" strokeDasharray="14, 1.5, 14, 1.5" />
          <path d="M 46 174 L 40 195" stroke="#3F3F46" strokeWidth="1.5" opacity="0.3" />

          {/* Right Arm */}
          <circle cx="126" cy="56" r="3" stroke="#3F3F46" strokeWidth="1" fill="#18181B" opacity="0.4" />
          <line x1="126" y1="56" x2="142" y2="116" stroke="#52525B" strokeWidth="2.2" opacity="0.35" />
          <circle cx="142" cy="116" r="2.5" stroke="#3F3F46" strokeWidth="1" fill="#18181B" opacity="0.4" />
          <line x1="142" y1="116" x2="154" y2="174" stroke="#52525B" strokeWidth="1.8" opacity="0.3" strokeDasharray="14, 1.5, 14, 1.5" />
          <path d="M 154 174 L 160 195" stroke="#3F3F46" strokeWidth="1.5" opacity="0.3" />

          {/* Pelvis structure */}
          <path d="M 100 160 Q 80 162 74 175 Q 88 192 100 185 Q 112 192 126 175 Q 120 162 100 160 Z" stroke="#52525B" strokeWidth="1.5" fill="#18181B" opacity="0.3" />
          <path d="M 100 185 Q 94 202 100 202 Q 106 202 100 185 Z" stroke="#3F3F46" strokeWidth="1" fill="none" opacity="0.3" />

          {/* Legs (Femur, Knee, Tibia/Fibula, Foot) */}
          {/* Left Leg */}
          <circle cx="82" cy="190" r="3.5" stroke="#3F3F46" strokeWidth="1" fill="#18181B" opacity="0.4" />
          <line x1="82" y1="190" x2="78" y2="268" stroke="#52525B" strokeWidth="2.8" opacity="0.35" />
          <circle cx="78" cy="272" r="4.2" stroke="#4B5563" strokeWidth="1" fill="#18181B" opacity="0.5" /> {/* Patella */}
          <line x1="78" y1="274" x2="72" y2="350" stroke="#52525B" strokeWidth="2" opacity="0.3" />
          <line x1="76" y1="274" x2="70" y2="350" stroke="#3F3F46" strokeWidth="1" opacity="0.2" /> {/* Fibula */}
          <path d="M 72 350 L 60 362" stroke="#3F3F46" strokeWidth="2.2" opacity="0.3" />

          {/* Right Leg */}
          <circle cx="118" cy="190" r="3.5" stroke="#3F3F46" strokeWidth="1" fill="#18181B" opacity="0.4" />
          <line x1="118" y1="190" x2="122" y2="268" stroke="#52525B" strokeWidth="2.8" opacity="0.35" />
          <circle cx="122" cy="272" r="4.2" stroke="#4B5563" strokeWidth="1" fill="#18181B" opacity="0.5" /> {/* Patella */}
          <line x1="122" y1="274" x2="128" y2="350" stroke="#52525B" strokeWidth="2" opacity="0.3" />
          <line x1="124" y1="274" x2="130" y2="350" stroke="#3F3F46" strokeWidth="1" opacity="0.2" /> {/* Fibula */}
          <path d="M 128 350 L 140 362" stroke="#3F3F46" strokeWidth="2.2" opacity="0.3" />

          {/* === GLOWING CONNECTIVE MUSCLE BELLY === */}
          {/* Main Muscle Strand representing contraction direction */}
          <path
            d={`M ${origin.x} ${origin.y} L ${insertion.x} ${insertion.y}`}
            stroke={`url(#gradient-${muscleId})`}
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#neon-glow)"
            className="opacity-90"
            id={`connecting-muscle-strap-${muscleId}`}
          />
          {/* Faint side support fibers to give structural volume to muscle belly */}
          <path
            d={`M ${origin.x} ${origin.y} Q ${(origin.x + insertion.x) / 2 + 5} ${(origin.y + insertion.y) / 2 + 5} ${insertion.x} ${insertion.y}`}
            stroke={`url(#gradient-${muscleId})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            className="opacity-45 pointer-events-none"
          />
          <path
            d={`M ${origin.x} ${origin.y} Q ${(origin.x + insertion.x) / 2 - 5} ${(origin.y + insertion.y) / 2 - 5} ${insertion.x} ${insertion.y}`}
            stroke={`url(#gradient-${muscleId})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            className="opacity-45 pointer-events-none"
          />

          {/* === DYNAMIC COMPREHENSIVE AREA HIGHLIGHTS (Celé začátky a úpony jako ucelené zóny) === */}
          {muscleId === 'trapezius' && (
            <g id="trapezius-comprehensive-areas" className="pointer-events-none">
              {/* Celý začátek na krčních a hrudních obratlích C1-Th12 podél páteře - velmi zářivá linie */}
              <line 
                x1="100" 
                y1="34" 
                x2="100" 
                y2="136" 
                stroke="#22D3EE" 
                strokeWidth="6" 
                strokeLinecap="round" 
                opacity="0.7" 
                filter="url(#neon-glow)" 
              />
              {/* Pojivové linky k levé i pravé straně pro demonstraci mohutnosti úponu */}
              <line x1="100" y1="34" x2="100" y2="136" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

              {/* Jednotlivé obratle C1 až Th12 jako zvýrazněné svítící segmenty */}
              <g id="trapezius-vertebrae" opacity="0.95">
                {[34, 42, 50, 58, 66, 74, 82, 91, 100, 109, 118, 127, 136].map((yVal, index) => (
                  <line 
                    key={index}
                    x1="97" 
                    y1={yVal} 
                    x2="103" 
                    y2={yVal} 
                    stroke="#22D3EE" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    opacity="0.9"
                    filter="url(#neon-glow)"
                  />
                ))}
              </g>

              {/* Textové označení C1 - Th12 přímo u páteře */}
              <g transform="translate(106, 85)" opacity="0.85">
                <rect x="-2" y="-12" width="41" height="15" rx="3" fill="#0891B2" opacity="0.95" />
                <text x="18-0.5" y="0" fontFamily="sans-serif" fontSize="7.5" fontWeight="bold" fill="#E0F7FA" textAnchor="middle">C1-Th12</text>
              </g>

              {/* Celé úponové pole kopírující klíční kost, nadpažek a hřeben lopatky */}
              <path d="M 100 52 Q 112 50 126 56 L 120 70" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.65" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'latissimus_dorsi' && (
            <g id="latissimus-comprehensive-areas" className="pointer-events-none">
              {/* Celý začátek na trnech Th7-L5 a kyčelním hřebeni */}
              <path d="M 100 102 L 100 185 Q 112 186 122 176" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'erector_spinae' && (
            <g id="erector-spinae-comprehensive-areas" className="pointer-events-none">
              {/* Celý začátek: křížová kost a zadní kyčelní lem */}
              <path d="M 88 186 Q 100 198 112 186" stroke="#22D3EE" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.65" filter="url(#neon-glow)" />
              {/* Celý úpon podél hrudní/krční páteře až k týlu */}
              <line x1="100" y1="42" x2="100" y2="175" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" opacity="0.6" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'pectoralis_major' && (
            <g id="pectoralis-major-comprehensive-areas" className="pointer-events-none">
              {/* Celý začátek: upnutí na vnitřní klíční a hrubé hrudní kosti včetně žeber */}
              <path d="M 82 52 L 100 52 L 100 110" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" filter="url(#neon-glow)" />
              {/* Celý úpon na rameni */}
              <ellipse cx="122" cy="76" rx="5" ry="10" fill="#F59E0B" opacity="0.65" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'rectus_abdominis' && (
            <g id="rectus-abdominis-comprehensive-areas" className="pointer-events-none">
              {/* Celý začátek: stydká kost */}
              <line x1="90" y1="185" x2="110" y2="185" stroke="#22D3EE" strokeWidth="6" strokeLinecap="round" opacity="0.6" filter="url(#neon-glow)" />
              {/* Celý úpon: chrupavky 5.-7. žebra a mečovitý výběžek */}
              <path d="M 85 78 L 115 78" stroke="#F59E0B" strokeWidth="5.5" strokeLinecap="round" opacity="0.65" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'sternocleidomastoid' && (
            <g id="scm-comprehensive-areas" className="pointer-events-none">
              {/* Celý začátek: hrudní a klíční kost u středu */}
              <path d="M 100 53 L 110 54" stroke="#22D3EE" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.65" filter="url(#neon-glow)" />
              {/* Celý úpon: hrot za uchem spánkové kosti */}
              <ellipse cx="92" cy="30" rx="7" ry="4" fill="#F59E0B" opacity="0.65" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'scalene_muscles' && (
            <g id="scalene-comprehensive-areas" className="pointer-events-none">
              <line x1="100" y1="36" x2="100" y2="48" stroke="#22D3EE" strokeWidth="4.5" strokeLinecap="round" opacity="0.6" filter="url(#neon-glow)" />
              <path d="M 88 56 Q 92 57 96 58" stroke="#F59E0B" strokeWidth="4" opacity="0.65" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'rhomboideus_minor' && (
            <g id="rhomboideus-minor-comprehensive-areas" className="pointer-events-none">
              <line x1="100" y1="62" x2="100" y2="66" stroke="#22D3EE" strokeWidth="4.5" strokeLinecap="round" opacity="0.65" filter="url(#neon-glow)" />
              <line x1="88" y1="68" x2="88" y2="72" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" opacity="0.65" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'rhomboideus_major' && (
            <g id="rhomboideus-major-comprehensive-areas" className="pointer-events-none">
              <line x1="100" y1="70" x2="100" y2="86" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" opacity="0.65" filter="url(#neon-glow)" />
              <line x1="88" y1="76" x2="88" y2="92" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" opacity="0.65" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'biceps_femoris' && (
            <g id="biceps-femoris-comprehensive-areas" className="pointer-events-none">
              {/* Celý začátek: Sedací hrbol a kyčle */}
              <circle cx="92" cy="192" r="7" fill="#22D3EE" opacity="0.65" filter="url(#neon-glow)" />
              {/* Celý úpon: Hlavička lýtkové kosti */}
              <ellipse cx="72" cy="274" rx="7" ry="4" fill="#F59E0B" opacity="0.65" filter="url(#neon-glow)" />
            </g>
          )}
          {muscleId === 'triceps_surae' && (
            <g id="triceps-surae-comprehensive-areas" className="pointer-events-none">
              {/* Celý začátek: Kondyly stehenní kosti nad kolenem */}
              <path d="M 118 265 Q 122 263 126 265" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" opacity="0.65" filter="url(#neon-glow)" />
              {/* Celý úpon: Patní hrbol přes Achillovu šlachu */}
              <ellipse cx="128" cy="350" rx="8" ry="4" fill="#F59E0B" opacity="0.65" filter="url(#neon-glow)" />
            </g>
          )}

          {/* Generické zvětšené zářící kruhy u všech ostatních svalů */}
          {!['trapezius', 'latissimus_dorsi', 'erector_spinae', 'pectoralis_major', 'rectus_abdominis', 'sternocleidomastoid', 'scalene_muscles', 'rhomboideus_minor', 'rhomboideus_major', 'biceps_femoris', 'triceps_surae'].includes(muscleId) && (
            <g id="generic-comprehensive-highlights" className="pointer-events-none">
              <circle cx={origin.x} cy={origin.y} r="8" fill="#22D3EE" opacity="0.45" filter="url(#neon-glow)" />
              <circle cx={insertion.x} cy={insertion.y} r="8" fill="#F59E0B" opacity="0.45" filter="url(#neon-glow)" />
            </g>
          )}

          {/* === ANATOMICAL JUNCTIONS (ORIGIN & INSERTION) === */}
          {/* Simple subtle glowing background rings under points */}
          <circle
            cx={origin.x}
            cy={origin.y}
            r="8"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="0.8"
            opacity="0.4"
          />
          <circle
            cx={insertion.x}
            cy={insertion.y}
            r="8"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="0.8"
            opacity="0.4"
          />

          {/* Origin Point O Dot */}
          <g id={`pt-origin-${muscleId}`}>
            <circle
              cx={origin.x}
              cy={origin.y}
              r="4.5"
              fill="#22D3EE"
              stroke="#0891B2"
              strokeWidth="1.5"
            />
            {/* O label indicator in SVG space */}
            <rect
              x={origin.x - 5.5}
              y={origin.y - 12}
              width="11"
              height="8"
              rx="1.5"
              fill="#0E7490"
              opacity="0.95"
            />
            <text
              x={origin.x}
              y={origin.y - 6}
              fontFamily="monospace"
              fontSize="6"
              fontWeight="bold"
              fill="#E0F7FA"
              textAnchor="middle"
            >
              O
            </text>
          </g>

          {/* Insertion Point I Dot */}
          <g id={`pt-insertion-${muscleId}`}>
            <circle
              cx={insertion.x}
              cy={insertion.y}
              r="4.5"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            {/* I label indicator in SVG space */}
            <rect
              x={insertion.x - 5.5}
              y={insertion.y - 12}
              width="11"
              height="8"
              rx="1.5"
              fill="#B45309"
              opacity="0.95"
            />
            <text
              x={insertion.x}
              y={insertion.y - 6}
              fontFamily="monospace"
              fontSize="6"
              fontWeight="bold"
              fill="#FEF3C7"
              textAnchor="middle"
            >
              I
            </text>
          </g>
        </svg>
      </div>

      {/* Minimalist Color Legend replacing bulky repetitive descriptions */}
      <div className="flex items-center justify-center gap-5 text-[9px] font-bold font-sans text-[#71717A] mt-1 select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] shadow-[0_0_5px_rgba(34,211,238,0.5)]"></span>
          Začátek (Origo - O)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span>
          Úpon (Insertio - I)
        </span>
      </div>
    </div>
  );
}
