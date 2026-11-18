import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  CheckCircle2,
  Crown,
  KeyRound,
  Languages,
  Lock,
  MessageSquare,
  Phone,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { AVATARS, WORLD_MAP_BACKDROP } from '../data/questConfig';
import { AvatarId, GradeLevel, Medium } from '../types/quiz';
import { processCustomAvatarFile } from '../utils/imageUpload';
import { Avatar3DPreview } from './Avatar3DPreview';
import { SafeImage } from './SafeImage';

export interface LoginPayload {
  heroName: string;
  passcode: string;
  bioTitle: string;
  mobileNumber: string;
  verificationToken: string;
  grade: GradeLevel;
  medium: Medium;
  avatarId: AvatarId;
  customAvatarUrl: string | null;
}

interface GamifiedLoginViewProps {
  initialName: string;
  initialPasscode: string;
  initialBioTitle: string;
  initialMobileNumber: string;
  initialGrade: GradeLevel;
  initialMedium: Medium;
  initialAvatarId: AvatarId;
  initialCustomAvatarUrl: string | null;
  onMediumChange: (medium: Medium) => void;
  onEnterAcademy: (payload: LoginPayload) => Promise<void>;
}

export function GamifiedLoginView({
  initialName,
  initialPasscode,
  initialBioTitle,
  initialMobileNumber,
  initialGrade,
  initialMedium,
  initialAvatarId,
  initialCustomAvatarUrl,
  onMediumChange,
  onEnterAcademy,
}: GamifiedLoginViewProps) {
  const [heroName, setHeroName] = useState(initialName === 'Vishal' ? '' : initialName);
  const [passcode, setPasscode] = useState(initialPasscode || 'MP2027');
  const [bioTitle, setBioTitle] = useState(initialBioTitle || '');
  const [grade, setGrade] = useState<GradeLevel>(initialGrade);
  const [avatarId, setAvatarId] = useState<AvatarId>(initialAvatarId);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(initialCustomAvatarUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Mobile Number & CSPRNG OTP Verification State
  const cleanInitialPhone = initialMobileNumber.replace(/\D/g, '').slice(-10);
  const [mobileDigits, setMobileDigits] = useState(cleanInitialPhone);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [maskedMobile, setMaskedMobile] = useState<string | null>(null);
  const [smsPreviewOtp, setSmsPreviewOtp] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(0);
  const [verifiedMobile, setVerifiedMobile] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const selectedPreset = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
  const previewImage = customAvatarUrl || selectedPreset.imagePath;
  const isPhoneValid = /^[6-9]\d{9}$/.test(mobileDigits);
  const otpString = otpDigits.join('');
  const isOtpVerified = Boolean(verificationToken && verifiedMobile);

  useEffect(() => {
    if (resendSeconds <= 0 && expirySeconds <= 0) return;
    const timer = window.setInterval(() => {
      setResendSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendSeconds, expirySeconds]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    try {
      const processed = await processCustomAvatarFile(file);
      setCustomAvatarUrl(processed);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Unable to process image.');
    } finally {
      e.target.value = '';
    }
  };

  const handleMobileInputChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setMobileDigits(digitsOnly);
    setOtpError(null);
    // Reset verification if number changes
    if (verifiedMobile || otpRequested) {
      setVerifiedMobile(null);
      setVerificationToken(null);
      setOtpRequested(false);
      setSmsPreviewOtp(null);
      setOtpDigits(['', '', '', '', '', '']);
      setResendSeconds(0);
      setExpirySeconds(0);
    }
  };

  const handleRequestOtp = async () => {
    if (!isPhoneValid) {
      setOtpError(
        initialMedium === 'hi'
          ? 'कृपया 6, 7, 8 या 9 से शुरू होने वाला मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।'
          : 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
      );
      return;
    }

    setOtpError(null);
    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: `+91${mobileDigits}` }),
      });
      const data = (await res.json()) as {
        error?: string;
        maskedMobile?: string;
        expiresInSeconds?: number;
        resendCooldownSeconds?: number;
        smsPreviewOtp?: string;
      };
      if (!res.ok) {
        setOtpError(data.error || 'Could not generate OTP.');
        return;
      }

      setOtpRequested(true);
      setMaskedMobile(data.maskedMobile || `+91 ••••••${mobileDigits.slice(-4)}`);
      setSmsPreviewOtp(data.smsPreviewOtp || null);
      setResendSeconds(data.resendCooldownSeconds ?? 30);
      setExpirySeconds(data.expiresInSeconds ?? 300);
      setOtpDigits(['', '', '', '', '', '']);
      window.setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch {
      setOtpError(
        initialMedium === 'hi'
          ? 'सर्वर से OTP प्राप्त नहीं हो सका। पुनः प्रयास करें।'
          : 'Unable to reach OTP service. Please retry.'
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    setOtpError(null);

    if (cleaned.length > 1) {
      // Handle paste or autofill into any slot
      const slice = cleaned.slice(0, 6).split('');
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < 6; i++) {
        next[i] = slice[i] || '';
      }
      setOtpDigits(next);
      const focusIdx = Math.min(5, slice.length);
      otpRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = cleaned;
    setOtpDigits(next);
    if (cleaned && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter' && otpString.length === 6) {
      e.preventDefault();
      handleVerifyOtp();
    }
  };

  const handleVerifyOtp = async (overrideCode?: string) => {
    const codeToVerify = overrideCode ?? otpString;
    if (!/^\d{6}$/.test(codeToVerify)) {
      setOtpError(
        initialMedium === 'hi'
          ? 'कृपया पूरा 6-अंकीय सत्यापन कोड दर्ज करें।'
          : 'Please enter the complete 6-digit OTP.'
      );
      return;
    }

    setOtpError(null);
    setVerifyingOtp(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: `+91${mobileDigits}`,
          otp: codeToVerify,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        verified?: boolean;
        normalizedMobile?: string;
        verificationToken?: string;
      };
      if (!res.ok || !data.verified || !data.verificationToken || !data.normalizedMobile) {
        setOtpError(data.error || 'OTP verification failed.');
        return;
      }

      setVerifiedMobile(data.normalizedMobile);
      setVerificationToken(data.verificationToken);
      setSmsPreviewOtp(null);
      setSubmitError(null);
    } catch {
      setOtpError('Verification request failed. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleFillAndVerifyPreviewOtp = () => {
    if (!smsPreviewOtp) return;
    const chars = smsPreviewOtp.slice(0, 6).split('');
    setOtpDigits([
      chars[0] || '',
      chars[1] || '',
      chars[2] || '',
      chars[3] || '',
      chars[4] || '',
      chars[5] || '',
    ]);
    handleVerifyOtp(smsPreviewOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationToken || !verifiedMobile) {
      setSubmitError(
        initialMedium === 'hi'
          ? '3D गेम वर्ल्ड में प्रवेश करने से पहले मोबाइल नंबर OTP सत्यापन अनिवार्य है।'
          : 'Complete mobile OTP verification first before entering the 3D Sanctuary.'
      );
      return;
    }

    const cleanedName = heroName.trim() || 'Vishal';
    const cleanedPass = passcode.trim() || 'MP2027';
    const cleanedBio =
      bioTitle.trim() ||
      (initialMedium === 'hi'
        ? `कक्षा ${grade}वीं MP बोर्ड विजेता`
        : `Class ${grade}th MP Board Seeker`);

    setSubmitError(null);
    setSubmitting(true);
    try {
      await onEnterAcademy({
        heroName: cleanedName,
        passcode: cleanedPass,
        bioTitle: cleanedBio,
        mobileNumber: verifiedMobile,
        verificationToken,
        grade,
        medium: initialMedium,
        avatarId,
        customAvatarUrl,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to enter academy.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen adventure-bg text-slate-100 relative overflow-hidden flex flex-col justify-between">
      {/* Atmospheric World Backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <SafeImage
          src={WORLD_MAP_BACKDROP}
          alt="Vishal's Quest Academy Citadel"
          className="w-full h-full object-cover opacity-22"
          fallbackTitle="Vishal's Quest Academy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#091326]/90 via-[#091326]/78 to-[#091326]" />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Top Bar: Wordmark + Medium Switch */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/50 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-amber-400 tracking-tight">
                Vishal&apos;s Quest Academy
              </p>
              <p className="text-xs text-slate-400">
                {initialMedium === 'hi'
                  ? 'नई NCERT 3D क्वेस्ट · MP बोर्ड कक्षा 10वीं व 12वीं'
                  : 'New NCERT 3D Quest World · MP Board Class 10th & 12th'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onMediumChange(initialMedium === 'en' ? 'hi' : 'en')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-100 bg-[#162033] border border-slate-700 hover:border-amber-400 rounded-lg transition-colors"
          >
            <Languages className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>{initialMedium === 'en' ? 'हिन्दी माध्यम में बदलें' : 'Switch to English Medium'}</span>
          </button>
        </div>

        {/* Main Split Gate: Left 5 (Live 3D Character Forge + RPG Classes) + Right 7 (Identity & Mandatory OTP Gate) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left: Live 3D Avatar Forge Stage + Custom Picture Upload + Class Cards */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            aria-label="3D Avatar customization"
            className="lg:col-span-5 bg-[#162033]/95 border border-slate-600/80 rounded-2xl p-5 sm:p-6 space-y-5 adventure-card-3d"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-400">
                {initialMedium === 'hi' ? 'चरण 1 · अपना 3D नायक गढ़ें' : 'Step 1 · Forge Your 3D Champion'}
              </p>
              <h1 className="font-display text-2xl font-bold text-white leading-tight [text-wrap:balance]">
                {selectedPreset.name[initialMedium]} — {selectedPreset.title[initialMedium]}
              </h1>
              <p className="text-xs text-slate-400">{selectedPreset.perk[initialMedium]}</p>
            </div>

            {/* Live Interactive 3D Hero Pedestal */}
            <Avatar3DPreview avatarId={avatarId} heroName={heroName || selectedPreset.name[initialMedium]} />

            {/* RPG Class Selector */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">
                {initialMedium === 'hi' ? '3D अवतार वर्ग चुनें:' : 'Select Playable 3D Class:'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {AVATARS.map((av) => {
                  const chosen = avatarId === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatarId(av.id)}
                      className={`p-2.5 rounded-xl border text-left space-y-1.5 transition-colors ${
                        chosen
                          ? 'bg-amber-400/12 border-amber-400'
                          : 'bg-[#0F172A] border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="w-8 h-8 rounded-md overflow-hidden border border-slate-600 shrink-0">
                          <SafeImage
                            src={av.imagePath}
                            alt={av.name[initialMedium]}
                            className="w-full h-full object-cover"
                            fallbackTitle={av.name[initialMedium]}
                          />
                        </div>
                        {chosen && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-white truncate">
                        {av.name[initialMedium]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Portrait Photo Upload for Leaderboard & HUD */}
            <div className="pt-4 border-t border-slate-700/80 flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400 bg-[#0B1220]">
                  <SafeImage
                    src={previewImage}
                    alt={heroName || 'Hero Portrait'}
                    className="w-full h-full object-cover"
                    fallbackTitle={heroName || 'Hero'}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload custom portrait"
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center border-2 border-[#162033]"
                >
                  <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-xs font-bold text-white">
                  {initialMedium === 'hi' ? 'प्रोफ़ाइल चित्र (लीडरबोर्ड हेतु)' : 'Custom Portrait Picture'}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-100 bg-[#0F172A] border border-slate-600 hover:border-amber-400 rounded-lg"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    <span>{initialMedium === 'hi' ? 'फ़ोटो चुनें' : 'Upload Photo'}</span>
                  </button>
                  {customAvatarUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomAvatarUrl(null)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-300 bg-red-950/50 border border-red-800/70 rounded-lg"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                      <span>{initialMedium === 'hi' ? 'हटाएँ' : 'Reset'}</span>
                    </button>
                  )}
                </div>
                {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}
              </div>
            </div>
          </motion.section>

          {/* Right: Hero Account Details & Mandatory Mobile OTP Gate */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            aria-label="Hero identity and mandatory mobile OTP gate"
            className="lg:col-span-7 bg-[#162033]/95 border border-slate-600/80 rounded-2xl p-6 sm:p-7 adventure-card-3d space-y-6"
          >
            {/* Clean Inline Step Tracker */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-700/80">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {initialMedium === 'hi'
                    ? 'अकाउंट व मोबाइल OTP सुरक्षा द्वार'
                    : 'Hero Credentials & Security Gate'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {initialMedium === 'hi'
                    ? 'चरण 1: नाम व कक्षा · चरण 2: मोबाइल OTP सत्यापन · चरण 3: 3D लोक प्रवेश'
                    : '1. Identity & Grade · 2. Mandatory Mobile OTP · 3. Enter 3D World'}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  isOtpVerified ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isOtpVerified ? (
                  <>
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>{initialMedium === 'hi' ? 'OTP सत्यापित' : 'OTP Verified'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    <span>{initialMedium === 'hi' ? 'OTP प्रतीक्षित' : 'Verification Locked'}</span>
                  </>
                )}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Hero Name + Recovery Passcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="login-hero-name" className="block text-xs font-semibold text-slate-300">
                    {initialMedium === 'hi' ? 'नायक का नाम (Hero Name)' : 'Hero Name'}
                  </label>
                  <input
                    id="login-hero-name"
                    type="text"
                    required
                    maxLength={24}
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    placeholder={initialMedium === 'hi' ? 'जैसे: विशाल शर्मा' : 'e.g. Vishal Sharma'}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="login-passcode" className="block text-xs font-semibold text-slate-300">
                    <span className="inline-flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      <span>
                        {initialMedium === 'hi' ? 'गुप्त पासकोड (प्रगति हेतु)' : 'Secret Passcode (Sync XP)'}
                      </span>
                    </span>
                  </label>
                  <input
                    id="login-passcode"
                    type="text"
                    maxLength={24}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="MP2027"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Hero Title + Grade Quest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1.5">
                  <label htmlFor="login-bio" className="block text-xs font-semibold text-slate-300">
                    {initialMedium === 'hi' ? 'नायक उपाधि / लक्ष्य' : 'Hero Title / Motto'}
                  </label>
                  <input
                    id="login-bio"
                    type="text"
                    maxLength={48}
                    value={bioTitle}
                    onChange={(e) => setBioTitle(e.target.value)}
                    placeholder={
                      initialMedium === 'hi' ? 'जैसे: मेरिट मिशन 2027' : 'e.g. Board Merit Challenger'
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold text-slate-300">
                    {initialMedium === 'hi' ? 'कक्षा चुनें' : 'Select Grade Syllabus'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGrade('10')}
                      className={`py-2.5 px-3 text-xs font-bold rounded-lg border transition-colors ${
                        grade === '10'
                          ? 'bg-sky-600 border-sky-400 text-white'
                          : 'bg-[#0B1220] border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {initialMedium === 'hi' ? 'कक्षा 10वीं' : 'Class 10th'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrade('12')}
                      className={`py-2.5 px-3 text-xs font-bold rounded-lg border transition-colors ${
                        grade === '12'
                          ? 'bg-sky-600 border-sky-400 text-white'
                          : 'bg-[#0B1220] border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {initialMedium === 'hi' ? 'कक्षा 12वीं' : 'Class 12th'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mandatory Mobile Number & Secure CSPRNG OTP Verification Module */}
              <div
                className={`p-4 sm:p-5 rounded-xl border space-y-4 transition-colors ${
                  isOtpVerified
                    ? 'bg-emerald-950/25 border-emerald-500/60'
                    : 'bg-[#0B1220]/90 border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Phone
                      className={`w-4 h-4 ${isOtpVerified ? 'text-emerald-400' : 'text-amber-400'}`}
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {initialMedium === 'hi'
                        ? 'अनिवार्य मोबाइल नंबर व सुरक्षित OTP सत्यापन'
                        : 'Mandatory Mobile Number & Secure OTP Verification'}
                    </span>
                  </div>
                  {expirySeconds > 0 && !isOtpVerified && (
                    <span className="text-[11px] font-mono text-amber-300 tabular-nums">
                      {initialMedium === 'hi' ? 'वैधता:' : 'Expires in'}{' '}
                      {formatTimer(expirySeconds)}
                    </span>
                  )}
                </div>

                {/* Phone Input + Send OTP Button */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="flex items-center flex-1 bg-[#121D33] border border-slate-700 focus-within:border-amber-400 rounded-lg overflow-hidden">
                    <span className="px-3 py-2.5 text-xs font-mono font-bold text-amber-400 bg-[#0F172A] border-r border-slate-700 select-none">
                      +91
                    </span>
                    <input
                      id="login-mobile-number"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      value={mobileDigits}
                      onChange={(e) => handleMobileInputChange(e.target.value)}
                      placeholder={
                        initialMedium === 'hi' ? '10-अंकीय मोबाइल नंबर' : '10-digit mobile number'
                      }
                      aria-label="Mobile number"
                      className="flex-1 px-3 py-2.5 text-sm font-mono bg-transparent text-white placeholder:text-slate-500 focus:outline-none tabular-nums"
                    />
                  </div>

                  {!isOtpVerified && (
                    <button
                      type="button"
                      disabled={!isPhoneValid || otpLoading || resendSeconds > 0}
                      onClick={handleRequestOtp}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 whitespace-nowrap transition-colors"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${otpLoading ? 'animate-spin' : ''}`}
                        aria-hidden="true"
                      />
                      <span>
                        {otpLoading
                          ? initialMedium === 'hi'
                            ? 'भेजा जा रहा है...'
                            : 'Generating...'
                          : resendSeconds > 0
                            ? `${initialMedium === 'hi' ? 'पुनः भेजें' : 'Resend'} (${resendSeconds}s)`
                            : otpRequested
                              ? initialMedium === 'hi'
                                ? 'नया OTP भेजें'
                                : 'Resend OTP'
                              : initialMedium === 'hi'
                                ? 'OTP प्राप्त करें'
                                : 'Send Secure OTP'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Verified State Confirmation */}
                {isOtpVerified && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-emerald-300">
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                      <span>
                        {initialMedium === 'hi'
                          ? `${verifiedMobile} सुरक्षित रूप से सत्यापित हो गया। 3D लोक अनलॉक है!`
                          : `${verifiedMobile} verified via secure OTP token. 3D Sanctuary unlocked!`}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMobileInputChange('')}
                      className="text-[11px] font-semibold text-slate-300 underline hover:text-white"
                    >
                      {initialMedium === 'hi' ? 'नंबर बदलें' : 'Change Number'}
                    </button>
                  </div>
                )}

                {/* Active OTP Entry Panel */}
                {otpRequested && !isOtpVerified && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    {/* Sandbox SMS Dispatch Notification Banner */}
                    {smsPreviewOtp && (
                      <div className="p-3 rounded-lg bg-[#162033] border border-sky-500/40 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <MessageSquare
                            className="w-4 h-4 text-sky-400 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <div className="text-xs">
                            <p className="font-semibold text-slate-200">
                              {initialMedium === 'hi'
                                ? `${maskedMobile} पर SMS भेजा गया`
                                : `SMS Dispatched to ${maskedMobile}`}
                            </p>
                            <p className="text-slate-400 mt-0.5">
                              {initialMedium === 'hi' ? 'आपका सुरक्षा कोड:' : 'Your 6-digit OTP:'}{' '}
                              <span className="font-mono font-bold text-amber-300 tracking-wider">
                                {smsPreviewOtp}
                              </span>
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleFillAndVerifyPreviewOtp}
                          className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md whitespace-nowrap"
                        >
                          {initialMedium === 'hi' ? 'कोड भरें व सत्यापित करें' : 'Auto-Fill & Verify'}
                        </button>
                      </div>
                    )}

                    {/* 6-Box Segmented OTP Input + Verify CTA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 sm:gap-2" role="group" aria-label="6-digit OTP code">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              otpRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            aria-label={`OTP digit ${idx + 1}`}
                            className="w-10 h-11 sm:w-11 sm:h-12 text-center font-mono text-lg font-bold bg-[#121D33] border border-slate-600 focus:border-amber-400 rounded-lg text-white focus:outline-none tabular-nums"
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={otpString.length !== 6 || verifyingOtp}
                        onClick={() => handleVerifyOtp()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 whitespace-nowrap transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {verifyingOtp
                            ? initialMedium === 'hi'
                              ? 'सत्यापन जारी...'
                              : 'Verifying...'
                            : initialMedium === 'hi'
                              ? 'OTP सत्यापित करें'
                              : 'Verify OTP'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {otpError && (
                  <p className="text-xs text-red-400 font-medium" role="alert">
                    {otpError}
                  </p>
                )}
              </div>

              {submitError && (
                <p
                  className="text-xs text-red-400 bg-red-950/50 border border-red-800/70 rounded-lg px-3 py-2"
                  role="alert"
                >
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !isOtpVerified}
                className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 text-base font-bold rounded-xl transition-all ${
                  isOtpVerified
                    ? 'text-slate-950 bg-amber-400 hover:bg-amber-300 adventure-btn-gold'
                    : 'text-slate-400 bg-slate-800 border border-slate-700 cursor-not-allowed'
                }`}
              >
                {isOtpVerified ? (
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Lock className="w-4 h-4" aria-hidden="true" />
                )}
                <span>
                  {submitting
                    ? initialMedium === 'hi'
                      ? '3D लोक खुल रहा है...'
                      : 'Entering 3D Sanctuary...'
                    : !isOtpVerified
                      ? initialMedium === 'hi'
                        ? 'प्रवेश हेतु ऊपर मोबाइल OTP सत्यापित करें'
                        : 'Verify Mobile OTP Above to Enter 3D World'
                      : initialMedium === 'hi'
                        ? "Vishal's Quest Academy 3D लोक में प्रवेश करें"
                        : "Enter Vishal's Quest Academy 3D World"}
                </span>
              </button>
            </form>
          </motion.section>
        </div>
      </div>

      <footer className="relative z-10 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Shield className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
        <span>
          {initialMedium === 'hi'
            ? 'आपका सत्यापित मोबाइल नंबर व पासकोड सभी डिवाइस पर आपका XP, बॉस मुहरें और रैंक सुरक्षित रखता है।'
            : 'Your verified mobile number + passcode preserves your XP, Boss Seals, and Leaderboard rank securely.'}
        </span>
      </footer>
    </div>
  );
}
