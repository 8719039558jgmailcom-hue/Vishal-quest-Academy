import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Crown, FlaskConical, Map, Shield, Swords, Trophy, Users } from 'lucide-react';
import { Medium } from '../types/quiz';

export type PortalTransitionKind =
  | 'leaderboard'
  | 'multiplayer'
  | 'subject-map'
  | 'practice'
  | 'battle'
  | 'barracks'
  | 'hub'
  | 'chemistry-lab'
  | null;

interface PortalTransitionOverlayProps {
  activePortal: PortalTransitionKind;
  medium: Medium;
  subtitle?: string;
}

export function PortalTransitionOverlay({
  activePortal,
  medium,
  subtitle,
}: PortalTransitionOverlayProps) {
  const getConfig = () => {
    switch (activePortal) {
      case 'leaderboard':
        return {
          icon: Trophy,
          cardBg: 'bg-[#FEF08A]',
          badgeBg: 'bg-[#F97316]',
          title:
            medium === 'hi'
              ? 'ग्लोबल लीडरबोर्ड!'
              : 'Global Leaderboard!',
          desc:
            medium === 'hi'
              ? 'शीर्ष एमपी बोर्ड चैंपियंस लोड हो रहे हैं...'
              : 'Opening Top MP Board Champions...',
        };
      case 'multiplayer':
        return {
          icon: Users,
          cardBg: 'bg-[#DBEAFE]',
          badgeBg: 'bg-[#2563EB]',
          title:
            medium === 'hi' ? 'लाइव द्वंद्व व स्क्वाड' : 'Live Duels & Squads',
          desc:
            medium === 'hi' ? 'अखाड़ा जुड़ रहा है...' : 'Syncing multiplayer rooms...',
        };
      case 'practice':
        return {
          icon: BookOpen,
          cardBg: 'bg-[#E0F2FE]',
          badgeBg: 'bg-[#0284C7]',
          title: medium === 'hi' ? 'अभ्यास और नोट्स डोजो' : 'Practice & Notes Dojo',
          desc:
            medium === 'hi'
              ? 'NCERT नोट्स व केमिस्ट्री लैब खुल रहे हैं...'
              : 'Loading study codex & beaker lab...',
        };
      case 'subject-map':
        return {
          icon: Map,
          cardBg: 'bg-[#ECFDF5]',
          badgeBg: 'bg-[#10B981]',
          title: medium === 'hi' ? 'अध्याय क्वेस्ट मैप' : 'Chapter Quest Trail',
          desc:
            subtitle ||
            (medium === 'hi' ? 'अध्याय चरण खुल रहे हैं...' : 'Opening chapter missions...'),
        };
      case 'chemistry-lab':
        return {
          icon: FlaskConical,
          cardBg: 'bg-[#F3E8FF]',
          badgeBg: 'bg-[#7C3AED]',
          title: medium === 'hi' ? 'वर्चुअल बीकर लैब' : 'Virtual Beaker Lab',
          desc:
            medium === 'hi'
              ? 'रसायन अभिकर्मक तैयार हो रहे हैं...'
              : 'Preparing reagents & pH meters...',
        };
      case 'battle':
        return {
          icon: Swords,
          cardBg: 'bg-[#FFE4E6]',
          badgeBg: 'bg-[#E11D48]',
          title: medium === 'hi' ? 'बॉस युद्ध शुरू!' : 'BOSS BATTLE!',
          desc:
            subtitle || (medium === 'hi' ? 'तैयार हो जाओ योद्धा!' : 'Get ready to strike!'),
        };
      case 'barracks':
        return {
          icon: Shield,
          cardBg: 'bg-[#D1FAE5]',
          badgeBg: 'bg-[#059669]',
          title: medium === 'hi' ? 'हीरो प्रोफ़ाइल' : 'Hero Profile',
          desc:
            medium === 'hi' ? 'अवतार व ट्रॉफ़ी खुल रही हैं...' : 'Opening hero pass & seals...',
        };
      default:
        return {
          icon: Crown,
          cardBg: 'bg-[#FEF9C3]',
          badgeBg: 'bg-[#EAB308]',
          title: medium === 'hi' ? 'क्वेस्ट हब' : 'Quest Hub',
          desc:
            medium === 'hi' ? 'कक्षा 10वीं व 12वीं मिशन...' : 'Loading Class 10th & 12th...',
        };
    }
  };

  const cfg = getConfig();
  const IconComp = cfg.icon;

  return (
    <AnimatePresence>
      {activePortal && (
        <motion.div
          key={activePortal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#181C32]/65 px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`w-full max-w-xs rounded-3xl ${cfg.cardBg} border-[3px] border-[#181C32] shadow-[0_8px_0_#181C32] p-6 text-center space-y-2.5`}
          >
            <motion.div
              initial={{ rotate: -12, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 18 }}
              className={`w-14 h-14 mx-auto rounded-2xl ${cfg.badgeBg} border-[2.5px] border-[#181C32] shadow-[0_4px_0_#181C32] flex items-center justify-center text-white`}
            >
              <IconComp className="w-7 h-7" aria-hidden="true" />
            </motion.div>
            <p className="font-display text-xl font-bold text-[#181C32] leading-tight">
              {cfg.title}
            </p>
            <p className="text-xs font-semibold text-[#181C32]/75">{cfg.desc}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
