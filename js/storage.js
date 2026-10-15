/**
 * Little Melody - Storage Manager
 * Encapsulates LocalStorage for lesson completion, vocabulary bank,
 * parental settings, and screen time duration.
 */

class StorageManager {
  constructor() {
    this.STORAGE_KEY_PROGRESS = 'little_melody_progress_v1';
    this.STORAGE_KEY_SETTINGS = 'little_melody_settings_v1';
    this.STORAGE_KEY_TIME = 'little_melody_time_v1';

    this.progress = this.loadProgress();
    this.settings = this.loadSettings();
    this.timeStats = this.loadTimeStats();
  }

  loadProgress() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_PROGRESS);
      return data ? JSON.parse(data) : {
        completedLessons: {}, // lessonId -> { count: number, stars: number, lastPlayed: string }
        learnedVocab: {},     // word -> { word, meaningVi, topic, firstEncountered: string }
        totalStars: 0,
      };
    } catch (e) {
      console.warn('LocalStorage load error, using default progress:', e);
      return { completedLessons: {}, learnedVocab: {}, totalStars: 0 };
    }
  }

  saveProgress() {
    try {
      localStorage.setItem(this.STORAGE_KEY_PROGRESS, JSON.stringify(this.progress));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  loadSettings() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_SETTINGS);
      return data ? JSON.parse(data) : {
        isMuted: false,
        bgmVolume: 0.35,
        voiceVolume: 0.8,
        screenTimeLimitMinutes: 15, // Default 15 minutes per UNICEF recommendations
      };
    } catch (e) {
      return { isMuted: false, bgmVolume: 0.35, voiceVolume: 0.8, screenTimeLimitMinutes: 15 };
    }
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('LocalStorage save settings error:', e);
    }
  }

  loadTimeStats() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const data = localStorage.getItem(this.STORAGE_KEY_TIME);
      const parsed = data ? JSON.parse(data) : {};

      if (!parsed[today]) {
        parsed[today] = { totalSeconds: 0 };
      }
      return parsed;
    } catch (e) {
      return {};
    }
  }

  saveTimeStats() {
    try {
      localStorage.setItem(this.STORAGE_KEY_TIME, JSON.stringify(this.timeStats));
    } catch (e) {
      console.warn('LocalStorage time stats error:', e);
    }
  }

  addPlayTime(seconds) {
    const today = new Date().toISOString().slice(0, 10);
    if (!this.timeStats[today]) {
      this.timeStats[today] = { totalSeconds: 0 };
    }
    this.timeStats[today].totalSeconds += seconds;
    this.saveTimeStats();
  }

  getTodayPlayMinutes() {
    const today = new Date().toISOString().slice(0, 10);
    const sec = (this.timeStats[today] && this.timeStats[today].totalSeconds) || 0;
    return Math.floor(sec / 60);
  }

  recordLessonComplete(lessonId, starsEarned, vocabList = []) {
    if (!this.progress.completedLessons[lessonId]) {
      this.progress.completedLessons[lessonId] = { count: 0, stars: 0, lastPlayed: null };
    }

    this.progress.completedLessons[lessonId].count += 1;
    this.progress.completedLessons[lessonId].stars = Math.max(
      this.progress.completedLessons[lessonId].stars,
      starsEarned
    );
    this.progress.completedLessons[lessonId].lastPlayed = new Date().toISOString();
    this.progress.totalStars += starsEarned;

    // Record vocabulary
    vocabList.forEach(item => {
      if (!this.progress.learnedVocab[item.word]) {
        this.progress.learnedVocab[item.word] = {
          word: item.word,
          meaningVi: item.meaningVi,
          topic: lessonId,
          firstEncountered: new Date().toISOString(),
        };
      }
    });

    this.saveProgress();
  }

  getLessonStars(lessonId) {
    return (this.progress.completedLessons[lessonId] && this.progress.completedLessons[lessonId].stars) || 0;
  }

  getCompletedLessonsCount() {
    return Object.keys(this.progress.completedLessons).length;
  }

  getAllLearnedVocab() {
    return Object.values(this.progress.learnedVocab);
  }

  resetAllData() {
    this.progress = { completedLessons: {}, learnedVocab: {}, totalStars: 0 };
    const today = new Date().toISOString().slice(0, 10);
    this.timeStats = { [today]: { totalSeconds: 0 } };
    this.saveProgress();
    this.saveTimeStats();
  }
}

window.storageManager = new StorageManager();
