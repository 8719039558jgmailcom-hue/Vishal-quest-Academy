import { Compass, Trophy, User, Zap } from 'lucide-react';
import { Medium } from '../types/quiz';
import { ActiveView } from './Header';

interface BottomNavBarProps {
  activeView: ActiveView;
  medium: Medium;
  onNavigate: (view: ActiveView) => void;
  onOpenLeaderboard: () => void;
}

export function BottomNavBar({
  activeView,
  medium,
  onNavigate,
  onOpenLeaderboard,
}: BottomNavBarProps) {
  if (activeView === 'battle') return null;

  const isQuestsActive = activeView === 'hub' || activeView === 'subject-map';
  const isPracticeActive = activeView === 'practice';
  const isRanksActive = activeView === 'multiplayer';
  const isProfileActive = activeView === 'barracks';

  const items = [
    {
      id: 'quests',
      label: medium === 'hi' ? 'क्वेस्ट' : 'Quests',
      icon: Compass,
      active: isQuestsActive,
      activeBg: 'bg-[#FACC15]',
      onClick: () => onNavigate('hub'),
    },
    {
      id: 'practice',
      label: medium === 'hi' ? 'अभ्यास' : 'Practice',
      icon: Zap,
      active: isPracticeActive,
      activeBg: 'bg-[#38BDF8]',
      onClick: () => onNavigate('practice'),
    },
    {
      id: 'leaderboards',
      label: medium === 'hi' ? 'रैंकिंग' : 'Ranks',
      icon: Trophy,
      active: isRanksActive,
      activeBg: 'bg-[#FB7185]',
      onClick: onOpenLeaderboard,
    },
    {
      id: 'profile',
      label: medium === 'hi' ? 'प्रोफ़ाइल' : 'Profile',
      icon: User,
      active: isProfileActive,
      activeBg: 'bg-[#34D399]',
      onClick: () => onNavigate('barracks'),
    },
  ];

  return (
    <nav
      aria-label="Primary game navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t-[2.5px] border-[#181C32] shadow-[0_-4px_0_rgba(24,28,50,0.1)] pb-safe"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-4 h-[56px] items-center px-2 gap-1.5">
        {items.map((item) => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-current={item.active ? 'page' : undefined}
              className={`min-h-[44px] h-11 rounded-xl flex flex-col items-center justify-center transition-transform active:translate-y-[2px] ${
                item.active
                  ? `${item.activeBg} comic-gloss border-2 border-[#181C32] shadow-[0_3px_0_#181C32] -translate-y-0.5 text-[#181C32]`
                  : 'text-slate-600 hover:text-[#181C32] hover:bg-[#EFF6FF]'
              }`}
            >
              <IconComp className="w-5 h-5" strokeWidth={item.active ? 2.5 : 2} aria-hidden="true" />
              <span className="text-[10px] font-extrabold tracking-tight leading-none mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
