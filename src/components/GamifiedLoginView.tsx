import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  CheckCircle2,
  Crown,
  FlaskConical,
  KeyRound,
  Languages,
  Lock,
  MessageSquare,
  Phone,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { AVATARS } from '../data/questConfig';
import { AvatarId, GradeLevel, Medium } from '../types/quiz';
import { processCustomAvatarFile } from '../utils/imageUpload';
import { SafeImage } from './SafeImage';

export interface LoginPayload {
  heroName: string;
  passcode: string;
  bioTitle: string;
  mobileNumber: string;
  verificationToken: string;
  demoMode: boolean;
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

async function safeParseJson<T>(res: Response): Promise<T | null> {
  try {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
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
  const [heroName, setHeroName] = useState(initialName === 'Player 1' ? '' : initialName);
  const [passcode, setPasscode] = useState(initialPasscode || 'MP2027');
  const [bioTitle, setBioTitle] = useState(initialBioTitle || '');
  const [grade, setGrade] = useState<GradeLevel>(initialGrade);
  const [avatarId, setAvatarId] = useState<AvatarId>(initialAvatarId);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(initialCustomAvatarUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [otpMode, setOtpMode] = useState<'demo' | 'live'>('demo');

  const cleanInitialPhone = initialMobileNumber.replace(/\D/g, '').slice(-10);
  const [mobileDigits, setMobileDigits] = useState(cleanInitialPhone || '9876543210');
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

  const resetOtpFlow = () => {
    setVerifiedMobile(null);
    setVerificationToken(null);
    setOtpRequested(false);
    setSmsPreviewOtp(null);
    setOtpDigits(['', '', '', '', '', '']);
    setResendSeconds(0);
    setExpirySeconds(0);
    setOtpError(null);
  };

  const handleModeSwitch = (nextMode: 'demo' | 'live') => {
    if (nextMode === otpMode) return;
    setOtpMode(nextMode);
    resetOtpFlow();
  };

  const handleMobileInputChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setMobileDigits(digitsOnly);
    if (verifiedMobile || otpRequested || otpError) {
      resetOtpFlow();
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
    const fullPhone = `+91${mobileDigits}`;
    const fallbackMasked = `+91 ••••••${mobileDigits.slice(-4)}`;

    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: fullPhone,
          demoMode: otpMode === 'demo',
        }),
      });
      const data = await safeParseJson<{
        ok?: boolean;
        error?: string;
        maskedMobile?: string;
        expiresInSeconds?: number;
        resendCooldownSeconds?: number;
        smsPreviewOtp?: string;
      }>(res);

      if (!res.ok || !data?.ok) {
        if (otpMode === 'demo') {
          setOtpRequested(true);
          setMaskedMobile(fallbackMasked);
          setSmsPreviewOtp('123456');
          setResendSeconds(5);
          setExpirySeconds(300);
          setOtpDigits(['1', '2', '3', '4', '5', '6']);
          return;
        }
        setOtpError(
          data?.error ||
            (initialMedium === 'hi'
              ? 'लाइव बैकएंड OTP सर्वर उपलब्ध नहीं है। टेस्ट करने के लिए Demo Test Mode चुनें।'
              : 'Live backend OTP server unreachable. Switch to Demo Test Mode to proceed.')
        );
        return;
      }

