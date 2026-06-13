/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Muscle, musclesData } from '../data/muscles';
import { HelpCircle, CheckCircle2, AlertCircle, RefreshCw, Award, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Generate some fun, static, high-grade anatomical questions using our musclesData
const QUESTIONS_POOL: Question[] = [
  {
    id: 1,
    text: "Který sval má velkou náchylnost ke zkracování a tvoří horní část tzv. horního zkříženého syndromu?",
    options: ["Velký sval hýžďový", "Přední sval pilovitý", "Trapézový sval (horní část)", "Přední sval holenní"],
    correctIndex: 2,
    explanation: "Horní část trapézového svalu má velmi silnou tendenci ke zkracování a přetěžování ze stresu a sedění, zatímco dolní a střední vlákna spíše ochabují."
  },
  {
    id: 2,
    text: "Který sval se latinsky nazývá 'm. latissimus dorsi'?",
    options: ["Široký sval zádový", "Zdvihač hlavy", "Deltový sval", "Dvojhlavý sval pažní"],
    correctIndex: 0,
    explanation: "m. latissimus dorsi je Široký sval zádový, což je nejširší sval lidského těla."
  },
  {
    id: 3,
    text: "Který sval se řadí mezi 'hluboký stabilizační systém' (core), neprovádí viditelný pohyb kloubů, ale stahuje břicho jako korzet?",
    options: ["Přímý sval břišní", "Příčný sval břišní (m. transversus)", "Velký sval prsní", "Krejčovský sval"],
    correctIndex: 1,
    explanation: "Příčný sval břišní (m. transversus abdominis) funguje jako přirozený vzpěračský opasek a stabilizuje bederní páteř."
  },
  {
    id: 4,
    text: "Máte-li tzv. 'gluteální amnézii' ze sedavého zaměstnání, který veledůležitý sval v těle vám nejčastěji ochabuje a přestává pracovat?",
    options: ["Trojhlavý sval lýtkový", "Deltový sval", "Velký sval hýžďový", "Sval bedrokyčlostehenní"],
    correctIndex: 2,
    explanation: "Velký sval hýžďový (m. gluteus maximus) má nejsilnější tendenci k ochabování při celodenním sezení, což vede k přetěžování beder."
  },
  {
    id: 5,
    text: "Který sval v lidském těle je nejdelší a umožňuje nám například zkřížit nohy do tureckého sedu?",
    options: ["Dvojhlavý sval stehenní", "Krejčovský sval (m. sartorius)", "Široký sval zádový", "Vřetenní sval"],
    correctIndex: 1,
    explanation: "Krejčovský sval (m. sartorius) je nejdelší sval v těle, který začíná na pánvi a upíná se až pod vnitřní stranu kolene."
  },
  {
    id: 6,
    text: "Do které kosti se upíná mohutná Achillova šlacha z trojhlavého svalu lýtkového?",
    options: ["Kost holenní (tibia)", "Kost stehenní (femur)", "Kost patní (calcaneus)", "Kost křížová (sacrum)"],
    correctIndex: 2,
    explanation: "Achillova šlacha se upíná na patní hrbol (tuber calcanei) a přenáší odrazovou sílu lýtka pro chůzi a běh."
  },
  {
    id: 7,
    text: "Pokud provádíte extenzi lokte (narovnání paže z pokrčení), který sval na paži je hlavním vykonavatelem (agonistou) tohoto pohybu?",
    options: ["Dvojhlavý sval pažní (biceps)", "Trojhlavý sval pažní (triceps)", "Deltový sval", "Vřetenní sval"],
    correctIndex: 1,
    explanation: "Trojhlavý sval pažní (m. triceps brachii) provádí natažení (extenzi) v loketním kloubu, zatímco biceps je jeho oponent (antagonista)."
  }
];

export default function QuizSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUESTIONS_POOL[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOpt === null || isAnswered) return;
    
    if (selectedOpt === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    
    if (currentIdx + 1 < QUESTIONS_POOL.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="bg-[#0F0F11] border border-[#27272A] rounded-2xl p-6 shadow-xl text-[#E4E4E7] max-w-2xl mx-auto" id="quiz-section">
      
      {/* Finished view */}
      {quizFinished ? (
        <div className="flex flex-col items-center text-center py-6 gap-5">
          <div className="w-16 h-16 bg-[#121214] border border-[#27272A] rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Award size={32} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">Znalostní Kvíz Dokončen!</h3>
            <p className="text-[#71717A] text-xs mt-1">Skvělý výkon při procvičování anatomických pohybů</p>
          </div>

          <div className="bg-[#121214] p-5 rounded-xl border border-[#27272A] w-full max-w-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">Dosažené Skóre</span>
            <span className="text-4xl font-extrabold text-cyan-400 font-display">{score}</span>
            <span className="text-[#71717A] text-lg"> / {QUESTIONS_POOL.length}</span>
            
            <div className="mt-3 text-xs text-[#D4D4D8]">
              {score === QUESTIONS_POOL.length ? (
                <p className="text-emerald-450 font-bold">Fantastické! Máte vynikající anatomické znalosti fyzioterapeuta.</p>
              ) : score >= 4 ? (
                <p className="text-cyan-400 font-semibold">Dobrá práce! Základy anatomie a svalových tendencí ovládáte.</p>
              ) : (
                <p className="text-[#71717A]">Doporučujeme projít si atlas, vyhledat svalové tendence a zkusit to znovu!</p>
              )}
            </div>
          </div>

          <button
            onClick={handleRestartQuiz}
            className="px-5 py-2.5 bg-[#1C1C1F] hover:bg-cyan-500 hover:text-black active:bg-cyan-600 border border-[#27272A] hover:border-transparent text-white font-semibold rounded-xl text-xs transition duration-200 flex items-center gap-2 shadow"
            id="btn-restart-quiz"
          >
            <RefreshCw size={14} className="shrink-0" />
            Spustit kvíz znovu
          </button>
        </div>
      ) : (
        /* Question view */
        <div className="flex flex-col gap-5">
          
          {/* Header Progress */}
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="text-cyan-400" size={18} />
              <span className="text-xs font-semibold text-[#D4D4D8] font-display">Anatomický Kvíz</span>
            </div>
            <span className="text-xs text-[#71717A] bg-[#121214] border border-[#27272A] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
              Otázka {currentIdx + 1} z {QUESTIONS_POOL.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#121214] h-1.5 rounded-full overflow-hidden border border-[#27272A]/40">
            <div 
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${((currentIdx) / QUESTIONS_POOL.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <div className="my-2">
            <h4 className="text-base font-bold text-white leading-snug font-display">{currentQuestion.text}</h4>
          </div>

          {/* Options Grid */}
          <div className="flex flex-col gap-2.5">
            {currentQuestion.options.map((opt, idx) => {
              // Styling states
              let borderClass = 'border-[#27272A] bg-[#121214]/60 text-[#D4D4D8] hover:bg-[#1C1C1F] hover:border-[#3F3F46]';
              let badgeElement = null;

              if (selectedOpt === idx) {
                borderClass = 'border-cyan-500 bg-cyan-950/20 text-cyan-405';
              }

              if (isAnswered) {
                if (idx === currentQuestion.correctIndex) {
                  borderClass = 'border-emerald-500/60 bg-emerald-950/20 text-emerald-400';
                  badgeElement = <CheckCircle2 className="text-emerald-400 shrink-0" size={16} />;
                } else if (selectedOpt === idx) {
                  borderClass = 'border-rose-500/60 bg-rose-950/20 text-rose-400';
                  badgeElement = <AlertCircle className="text-rose-405 shrink-0" size={16} />;
                } else {
                  borderClass = 'border-[#27272A]/40 bg-transparent text-[#52525B] pointer-events-none opacity-30';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all duration-200 flex items-center justify-between gap-3 ${borderClass}`}
                  id={`btn-quiz-option-${idx}`}
                >
                  <span>{opt}</span>
                  {badgeElement}
                </button>
              );
            })}
          </div>

          {/* Actions & Explanations */}
          <div className="mt-2">
            {!isAnswered ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOpt === null}
                className={`w-full py-3 rounded-xl font-bold text-xs transition duration-200 shadow ${
                  selectedOpt === null
                    ? 'bg-[#121214] text-[#52525B] cursor-not-allowed border border-[#27272A]'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold hover:shadow-md hover:shadow-cyan-500/10'
                }`}
                id="btn-quiz-confirm"
              >
                Potvrdit odpověď
              </button>
            ) : (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Explanation Block */}
                <div className="bg-[#121214] p-4 rounded-xl border border-[#27272A] text-xs leading-relaxed">
                  <span className="font-bold text-cyan-405 uppercase tracking-widest block mb-1 font-display">Vysvětlení fyzioterapeuta:</span>
                  <p className="text-[#D4D4D8]">{currentQuestion.explanation}</p>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 bg-[#1C1C1F] hover:bg-cyan-500 hover:text-black hover:border-transparent active:bg-cyan-600 text-white font-semibold rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1.5 border border-[#27272A]"
                  id="btn-quiz-next"
                >
                  <span>{currentIdx + 1 < QUESTIONS_POOL.length ? 'Další otázka' : 'Zobrazit hodnocení'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
