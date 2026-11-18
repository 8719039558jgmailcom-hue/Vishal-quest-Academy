import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { GradeLevel, Medium } from '../types/quiz';

export type ActiveView =
  | 'hub'
  | 'subject-map'
  | 'battle'
  | 'results'
  | 'barracks'
  | 'multiplayer';

interface HeaderProps {
  activeView: ActiveView;
  medium: Medium;
  onNavigate: (view: ActiveView) => void;
  onJumpToGradeHub: (grade: GradeLevel) => void;
  onLaunchFeaturedBoss: () => void;
}

export function Header({
  activeView,
  medium,
  onNavigate,
  onJumpToGradeHub,
  onLaunchFeaturedBoss,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAction = (fn: () => void) => {
    setMobileOpen(false);
    fn();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B1220] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleAction(() => onNavigate('hub'))}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-amber-400 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 rounded"
        >
          Vishal&apos;s Quest Academy
        </button>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          <button
            type="button"
            onClick={() => onNavigate('hub')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
              activeView === 'hub' || activeView === 'subject-map'
                ? 'border-amber-400 text-white'
                : 'border-transparent hover:text-white hover:border-slate-600'
            }`}
          >
            {medium === 'hi' ? 'विषय हब' : 'Subject Hubs'}
          </button>
          <button
            type="button"
            onClick={() => onJumpToGradeHub('10')}
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-white hover:border-slate-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            {medium === 'hi' ? 'कक्षा 10वीं' : 'Class 10th'}
          </button>
          <button
            type="button"
            onClick={() => onJumpToGradeHub('12')}
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-white hover:border-slate-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            {medium === 'hi' ? 'कक्षा 12वीं' : 'Class 12th'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('multiplayer')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
              activeView === 'multiplayer'
                ? 'border-amber-400 text-white'
                : 'border-transparent hover:text-white hover:border-slate-600'
            }`}
          >
            {medium === 'hi' ? 'मल्टीप्लेयर' : 'Multiplayer'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('barracks')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
              activeView === 'barracks'
                ? 'border-amber-400 text-white'
                : 'border-transparent hover:text-white hover:border-slate-600'
            }`}
          >
            {medium === 'hi' ? 'अवतार व प्रगति' : 'Hero Barracks'}
          </button>
        </nav>

        {/* Zone 3: 1 primary CTA + mobile drawer button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleAction(onLaunchFeaturedBoss)}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg adventure-btn-gold whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            {medium === 'hi' ? 'बॉस युद्ध' : 'Boss Battle'}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0F172A] px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => handleAction(() => onNavigate('hub'))}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-slate-200 rounded-lg hover:bg-slate-800"
          >
            {medium === 'hi' ? 'विषय हब' : 'Subject Hubs'}
          </button>
          <button
            type="button"
            onClick={() => handleAction(() => onJumpToGradeHub('10'))}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-slate-200 rounded-lg hover:bg-slate-800"
          >
            {medium === 'hi' ? 'कक्षा 10वीं' : 'Class 10th'}
          </button>
          <button
            type="button"
            onClick={() => handleAction(() => onJumpToGradeHub('12'))}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-slate-200 rounded-lg hover:bg-slate-800"
          >
            {medium === 'hi' ? 'कक्षा 12वीं' : 'Class 12th'}
          </button>
          <button
            type="button"
            onClick={() => handleAction(() => onNavigate('multiplayer'))}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-slate-200 rounded-lg hover:bg-slate-800"
          >
            {medium === 'hi' ? 'लाइव मल्टीप्लेयर' : 'Multiplayer'}
          </button>
          <button
            type="button"
            onClick={() => handleAction(() => onNavigate('barracks'))}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-slate-200 rounded-lg hover:bg-slate-800"
          >
            {medium === 'hi' ? 'अवतार व प्रगति' : 'Hero Barracks'}
          </button>
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => handleAction(onLaunchFeaturedBoss)}
              className="w-full px-4 py-2.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              {medium === 'hi' ? 'बॉस युद्ध शुरू करें' : 'Boss Battle'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