      setOtpRequested(true);
      setMaskedMobile(data.maskedMobile || fallbackMasked);
      setSmsPreviewOtp(data.smsPreviewOtp || (otpMode === 'demo' ? '123456' : null));
      setResendSeconds(data.resendCooldownSeconds ?? (otpMode === 'demo' ? 5 : 30));
      setExpirySeconds(data.expiresInSeconds ?? 300);
      if (otpMode === 'demo') {
        setOtpDigits(['1', '2', '3', '4', '5', '6']);
      } else {
        setOtpDigits(['', '', '', '', '', '']);
        window.setTimeout(() => otpRefs.current[0]?.focus(), 50);
      }
    } catch {
      if (otpMode === 'demo') {
        setOtpRequested(true);
        setMaskedMobile(fallbackMasked);
        setSmsPreviewOtp('123456');
        setResendSeconds(5);
        setExpirySeconds(300);
        setOtpDigits(['1', '2', '3', '4', '5', '6']);
      } else {
        setOtpError(
          initialMedium === 'hi'
            ? 'लाइव OTP API से संपर्क नहीं हो सका। परीक्षण के लिए ऊपर "Demo Test Mode" चुनें।'
            : 'Unable to reach Live OTP API. Switch to "Demo Test Mode" above to test with 123456.'
        );
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    setOtpError(null);

    if (cleaned.length > 1) {
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
          ? 'कृपया 6 अंकों का OTP दर्ज करें (उदा. 123456)।'
          : 'Please enter any 6-digit OTP (e.g. 123456).'
      );
      return;
    }

    setOtpError(null);
    setVerifyingOtp(true);
    const fullPhone = `+91${mobileDigits}`;

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: fullPhone,
          otp: codeToVerify,
          demoMode: otpMode === 'demo',
        }),
      });
      const data = await safeParseJson<{
        error?: string;
        verified?: boolean;
        normalizedMobile?: string;
        verificationToken?: string;
      }>(res);

      if (!res.ok || !data?.verified || !data.verificationToken || !data.normalizedMobile) {
        if (otpMode === 'demo') {
          setVerifiedMobile(fullPhone);
          setVerificationToken(`demo-token-${Date.now()}`);
          setSmsPreviewOtp(null);
          setSubmitError(null);
          return;
        }
        setOtpError(data?.error || 'OTP verification failed.');
        return;
      }

      setVerifiedMobile(data.normalizedMobile);
      setVerificationToken(data.verificationToken);
      setSmsPreviewOtp(null);
      setSubmitError(null);
    } catch {
      if (otpMode === 'demo') {
        setVerifiedMobile(fullPhone);
        setVerificationToken(`demo-token-${Date.now()}`);
        setSmsPreviewOtp(null);
        setSubmitError(null);
      } else {
        setOtpError('Verification API unreachable. Use Demo Test Mode to continue testing.');
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleQuickDemoVerify = () => {
    if (!isPhoneValid) {
      setMobileDigits('9876543210');
    }
    const demoCode = ['1', '2', '3', '4', '5', '6'];
    setOtpRequested(true);
    setMaskedMobile(`+91 ••••••${(isPhoneValid ? mobileDigits : '9876543210').slice(-4)}`);
    setOtpDigits(demoCode);
    handleVerifyOtp('123456');
  };

  const handleFillAndVerifyPreviewOtp = () => {
    const code = smsPreviewOtp || '123456';
    const chars = code.slice(0, 6).split('');
    setOtpDigits([
      chars[0] || '',
      chars[1] || '',
      chars[2] || '',
      chars[3] || '',
      chars[4] || '',
      chars[5] || '',
    ]);
    handleVerifyOtp(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationToken || !verifiedMobile) {
      setSubmitError(
        initialMedium === 'hi'
          ? 'आगे बढ़ने के लिए ऊपर 6-अंकीय OTP (या 123456) सत्यापित करें।'
          : 'Verify any 6-digit OTP (or 123456 in Demo Mode) above to unlock Quest Gate.'
      );
      return;
    }

    const cleanedName = heroName.trim() || 'Player 1';
    const cleanedPass = passcode.trim() || 'MP2027';
    const cleanedBio =
      bioTitle.trim() ||
      (initialMedium === 'hi'
        ? `कक्षा ${grade}वीं MP बोर्ड चैलेंजर`
        : `Class ${grade}th MP Board Challenger`);

    setSubmitError(null);
    setSubmitting(true);
    try {
      await onEnterAcademy({
        heroName: cleanedName,
        passcode: cleanedPass,
        bioTitle: cleanedBio,
        mobileNumber: verifiedMobile,
        verificationToken,
        demoMode: otpMode === 'demo',
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
    <div className="min-h-screen arcade-bg text-[#181C32] flex flex-col justify-between overflow-x-hidden">
      <div className="max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 space-y-5">
        {/* Top Arcade Brand + Language Toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#FACC15] comic-gloss border-[2.5px] border-[#181C32] shadow-[0_3px_0_#181C32] flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-[#181C32]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl sm:text-2xl font-bold text-[#181C32] leading-tight truncate">
                {initialMedium === 'hi' ? 'बोर्ड क्वेस्ट' : 'बोर्ड क्वेस्ट · Board Quest'}
              </p>
              <p className="text-[11px] font-bold text-[#2563EB] truncate">
                {initialMedium === 'hi'
                  ? 'MP बोर्ड कक्षा 10वीं व 12वीं · 2D आर्केड क्वेस्ट'
                  : 'MP Board Class 10th & 12th · 2D Arcade Quest'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onMediumChange(initialMedium === 'en' ? 'hi' : 'en')}
            className="min-h-[44px] px-3 py-2 text-xs font-bold bg-white hover:bg-[#EFF6FF] text-[#181C32] rounded-xl comic-btn-sm inline-flex items-center gap-1.5 shrink-0"
          >
            <Languages className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
            <span>{initialMedium === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>

        {/* Main Mobile-First 2-Zone Quest Gate (Stacked on phones, 12-col split on lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Player Stats / Hero Card Forge */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            aria-label="Player card customization"
            className="lg:col-span-5 comic-card rounded-3xl overflow-hidden"
          >
            {/* Colorful Comic Banner Header */}
            <div className="bg-[#2563EB] border-b-[2.5px] border-[#181C32] p-4 sm:p-5 text-white relative">
              <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold text-[#FEF08A]">
                <span>{initialMedium === 'hi' ? 'प्लेयर कार्ड · Lv.1' : 'PLAYER PASS · LV.1'}</span>
                <span>{grade === '10' ? 'CLASS 10TH' : 'CLASS 12TH'}</span>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-[3px] border-[#181C32] shadow-[0_4px_0_#181C32] bg-[#FACC15]">
                    <SafeImage
                      src={previewImage}
                      alt={heroName || selectedPreset.name[initialMedium]}
                      className="w-full h-full object-cover"
                      fallbackTitle={heroName || 'Hero'}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload custom photo"
                    className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-[#181C32] border-2 border-[#181C32] shadow-[0_2px_0_#181C32] flex items-center justify-center active:translate-y-[2px]"
                  >
                    <Camera className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <h1 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight truncate">
                    {heroName.trim() || selectedPreset.name[initialMedium]}
                  </h1>
                  <p className="text-xs font-semibold text-[#DBEAFE] truncate">
                    {selectedPreset.title[initialMedium]}
                  </p>
                  <p className="text-[11px] font-medium text-[#FEF08A]">
                    {selectedPreset.perk[initialMedium]}
                  </p>
                </div>
              </div>
            </div>

            {/* Avatar Selector Strip + Custom Photo Button */}
            <div className="p-4 sm:p-5 space-y-4 bg-white">
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {initialMedium === 'hi' ? 'अपना 2D हीरो अवतार चुनें' : 'Choose Your Arcade Hero'}
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {AVATARS.map((av) => {
                    const chosen = avatarId === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setAvatarId(av.id)}
                        className={`min-h-[82px] p-2 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition-transform active:translate-y-[2px] ${
                          chosen
                            ? 'bg-[#FEF08A] border-[#181C32] shadow-[0_3px_0_#181C32]'
                            : 'bg-[#F8FAFF] border-slate-300 hover:border-[#181C32]'
                        }`}
                      >
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-[#181C32]">
                          <SafeImage
                            src={av.imagePath}
                            alt={av.name[initialMedium]}
                            className="w-full h-full object-cover"
                            fallbackTitle={av.name[initialMedium]}
                          />
                          {chosen && (
                            <span className="absolute -top-1 -right-1 bg-[#10B981] text-white rounded-full p-0.5">
                              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-[#181C32] leading-tight line-clamp-1">
                          {av.name[initialMedium].split('·')[0].trim()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-dashed border-slate-200">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] flex-1 px-3 py-2 text-xs font-bold text-[#181C32] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-xl comic-btn-sm inline-flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                  <span>{initialMedium === 'hi' ? 'कस्टम फ़ोटो अपलोड' : 'Upload Custom Photo'}</span>
                </button>
                {customAvatarUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomAvatarUrl(null)}
                    className="min-h-[44px] px-3 py-2 text-xs font-bold text-[#E11D48] bg-[#FFF1F2] rounded-xl comic-btn-sm inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{initialMedium === 'hi' ? 'हटाएँ' : 'Reset'}</span>
                  </button>
                )}
              </div>
              {uploadError && <p className="text-xs font-semibold text-[#E11D48]">{uploadError}</p>}
            </div>
          </motion.section>

          {/* Quest Gate Credentials & Dual-Mode Mobile OTP */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.04 }}
            aria-label="Player account and OTP verification"
            className="lg:col-span-7 comic-card rounded-3xl p-4 sm:p-6 space-y-5 bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-slate-200">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#181C32]">
                  {initialMedium === 'hi'
                    ? 'क्वेस्ट गेट & मोबाइल OTP प्रवेश'
                    : 'Quest Gate & Mobile Verification'}
                </h2>
                <p className="text-xs font-medium text-slate-600">
                  {initialMedium === 'hi'
                    ? '1. नाम व कक्षा चुनें · 2. OTP (123456) सत्यापित करें · 3. खेलें!'
                    : '1. Hero & Class · 2. Verify OTP (123456 Demo) · 3. Start Quest!'}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-xs font-extrabold ${
                  isOtpVerified ? 'text-[#059669]' : 'text-[#D97706]'
                }`}
              >
                {isOtpVerified ? (
                  <>
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>{initialMedium === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    <span>{initialMedium === 'hi' ? 'OTP आवश्यक' : 'OTP Locked'}</span>
                  </>
                )}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Passcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="login-hero-name" className="block text-xs font-bold text-[#181C32]">
                    {initialMedium === 'hi' ? 'खिलाड़ी का नाम (Hero Name)' : 'Hero Name'}
                  </label>
                  <input
                    id="login-hero-name"
                    type="text"
                    required
                    maxLength={24}
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    placeholder={initialMedium === 'hi' ? 'जैसे: आरव शर्मा' : 'e.g. Aarav Sharma'}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm font-semibold rounded-xl comic-input"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="login-passcode" className="block text-xs font-bold text-[#181C32]">
                    <span className="inline-flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-[#D97706]" aria-hidden="true" />
                      <span>{initialMedium === 'hi' ? 'पासकोड (XP सिंक)' : 'Secret Passcode'}</span>
                    </span>
                  </label>
                  <input
                    id="login-passcode"
                    type="text"
                    maxLength={24}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="MP2027"
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono font-bold rounded-xl comic-input"
                  />
                </div>
              </div>

              {/* Bio + Class Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                <div className="space-y-1">
                  <label htmlFor="login-bio" className="block text-xs font-bold text-[#181C32]">
                    {initialMedium === 'hi' ? 'खिलाड़ी उपाधि / लक्ष्य' : 'Title / Board Goal'}
                  </label>
                  <input
                    id="login-bio"
                    type="text"
                    maxLength={48}
                    value={bioTitle}
                    onChange={(e) => setBioTitle(e.target.value)}
                    placeholder={
                      initialMedium === 'hi' ? 'जैसे: मेरिट मिशन 2027' : 'e.g. Board Topper 2027'
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm font-medium rounded-xl comic-input"
                  />
                </div>

                <div className="space-y-1">
                  <span className="block text-xs font-bold text-[#181C32]">
                    {initialMedium === 'hi' ? 'कक्षा चुनें' : 'Select Class'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['10', '12'] as GradeLevel[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrade(g)}
                        className={`min-h-[44px] py-2 px-3 text-xs font-extrabold rounded-xl comic-btn-sm ${
                          grade === g
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-[#F8FAFF] text-[#181C32] hover:bg-[#EFF6FF]'
                        }`}
                      >
                        {initialMedium === 'hi' ? `कक्षा ${g}वीं` : `Class ${g}th`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dual-Mode OTP Module */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border-2 space-y-3.5 ${
                  isOtpVerified
                    ? 'bg-[#ECFDF5] border-[#059669]'
                    : 'bg-[#F8FAFF] border-[#181C32]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Phone
                      className={`w-4 h-4 ${isOtpVerified ? 'text-[#059669]' : 'text-[#2563EB]'}`}
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm font-extrabold text-[#181C32]">
                      {initialMedium === 'hi' ? 'मोबाइल OTP सत्यापन' : 'Mobile OTP Check'}
                    </span>
                  </div>

                  {/* Demo Test Mode vs Live API Mode */}
                  <div
                    role="group"
                    aria-label="OTP verification mode"
                    className="inline-flex p-0.5 rounded-xl bg-white border-2 border-[#181C32]"
                  >
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('demo')}
                      className={`min-h-[34px] inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold rounded-lg ${
                        otpMode === 'demo' ? 'bg-[#FACC15] text-[#181C32]' : 'text-slate-600'
                      }`}
                    >
                      <FlaskConical className="w-3 h-3" aria-hidden="true" />
                      <span>{initialMedium === 'hi' ? 'डेमो मोड' : 'Demo Mode'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('live')}
                      className={`min-h-[34px] inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold rounded-lg ${
                        otpMode === 'live' ? 'bg-[#38BDF8] text-[#181C32]' : 'text-slate-600'
                      }`}
                    >
                      <Server className="w-3 h-3" aria-hidden="true" />
                      <span>{initialMedium === 'hi' ? 'लाइव API' : 'Live API'}</span>
                    </button>
                  </div>
                </div>

                {!isOtpVerified && (
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl px-3 py-2">
                    <span>
                      {otpMode === 'demo'
                        ? initialMedium === 'hi'
                          ? 'डेमो मोड: 123456 या कोई भी 6 अंक डालें और तुरंत खेलें!'
                          : 'Demo Test Mode: Enter 123456 or any 6 digits to jump straight in.'
                        : initialMedium === 'hi'
                          ? 'लाइव API: एक्सप्रेस सर्वर से OTP भेजा व जाँचा जाएगा।'
                          : 'Live Backend API: Generates & verifies SHA-256 OTP on server.'}
                    </span>
                    {expirySeconds > 0 && (
                      <span className="font-mono font-bold text-[#D97706] tabular-nums shrink-0">
                        {formatTimer(expirySeconds)}
                      </span>
                    )}
                  </div>
                )}

                {/* Phone Input + Send / Quick Demo */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center flex-1 bg-white border-2 border-[#181C32] rounded-xl overflow-hidden min-h-[46px]">
                    <span className="px-3 py-2.5 text-xs font-mono font-extrabold text-[#181C32] bg-[#FACC15] border-r-2 border-[#181C32] select-none">
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
                      className="flex-1 min-w-0 px-3 py-2 text-sm font-mono font-bold bg-transparent text-[#181C32] placeholder:text-slate-400 focus:outline-none tabular-nums"
                    />
                  </div>

                  {!isOtpVerified && (
                    <div className="grid grid-cols-2 sm:flex items-center gap-2">
                      <button
                        type="button"
                        disabled={!isPhoneValid || otpLoading || resendSeconds > 0}
                        onClick={handleRequestOtp}
                        className="min-h-[46px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl bg-[#38BDF8] hover:bg-[#7DD3FC] disabled:opacity-50 text-[#181C32] comic-btn-sm whitespace-nowrap"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${otpLoading ? 'animate-spin' : ''}`}
                          aria-hidden="true"
                        />
                        <span>
                          {otpLoading
                            ? initialMedium === 'hi'
                              ? 'भेज रहे...'
                              : 'Sending...'
                            : resendSeconds > 0
                              ? `${resendSeconds}s`
                              : otpRequested
                                ? initialMedium === 'hi'
                                  ? 'पुनः भेजें'
                                  : 'Resend'
                                : initialMedium === 'hi'
                                  ? 'OTP भेजें'
                                  : 'Send OTP'}
                        </span>
                      </button>

                      {otpMode === 'demo' && !otpRequested && (
                        <button
                          type="button"
                          onClick={handleQuickDemoVerify}
                          className="min-h-[46px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-[#181C32] comic-btn-sm whitespace-nowrap"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{initialMedium === 'hi' ? 'डेमो (123456)' : 'Quick 123456'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isOtpVerified && (
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#065F46] font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#059669]" aria-hidden="true" />
                      <span>
                        {initialMedium === 'hi'
                          ? `${verifiedMobile} सत्यापित! प्रवेश द्वार खुला है।`
                          : `${verifiedMobile} verified! Quest Gate unlocked.`}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMobileInputChange('')}
                      className="text-xs underline text-[#181C32]"
                    >
                      {initialMedium === 'hi' ? 'बदलें' : 'Change'}
                    </button>
                  </div>
                )}

                {(otpRequested || otpMode === 'demo') && !isOtpVerified && (
                  <div className="space-y-3 pt-2 border-t-2 border-dashed border-slate-300">
                    {smsPreviewOtp && (
                      <div className="p-2.5 rounded-xl bg-[#EFF6FF] border-2 border-[#2563EB] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs min-w-0">
                          <MessageSquare className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
                          <span className="font-bold text-[#181C32] truncate">
                            {maskedMobile || '+91 ••••••••••'} · OTP:{' '}
                            <span className="font-mono text-[#D97706]">{smsPreviewOtp}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleFillAndVerifyPreviewOtp}
                          className="min-h-[36px] px-3 py-1 text-xs font-extrabold bg-[#FACC15] text-[#181C32] rounded-lg border-2 border-[#181C32] whitespace-nowrap"
                        >
                          {initialMedium === 'hi' ? '123456 सत्यापित करें' : 'Verify 123456'}
                        </button>
                      </div>
                    )}

                    {/* Mobile-safe 6-slot keypad OTP grid */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div
                        className="grid grid-cols-6 gap-1.5 w-full sm:max-w-[290px]"
                        role="group"
                        aria-label="6-digit OTP code"
                      >
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              otpRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder={otpMode === 'demo' ? String(idx + 1) : '•'}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            aria-label={`OTP digit ${idx + 1}`}
                            className="w-full h-12 text-center font-mono text-lg font-extrabold rounded-xl comic-input tabular-nums"
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={otpString.length !== 6 || verifyingOtp}
                        onClick={() => handleVerifyOtp()}
                        className="min-h-[46px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl bg-[#34D399] hover:bg-[#10B981] disabled:opacity-50 text-[#181C32] comic-btn-sm whitespace-nowrap"
                      >
                        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {verifyingOtp
                            ? initialMedium === 'hi'
                              ? 'जाँच जारी...'
                              : 'Checking...'
                            : initialMedium === 'hi'
                              ? 'OTP सत्यापित करें'
                              : 'Verify OTP'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {otpError && (
                  <p className="text-xs font-bold text-[#E11D48]" role="alert">
                    {otpError}
                  </p>
                )}
              </div>

              {submitError && (
                <p
                  className="text-xs font-bold text-[#E11D48] bg-[#FFF1F2] border-2 border-[#E11D48] rounded-xl px-3 py-2"
                  role="alert"
                >
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !isOtpVerified}
                className={`w-full min-h-[54px] inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-extrabold rounded-2xl ${
                  isOtpVerified
                    ? 'text-[#181C32] bg-[#FACC15] hover:bg-[#FDE047] comic-btn'
                    : 'text-slate-500 bg-slate-200 border-2 border-slate-400 cursor-not-allowed'
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
                      ? 'क्वेस्ट हब खुल रहा है...'
                      : 'Launching Arcade Hub...'
                    : !isOtpVerified
                      ? initialMedium === 'hi'
                        ? 'प्रवेश हेतु ऊपर 123456 या कोई भी 6-अंकीय OTP सत्यापित करें'
                        : 'Verify 123456 or 6-Digit OTP Above'
                      : initialMedium === 'hi'
                        ? 'बोर्ड क्वेस्ट खेलें!'
                        : 'PLAY BOARD QUEST!'}
                </span>
              </button>
            </form>
          </motion.section>
        </div>
      </div>

      <footer className="border-t-2 border-[#181C32] bg-white py-3.5 px-4 text-center text-xs font-semibold text-slate-600 flex items-center justify-center gap-2">
        <Shield className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
        <span>
          {initialMedium === 'hi'
            ? 'डेमो मोड (123456) व लाइव OTP API · MP बोर्ड NCERT 10वीं व 12वीं'
            : 'Demo Mode (123456) & Live OTP API · MP Board NCERT Class 10th & 12th'}
        </span>
      </footer>
    </div>
  );
}
