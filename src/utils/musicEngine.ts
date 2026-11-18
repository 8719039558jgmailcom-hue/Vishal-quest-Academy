// Continuous, 100% copyright-safe, royalty-free procedural Web Audio adventure soundtrack

export type MusicMood = 'explore' | 'battle' | 'leaderboard';

class AdventureMusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private isMuted = false;
  private mood: MusicMood = 'explore';
  private timerId: number | null = null;
  private step = 0;

  // D Dorian / Medieval Fantasy chord progression (frequencies in Hz)
  private readonly chords: Array<{ bass: number; pad: number[]; arp: number[] }> = [
    // Dm9
    { bass: 73.42, pad: [146.83, 220.0, 261.63, 329.63], arp: [293.66, 349.23, 440.0, 523.25, 440.0, 349.23] },
    // Cmaj7
    { bass: 65.41, pad: [130.81, 196.0, 246.94, 329.63], arp: [261.63, 329.63, 392.0, 493.88, 392.0, 329.63] },
    // Bbmaj7 -> F/A feel
    { bass: 58.27, pad: [116.54, 174.61, 220.0, 293.66], arp: [233.08, 293.66, 349.23, 440.0, 349.23, 293.66] },
    // Am7 / G6 heroic turnaround
    { bass: 55.0, pad: [110.0, 164.81, 220.0, 293.66], arp: [220.0, 293.66, 329.63, 440.0, 392.0, 329.63] },
  ];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.14;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.14, now, 0.08);
    }
  }

  public setMood(mood: MusicMood): void {
    this.mood = mood;
  }

  public start(): void {
    if (this.isPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.isPlaying = true;
    this.scheduleNextTick();
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNextTick(): void {
    if (!this.isPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    if (!this.isMuted && ctx.state === 'running') {
      this.triggerStep(ctx, this.masterGain);
    }

    const stepMs = this.mood === 'battle' ? 320 : this.mood === 'leaderboard' ? 400 : 480;
    this.step = (this.step + 1) % 24;
    this.timerId = window.setTimeout(() => this.scheduleNextTick(), stepMs);
  }

  private triggerStep(ctx: AudioContext, dest: AudioNode): void {
    try {
      const now = ctx.currentTime;
      const chordIdx = Math.floor(this.step / 6) % this.chords.length;
      const subStep = this.step % 6;
      const chord = this.chords[chordIdx];

      // 1. Warm atmospheric string/horn pad on chord root change
      if (subStep === 0) {
        const dur = this.mood === 'battle' ? 1.85 : 2.75;
        chord.pad.slice(0, 3).forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = idx === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc.detune.setValueAtTime((idx - 1) * 4, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(this.mood === 'battle' ? 880 : 620, now);

          const peak = this.mood === 'leaderboard' ? 0.095 : 0.075;
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(peak, now + 0.35);
          gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(dest);
          osc.start(now);
          osc.stop(now + dur + 0.05);
        });

        // Deep orchestral bass anchor
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(chord.bass, now);
        bassGain.gain.setValueAtTime(0.0001, now);
        bassGain.gain.linearRampToValueAtTime(0.14, now + 0.14);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        bassOsc.connect(bassGain);
        bassGain.connect(dest);
        bassOsc.start(now);
        bassOsc.stop(now + dur + 0.05);
      }

      // 2. Gentle medieval harp/lute arpeggio shimmer
      const arpFreq = chord.arp[subStep % chord.arp.length];
      if (arpFreq) {
        const harp = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        harp.type = this.mood === 'battle' ? 'triangle' : 'sine';
        harp.frequency.setValueAtTime(arpFreq, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(this.mood === 'battle' ? 1600 : 1200, now);

        const amp = this.mood === 'explore' ? 0.055 : 0.07;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(amp, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.52);

        harp.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        harp.start(now);
        harp.stop(now + 0.56);
      }

      // 3. Battle tactical low drum pulse on beats 0, 2, 4
      if (this.mood === 'battle' && subStep % 2 === 0) {
        const drum = ctx.createOscillator();
        const drumGain = ctx.createGain();
        drum.type = 'sine';
        drum.frequency.setValueAtTime(subStep === 0 ? 115 : 88, now);
        drum.frequency.exponentialRampToValueAtTime(42, now + 0.14);
        drumGain.gain.setValueAtTime(subStep === 0 ? 0.15 : 0.09, now);
        drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        drum.connect(drumGain);
        drumGain.connect(dest);
        drum.start(now);
        drum.stop(now + 0.2);
      }
    } catch {
      // Ignore Web Audio restriction errors before interaction
    }
  }
}

export const musicEngine = new AdventureMusicEngine();
