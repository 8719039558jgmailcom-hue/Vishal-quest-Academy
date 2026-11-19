import { AnimatePresence, motion } from 'motion/react';
import { Crown, FlaskConical, Map, Shield, Swords, Trophy, Users } from 'lucide-react';
import { Medium } from '../types/quiz';

export type PortalTransitionKind =
  | 'leaderboard'
  | 'multiplayer'
  | 'subject-map'
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
          accent: 'text-amber-400',
          border: 'border-amber-400/70',
          title:
            medium === 'hi'
              ? 'ग्लोबल लीडरबोर्ड · हॉल ऑफ चैंपियंस'
              : 'Global Leaderboard · Hall of Champions',
          desc:
            medium === 'hi'
              ? 'शीर्ष एमपी बोर्ड योद्धाओं की रैंकिंग लोड हो रही है...'
              : 'Entering Ranked Citadel...',
        };
      case 'multiplayer':
        return {
          icon: Users,
          accent: 'text-sky-400',
          border: 'border-sky-400/70',
          title:
            medium === 'hi'
              ? 'लाइव मल्टीप्लेयर अखाड़ा'
              : 'Multiplayer Duel & Squad Arena',
          desc:
            medium === 'hi'
              ? 'स्टडी स्क्वाड और लाइव द्वंद्व कक्ष खुल रहे हैं...'
              : 'Syncing live rooms...',
        };
      case 'subject-map':
        return {
          icon: Map,
          accent: 'text-amber-400',
          border: 'border-amber-400/70',
          title:
            medium === 'hi' ? 'NCERT अध्याय क्वेस्ट मैप' : 'NCERT Chapter Quest Map',
          desc:
            subtitle ||
            (medium === 'hi'
              ? 'काव्य खंड, गद्य खंड व पुस्तक पथ खुल रहे हैं...'
              : 'Unfolding chapter trails & book sections...'),
        };
      case 'chemistry-lab':
        return {
          icon: FlaskConical,
          accent: 'text-emerald-400',
          border: 'border-emerald-400/70',
          title:
            medium === 'hi' ? 'वर्चुअल रसायन बीकर लैब' : 'Virtual Beaker Alchemy Lab',
          desc:
            medium === 'hi'
              ? 'अभिकर्मक और प्रयोग उपकरण तैयार हो रहे हैं...'
              : 'Preparing virtual reagents & pH sensors...',
        };
      case 'battle':
        return {
          icon: Swords,
          accent: 'text-red-400',
          border: 'border-red-400/70',
          title: medium === 'hi' ? 'बॉस युद्ध प्रारंभ!' : 'Entering Boss Arena!',
          desc:
            subtitle ||
            (medium === 'hi' ? 'तलवारें तैयार करें...' : 'Draw your blade...'),
        };
      case 'barracks':
        return {
          icon: Shield,
          accent: 'text-amber-400',
          border: 'border-amber-400/70',
          title: medium === 'hi' ? 'नायक बैरक व अवतार कक्ष' : 'Hero Barracks & Trophy Hall',
          desc:
            medium === 'hi'
              ? 'बॉस मुहरें व युद्ध लॉग खुल रहे हैं...'
              : 'Loading custom profile & boss seals...',
        };
      default:
        return {
          icon: Crown,
          accent: 'text-amber-400',
          border: 'border-amber-400/60',
          title: medium === 'hi' ? 'विषय क्वेस्ट हब' : 'Academy Subject Hubs',
          desc:
            medium === 'hi'
              ? 'कक्षा 10वीं व 12वीं लोक खुल रहे हैं...'
              : 'Opening Class 10th & 12th Realms...',
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
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#091326]/94"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.84, rotateX: 16, y: 18 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 1.06, rotateX: -8, y: -12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 900 }}
            className={`relative px-8 py-7 rounded-2xl bg-[#162033] border-2 ${cfg.border} adventure-card-3d text-center max-w-md mx-4 space-y-3`}
          >
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <motion.div
                initial={{ rotate: 0, scale: 0.7 }}
                animate={{ rotate: 180, scale: 1.08 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className={`absolute inset-0 rounded-2xl border-2 border-dashed ${cfg.border} opacity-65`}
              />
              <motion.div
                initial={{ rotate: -18, scale: 0.75 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                className="w-12 h-12 rounded-xl bg-[#0B1220] border border-slate-600 flex items-center justify-center shadow-lg"
              >
                <IconComp className={`w-6 h-6 ${cfg.accent}`} aria-hidden="true" />
              </motion.div>
            </div>
            <p className="font-display text-lg sm:text-xl font-bold text-white">
              {cfg.title}
            </p>
            <p className="text-xs text-slate-300">{cfg.desc}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

