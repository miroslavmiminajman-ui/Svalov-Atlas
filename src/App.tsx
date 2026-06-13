/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Muscle, 
  musclesData, 
  searchMuscles, 
  MUSCLE_GROUPS 
} from './data/muscles';
import AnatomyModel from './components/AnatomyModel';
import MuscleDetail from './components/MuscleDetail';
import MuscleCompare from './components/MuscleCompare';
import PostureGuide from './components/PostureGuide';
import QuizSection from './components/QuizSection';
import StretchingGuide from './components/StretchingGuide';
import MethodicalStretchCard from './components/MethodicalStretchCard';

// Lucide Icons imports
import { 
  Search, 
  Filter, 
  Sliders, 
  ShieldAlert, 
  Brain, 
  Activity, 
  BookOpen, 
  Layers, 
  Sparkles, 
  Trash2,
  RefreshCw,
  X,
  HelpCircle,
  Dumbbell,
  Heart,
  ArrowUp
} from 'lucide-react';

export default function App() {
  // Navigation Tabs: 'atlas' | 'stretching' | 'guide' | 'quiz'
  const [activeTab, setActiveTab] = useState<'atlas' | 'stretching' | 'guide' | 'quiz'>('atlas');

  // Search and Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedTendency, setSelectedTendency] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<string>('all');

  // Interactive Selection State
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>('trapezius'); // default selection

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scrolling to show the "Back to Search" button
  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled past 400px
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll back to search and focus on click
  const scrollToSearch = () => {
    const searchInput = document.getElementById('muscle-search-input');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add subtle styling highlight or focus
      setTimeout(() => {
        searchInput.focus({ preventScroll: true });
      }, 500); // Wait for the smooth scroll transition to finish
    }
  };

  // Handles explicit muscle selection and scrolls smoothly to detail block
  const handleMuscleSelect = (id: string | null) => {
    setSelectedMuscleId(id);
    if (id) {
      setTimeout(() => {
        const element = document.getElementById(`detail-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80); // Slight delay for rendering
    }
  };

  // Focus and scroll to the search input on open
  useEffect(() => {
    const searchInput = document.getElementById('muscle-search-input');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'auto', block: 'center' });
      // Only call focus on desktop clients to prevent annoying soft keyboard pops on mobile
      if (window.innerWidth >= 768) {
        searchInput.focus();
      }
    }
    setIsInitialLoad(false);
  }, []);

  // Comparation State
  const [compareMuscle, setCompareMuscle] = useState<Muscle | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Suggested search prompts
  const searchPrompts = ['vstávání', 'kulatá záda', 'biceps', 'mrtvý tah', 'bolest v kříži', 'kolena x'];

  // Handle setting a search query immediately
  const handleSetPrompt = (prompt: string) => {
    setSearchQuery(prompt);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGroup('all');
    setSelectedTendency('all');
    setSelectedView('all');
  };

  // Perform multi-dimensional filtering on the core muscle list
  const filteredMuscles = useMemo(() => {
    let result = musclesData;

    // Apply Search Query Index
    if (searchQuery.trim()) {
      result = searchMuscles(searchQuery);
    }

    // Filter by Muscle Group
    if (selectedGroup !== 'all') {
      result = result.filter((m) => m.groupKey === selectedGroup);
    }

    // Filter by Tendency (zkracování, ochabování, přetěžování)
    if (selectedTendency !== 'all') {
      result = result.filter((m) => m.tendency === selectedTendency);
    }

    // Filter by Anterior/Posterior view mapping
    if (selectedView !== 'all') {
      result = result.filter((m) => m.view === selectedView || m.view === 'both');
    }

    return result;
  }, [searchQuery, selectedGroup, selectedTendency, selectedView]);

  // Sync selected muscle with filters if selected muscle goes out of filtered range
  useEffect(() => {
    if (filteredMuscles.length > 0) {
      const exists = filteredMuscles.some((m) => m.id === selectedMuscleId);
      if (!exists) {
        // Find first match or nullify
        setSelectedMuscleId(filteredMuscles[0].id);
      }
    } else {
      setSelectedMuscleId(null);
    }
  }, [filteredMuscles, selectedMuscleId]);

  // Resolving selected muscle entity
  const currentMuscle = useMemo(() => {
    return musclesData.find((m) => m.id === selectedMuscleId) || null;
  }, [selectedMuscleId]);

  // Handle initiating compare mode for selected muscle
  const handleAddToCompare = (muscle: Muscle) => {
    setCompareMuscle(muscle);
    setIsComparing(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] flex flex-col font-sans selection:bg-cyan-500 selection:text-black antialiased">
      
      {/* GLOW BACKGROUND ORBS */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#121214]/90 backdrop-blur-md border-b border-[#27272A] px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded bg-cyan-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/20">
              <Activity size={18} />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#121214]"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-none font-display">
                ANATOMICKÝ <span className="text-cyan-400">ATLAS</span>
              </h1>
              <p className="text-[10px] text-[#71717A] font-semibold tracking-wide uppercase mt-1">
                Interaktivní průvodce anatomií & pohybem
              </p>
            </div>
          </div>

          {/* Core App Navigation Tabs */}
          <nav className="flex overflow-x-auto max-w-full scrollbar-none gap-1 bg-[#0F0F11] p-1 rounded-xl border border-[#27272A] w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-1">
            <button
              onClick={() => { setActiveTab('atlas'); setIsComparing(false); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border shrink-0 whitespace-nowrap ${
                activeTab === 'atlas' && !isComparing
                  ? 'bg-[#1C1C1F] text-cyan-400 border-[#27272A] shadow-md shadow-black/40'
                  : 'text-[#71717A] hover:text-[#A1A1AA] border-transparent'
              }`}
              id="tab-atlas"
            >
              <Layers size={14} />
              Svalový Atlas
            </button>
            <button
              onClick={() => { setActiveTab('stretching'); setIsComparing(false); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border shrink-0 whitespace-nowrap ${
                activeTab === 'stretching'
                  ? 'bg-[#1C1C1F] text-cyan-400 border-[#27272A] shadow-md shadow-black/40'
                  : 'text-[#71717A] hover:text-[#A1A1AA] border-transparent'
              }`}
              id="tab-stretching"
            >
              <Heart size={14} className={activeTab === 'stretching' ? 'text-rose-400' : ''} />
              Strečink svalů
            </button>
            <button
              onClick={() => { setActiveTab('guide'); setIsComparing(false); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border shrink-0 whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-[#1C1C1F] text-cyan-400 border-[#27272A] shadow-md shadow-black/40'
                  : 'text-[#71717A] hover:text-[#A1A1AA] border-transparent'
              }`}
              id="tab-posture"
            >
              <ShieldAlert size={14} />
              Svalové Disbalance
            </button>
            <button
              onClick={() => { setActiveTab('quiz'); setIsComparing(false); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border shrink-0 whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-[#1C1C1F] text-cyan-400 border-[#27272A] shadow-md shadow-black/40'
                  : 'text-[#71717A] hover:text-[#A1A1AA] border-transparent'
              }`}
              id="tab-quiz"
            >
              <Brain size={14} />
              Test Znalostí
            </button>
          </nav>

        </div>
      </header>

      {/* COMPONENT VIEWS */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-6 relative z-10">
        
        {/* COMPARE MODE OVERLAY */}
        {isComparing && (
          <div className="animate-fade-in">
            <MuscleCompare 
              initialMuscle={compareMuscle} 
              onClose={() => setIsComparing(false)} 
            />
          </div>
        )}

        {/* ATLAS VIEW */}
        {!isComparing && activeTab === 'atlas' && (
          <div className="flex flex-col gap-6 w-full">
            
            {/* TOP ROW: SEARCH & ANATOMY MODEL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* COLUMN 1: SIDEBAR SEARCH, FILTERS & MUSCLE LIST */}
              <section className="lg:col-span-5 flex flex-col gap-4 h-full lg:h-[720px] bg-[#0F0F11] border border-[#27272A] rounded-2xl p-4 sm:p-5 shadow-xl">
                
                {/* Box Header Search */}
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" size={16} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Hledat sval (česky, latinsky, začátek...)"
                      className="w-full bg-[#1C1C1F] border border-[#3F3F46] focus:border-cyan-500 text-[#E4E4E7] placeholder-[#71717A] pl-10 pr-9 py-2.5 rounded-xl text-xs font-medium focus:ring-1 focus:ring-cyan-500 focus:outline-none transition"
                      id="muscle-search-input"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white p-0.5 rounded-full hover:bg-[#1C1C1F]"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Search suggestion terms */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-[#52525B] font-sans font-bold uppercase tracking-wider">Hledat:</span>
                    {searchPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSetPrompt(prompt)}
                        className="text-[10px] bg-[#1C1C1F]/40 text-[#A1A1AA] hover:text-cyan-400 hover:bg-[#1C1C1F] px-2 py-0.5 rounded border border-[#27272A]/60 transition"
                        id={`prompt-${prompt.replace(/\s+/g, '-')}`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FILTERS DRAWER */}
                <div className="bg-[#121214] rounded-xl p-3.5 border border-[#27272A] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] flex items-center gap-1">
                      <Filter size={11} className="text-cyan-400" />
                      Rozšířené filtry
                    </span>
                    {(selectedGroup !== 'all' || selectedTendency !== 'all' || selectedView !== 'all' || searchQuery) && (
                      <button
                        onClick={handleResetFilters}
                        className="text-[10px] font-bold text-rose-450 hover:text-rose-400 flex items-center gap-1"
                        id="btn-reset-filters"
                      >
                        <Trash2 size={10} />
                        Uvolnit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Select Group */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-[#52525B] uppercase font-bold tracking-wider">Skupina svalů</label>
                      <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="bg-[#1C1C1F] border border-[#3F3F46] text-[#D4D4D8] rounded-lg p-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        id="filter-group-select"
                      >
                        <option value="all">Všechny skupiny</option>
                        {Object.entries(MUSCLE_GROUPS).map(([key, info]) => (
                          <option key={key} value={key}>
                            {info.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select Tendency */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-[#52525B] uppercase font-bold tracking-wider">Vlastnost / Tendence</label>
                      <select
                        value={selectedTendency}
                        onChange={(e) => setSelectedTendency(e.target.value)}
                        className="bg-[#1C1C1F] border border-[#3F3F46] text-[#D4D4D8] rounded-lg p-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        id="filter-tendency-select"
                      >
                        <option value="all">Jakákoliv tendence</option>
                        <option value="zkracování">Zkracování (Tonická)</option>
                        <option value="ochabování">Ochabování (Fázická)</option>
                        <option value="přetěžování">Přetěžování</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* LIST RESULTS COUNTER */}
                <div className="flex items-center justify-between text-[11px] text-[#71717A] px-1 font-mono">
                  <span>Nalezené svaly ({filteredMuscles.length})</span>
                  {filteredMuscles.length === 0 && (
                    <span className="text-rose-450">Žádná shoda</span>
                  )}
                </div>

                {/* SCROLLABLE MUSCLE LIST */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-2 select-none h-[280px] md:h-auto custom-scrollbar">
                  {filteredMuscles.map((muscle) => {
                    const isSel = selectedMuscleId === muscle.id;
                    const groupInfo = MUSCLE_GROUPS[muscle.groupKey as keyof typeof MUSCLE_GROUPS];
                    
                    return (
                      <div
                        key={muscle.id}
                        onClick={() => handleMuscleSelect(muscle.id)}
                        className={`p-3 rounded-lg border transition-all duration-150 cursor-pointer flex flex-col gap-1 ${
                          isSel 
                            ? 'bg-[#1C1C1F] border-cyan-500/30 shadow-md shadow-cyan-500/5' 
                            : 'bg-[#121214]/40 border-[#27272A] hover:bg-[#1C1C1F] hover:text-white'
                        }`}
                        id={`muscle-list-item-${muscle.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-sm font-semibold leading-snug ${isSel ? 'text-cyan-400' : 'text-[#E4E4E7]'}`}>
                            {muscle.nameCs}
                          </span>
                          
                          {/* Tendency Indicator dot */}
                          <span 
                            className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                              muscle.tendency === 'zkracování' 
                                ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)]' 
                                : muscle.tendency === 'ochabování' 
                                  ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.4)]' 
                                  : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]'
                            }`}
                            title={`Tendence: ${muscle.tendency}`}
                          ></span>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2 mt-0.5 text-[10px]">
                          <span className="text-[#71717A] italic font-mono">{muscle.nameLa}</span>
                          <span className="text-[#52525B] font-bold uppercase tracking-wider text-[9px]">{groupInfo?.name || muscle.group}</span>
                        </div>
                      </div>
                    );
                  })}

                  {filteredMuscles.length === 0 && (
                    <div className="text-center py-10 text-[#71717A] flex flex-col items-center gap-2">
                      <Sliders size={24} className="opacity-20 animate-spin-slow text-cyan-400" />
                      <p className="text-xs">Žádný sval nesplňuje zadaná kritéria.</p>
                      <button
                        onClick={handleResetFilters}
                        className="text-xs text-cyan-400 underline hover:text-cyan-300 font-semibold"
                      >
                        Zrušit všechny filtry
                      </button>
                    </div>
                  )}
                </div>

              </section>

              {/* COLUMN 2: INTERACTIVE BODY MODEL */}
              <section className="lg:col-span-7 h-full lg:h-[720px]">
                <AnatomyModel 
                  selectedMuscleId={selectedMuscleId} 
                  onSelectMuscle={(id) => handleMuscleSelect(id)} 
                  filteredMuscles={filteredMuscles} 
                />
              </section>

            </div>

            {/* SELECTED MUSCLE DETAILED REPORT (Now placed ABOVE methodical stretch) */}
            {currentMuscle ? (
              <MuscleDetail 
                muscle={currentMuscle} 
                onAddToCompare={handleAddToCompare} 
              />
            ) : (
              <div className="bg-[#0F0F11] border border-[#27272A] rounded-2xl p-8 text-center text-[#71717A] flex flex-col items-center justify-center gap-2 min-h-[150px]">
                <HelpCircle size={40} className="text-[#3F3F46] animate-pulse" />
                <p className="text-sm">Vyberte sval ze seznamu nebo klikněte na model těla k zobrazení rozboru svalu.</p>
              </div>
            )}

            {/* METHODICAL DETAIL CARD (STRETCHING & STRENGTHENING) */}
            {currentMuscle ? (
              <MethodicalStretchCard 
                muscle={currentMuscle}
              />
            ) : (
              <div className="bg-[#0F0F11]/50 border border-[#27272A]/40 rounded-2xl p-6 text-center text-xs text-[#71717A] italic">
                Vyberte sval pro zobrazení podrobného metodického postupu protažení.
              </div>
            )}

          </div>
        )}

        {/* POSTURE GUIDE VIEW */}
        {activeTab === 'stretching' && !isComparing && (
          <div className="max-w-4xl mx-auto w-full animate-fade-in">
            <StretchingGuide 
              onSelectAndLocateMuscle={(muscleId) => {
                setSelectedMuscleId(muscleId);
                setActiveTab('atlas');
                setTimeout(() => {
                  const element = document.getElementById(`detail-${muscleId}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 150);
              }}
            />
          </div>
        )}

        {/* POSTURE GUIDE VIEW */}
        {activeTab === 'guide' && !isComparing && (
          <div className="max-w-4xl mx-auto w-full animate-fade-in">
            <PostureGuide />
          </div>
        )}

        {/* QUIZ SECTION VIEW */}
        {activeTab === 'quiz' && !isComparing && (
          <div className="w-full animate-fade-in">
            <QuizSection />
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto py-4 border-t border-[#27272A] text-center text-[#52525B] text-[10px] bg-[#0F0F11] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <p>© 2026 Český Anatomický Svalový Atlas. Všechna práva vyhrazena.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 uppercase text-[#71717A] text-[9px] tracking-wider">
              <span className="w-1.5 h-1.5 block rounded-full bg-cyan-400"></span>
              Metodika: Prof. Janda • Aktivní model
            </span>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON - BACK TO SEARCH */}
      {showScrollTop && activeTab === 'atlas' && !isComparing && (
        <button
          onClick={scrollToSearch}
          className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8 bg-[#121214]/90 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-white px-4 py-3 rounded-full shadow-2xl shadow-cyan-500/15 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 flex items-center gap-2 group font-display font-bold text-xs select-none cursor-pointer"
          id="scroll-to-search-floating-btn"
          title="Zpět k vyhledávání"
        >
          <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
          <Search size={14} className="opacity-70 group-hover:scale-110 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-[10px] sm:text-[11px] uppercase tracking-wider ml-0.5">
            Zpět k vyhledávání
          </span>
        </button>
      )}

    </div>
  );
}
