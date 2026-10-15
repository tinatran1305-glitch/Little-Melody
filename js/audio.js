/**
 * Little Melody - Audio Engine
 * Combines Web Audio API (procedural SFX & BGM) and Web Speech API (bilingual VN & EN).
 * Zero external audio file dependencies required - 100% resilient and self-contained!
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.isBgmPlaying = false;
    this.isMuted = false;
    this.bgmVolume = 0.35;
    this.sfxVolume = 0.8;
    this.bgmInterval = null;
    this.voicesLoaded = false;
    this.availableVoices = [];

    // Initialize Web Speech voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.availableVoices = window.speechSynthesis.getVoices();
        this.voicesLoaded = true;
      };
      this.availableVoices = window.speechSynthesis.getVoices();
    }
  }

  // Must be called from user gesture (first tap) to unlock Web Audio on mobile/Chrome/Safari
  unlockAudio() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master BGM gain node
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      // Master SFX gain node
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : this.bgmVolume, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(muted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  setBgmVolume(val) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmGain && this.ctx && !this.isMuted) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.ctx && !this.isMuted) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  // --- PROCEDURAL SOUND EFFECTS (Web Audio API Synthesizer) ---

  // Cute bubble / balloon pop sound
  playPop() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('SFX pop error:', e);
    }
  }

  // Pleasant bell chime for correct choice or star
  playChime(pitchMultiplier = 1) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Fundamental + harmonic chime (marimba/celesta feel)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * pitchMultiplier, now + idx * 0.04);

        gain.gain.setValueAtTime(0.25, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.65);
      });
    } catch (e) {
      console.warn('SFX chime error:', e);
    }
  }

  // Gentle, friendly wobble for incorrect choice (no harsh buzzer!)
  playGentleBoing() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      console.warn('SFX boing error:', e);
    }
  }

  // High-five clap & sparkling victory sound
  playHighFive() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      
      // Clap burst
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.1);

      // Cheerful chime after clap
      setTimeout(() => this.playChime(1.2), 80);
    } catch (e) {
      console.warn('SFX highFive error:', e);
    }
  }

  // Multi-note victory fanfare for lesson completion
  playFanfare() {
    if (this.isMuted || !this.ctx) return;
    // C5 - E5 - G5 - C6 joyful progression
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.55);
      }, i * 140);
    });
  }

  // Sound for counting 1 to 5
  playCountNote(number) {
    if (this.isMuted || !this.ctx) return;
    const baseFreqs = [392.0, 440.0, 493.88, 523.25, 587.33]; // G4, A4, B4, C5, D5
    const freq = baseFreqs[Math.min(number - 1, 4)] || 440;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('SFX count error:', e);
    }
  }

  // --- PROCEDURAL NURSERY BACKGROUND MUSIC (BGM) ---
  startBGM() {
    if (this.isBgmPlaying || !this.ctx) return;
    this.isBgmPlaying = true;

    // Upbeat gentle pentatonic melody loop: C - D - E - G - A - G - E - C
    const melody = [
      { note: 523.25, dur: 0.28 }, // C5
      { note: 587.33, dur: 0.28 }, // D5
      { note: 659.25, dur: 0.38 }, // E5
      { note: 783.99, dur: 0.45 }, // G5
      { note: 880.00, dur: 0.28 }, // A5
      { note: 783.99, dur: 0.28 }, // G5
      { note: 659.25, dur: 0.38 }, // E5
      { note: 523.25, dur: 0.50 }, // C5
      { note: 659.25, dur: 0.28 }, // E5
      { note: 783.99, dur: 0.28 }, // G5
      { note: 523.25, dur: 0.60 }, // C5
    ];

    let noteIdx = 0;
    const stepMusic = () => {
      if (!this.isBgmPlaying || !this.ctx || this.isMuted) return;

      const current = melody[noteIdx % melody.length];
      noteIdx++;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(current.note, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur * 1.4);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + current.dur * 1.5);
      } catch (e) {
        // silent catch
      }

      const nextDelay = current.dur * 1000 + 120;
      this.bgmInterval = setTimeout(stepMusic, nextDelay);
    };

    stepMusic();
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // --- BILINGUAL SPEECH SYNTHESIS (Web Speech API) ---

  // Mascot Little Dragon speaks friendly Vietnamese
  speakVietnamese(text, onEndCallback = null) {
    if (this.isMuted || !('speechSynthesis' in window)) {
      if (onEndCallback) setTimeout(onEndCallback, 1500);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.pitch = 1.35; // Cheerful toddler-friendly higher pitch
      utterance.rate = 0.95;  // Slightly relaxed tempo for 3-4yo comprehension

      // Look for a Vietnamese voice if available
      const viVoice = this.availableVoices.find(v => v.lang.startsWith('vi'));
      if (viVoice) utterance.voice = viVoice;

      if (onEndCallback) {
        utterance.onend = () => onEndCallback();
        utterance.onerror = () => onEndCallback();
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error (vi):', e);
      if (onEndCallback) setTimeout(onEndCallback, 1500);
    }
  }

  // Native English pronunciation for vocabulary words
  speakEnglish(word, onEndCallback = null) {
    if (this.isMuted || !('speechSynthesis' in window)) {
      if (onEndCallback) setTimeout(onEndCallback, 1200);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.pitch = 1.25; // Warm, friendly
      utterance.rate = 0.85;  // Slower clear articulation for toddlers

      const enVoice = this.availableVoices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;

      if (onEndCallback) {
        utterance.onend = () => onEndCallback();
        utterance.onerror = () => onEndCallback();
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error (en):', e);
      if (onEndCallback) setTimeout(onEndCallback, 1200);
    }
  }

  stopAllSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// Global singleton instance
window.audioEngine = new AudioEngine();
