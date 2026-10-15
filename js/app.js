/**
 * Little Melody - Main Application Controller
 * Manages view routing (Home, Lesson 5-step flow, Outro, Sleep Rest Mode),
 * Mascot states, Audio lifecycle, and LocalStorage updates.
 */

class LittleMelodyApp {
  constructor() {
    this.currentView = 'home'; // 'home' | 'lesson' | 'outro' | 'sleep'
    this.activeLesson = null;
    this.activeStep = 1; // 1 to 5
    this.mascot = null;
    this.minigame = null;
    this.parentZone = null;
    this.hasUnlockedAudio = false;

    this.init();
  }

  init() {
    // Instantiate Dragon mascot in the main container
    this.mascot = new DragonMascot('mascot-mount-point', { size: 190 });

    // Instantiate Parent Zone
    this.parentZone = new ParentZone('modal-mount-point', {
      onClose: () => {},
      onReset: () => this.renderHome(),
      onSleep: () => this.triggerSleepMode(),
    });

    // Setup global listeners
    this.setupHeaderControls();

    // High Five event from mascot in Step 4
    window.addEventListener('mascot:highFiveComplete', () => {
      if (this.currentView === 'lesson' && this.activeStep === 4) {
        setTimeout(() => this.goToLessonStep(5), 1200);
      }
    });

    // Render initial screen
    this.renderHome();

    // Check audio unlock modal
    this.checkAudioUnlock();
  }

  // --- AUDIO UNLOCK OVERLAY ---
  checkAudioUnlock() {
    const modal = document.getElementById('audio-unlock-modal');
    if (!modal) return;

    modal.onclick = () => {
      this.unlockAppAudio();
    };
  }

  unlockAppAudio() {
    if (this.hasUnlockedAudio) return;
    this.hasUnlockedAudio = true;

    if (window.audioEngine) {
      window.audioEngine.unlockAudio();
      window.audioEngine.startBGM();
      window.audioEngine.playPop();
    }

    const modal = document.getElementById('audio-unlock-modal');
    if (modal) {
      modal.classList.add('fade-out');
      setTimeout(() => modal.remove(), 400);
    }

    this.mascot.setMood('happy');
    this.mascot.say("Rồng Con chào bé yêu! Cùng tớ khám phá tiếng Anh nhé!", 3500);
  }

  // --- HEADER CONTROLS ---
  setupHeaderControls() {
    const soundToggle = document.getElementById('global-sound-toggle');
    const parentBtn = document.getElementById('global-parent-btn');
    const backBtn = document.getElementById('global-back-btn');

    if (soundToggle) {
      soundToggle.onclick = () => {
        const isMuted = !window.audioEngine.isMuted;
        window.audioEngine.setMuted(isMuted);
        soundToggle.textContent = isMuted ? '🔇' : '🔊';
        soundToggle.classList.toggle('muted', isMuted);
      };
    }

    if (parentBtn) {
      parentBtn.onclick = () => {
        if (window.audioEngine) window.audioEngine.playPop();
        this.parentZone.openDashboard();
      };
    }

    if (backBtn) {
      backBtn.onclick = () => {
        if (window.audioEngine) window.audioEngine.playPop();
        if (this.currentView === 'lesson') {
          if (confirm("Bé muốn quay lại trang chủ chọn bài khác không?")) {
            this.renderHome();
          }
        } else if (this.currentView === 'sleep') {
          this.renderHome();
        }
      };
    }
  }

  // --- VIEW: HOME SCREEN ---
  renderHome() {
    this.currentView = 'home';
    this.activeLesson = null;
    this.activeStep = 1;

    // Adjust header back button
    const backBtn = document.getElementById('global-back-btn');
    if (backBtn) backBtn.style.visibility = 'hidden';

    // Set mascot state
    this.mascot.setMood('idle');
    this.mascot.say("Bé hãy chạm vào bài học bé thích để cùng chơi nhé!", 3000);

    const screenContainer = document.getElementById('screen-container');
    const lessons = window.LESSONS_DATA || [];

    screenContainer.innerHTML = `
      <div class="home-screen-content">
        <div class="home-hero-badge">
          <span class="hero-sub">✨ Trò chơi âm nhạc cho bé 3-4 tuổi ✨</span>
          <h1 class="hero-title">Little Melody</h1>
        </div>

        <div class="lessons-grid">
          ${lessons.map(lesson => {
            const stars = window.storageManager.getLessonStars(lesson.id);
            const isCompleted = stars > 0;
            const isPriority = lesson.id === 'color-party';

            return `
              <div class="lesson-card ${isPriority ? 'priority-card' : ''}" data-id="${lesson.id}" style="--card-color: ${lesson.themeColor};">
                ${isPriority ? `<div class="card-ribbon">BÀI MẪU ⭐</div>` : ''}
                <div class="card-icon-wrapper" style="background-color: ${lesson.themeColor}22;">
                  <span class="card-icon">${lesson.icon}</span>
                </div>
                <div class="card-text-group">
                  <h3 class="card-title">${lesson.title}</h3>
                  <span class="card-subtitle">${lesson.subtitle}</span>
                </div>
                <div class="card-stars-row">
                  <span class="star ${stars >= 1 ? 'gold' : ''}">★</span>
                  <span class="star ${stars >= 2 ? 'gold' : ''}">★</span>
                  <span class="star ${stars >= 3 ? 'gold' : ''}">★</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Attach card click handlers
    const cards = screenContainer.querySelectorAll('.lesson-card');
    cards.forEach(card => {
      card.onclick = () => {
        const lessonId = card.dataset.id;
        const targetLesson = lessons.find(l => l.id === lessonId);
        if (targetLesson) {
          if (window.audioEngine) window.audioEngine.playPop();
          this.startLesson(targetLesson);
        }
      };
    });
  }

  // --- VIEW: LESSON 5-STEP FLOW ---
  startLesson(lessonData) {
    this.currentView = 'lesson';
    this.activeLesson = lessonData;
    this.activeStep = 1;

    const backBtn = document.getElementById('global-back-btn');
    if (backBtn) backBtn.style.visibility = 'visible';

    this.renderLessonContainer();
    this.goToLessonStep(1);
  }

  renderLessonContainer() {
    const screenContainer = document.getElementById('screen-container');
    screenContainer.innerHTML = `
      <div class="lesson-flow-wrapper" style="--theme-accent: ${this.activeLesson.themeColor};">
        <!-- 5-Step Stepper Bar -->
        <div class="lesson-stepper-bar">
          <div class="step-indicator" data-step="1">
            <span class="step-dot">1</span>
            <span class="step-name">Chào hỏi</span>
          </div>
          <div class="step-line"></div>
          <div class="step-indicator" data-step="2">
            <span class="step-dot">2</span>
            <span class="step-name">Nghe hát</span>
          </div>
          <div class="step-line"></div>
          <div class="step-indicator" data-step="3">
            <span class="step-dot">3</span>
            <span class="step-name">Chơi vui</span>
          </div>
          <div class="step-line"></div>
          <div class="step-indicator" data-step="4">
            <span class="step-dot">4</span>
            <span class="step-name">Vận động</span>
          </div>
          <div class="step-line"></div>
          <div class="step-indicator" data-step="5">
            <span class="step-dot">5</span>
            <span class="step-name">Ôn tập</span>
          </div>
        </div>

        <!-- Dynamic Lesson Step Stage -->
        <div class="lesson-step-stage" id="lesson-step-stage"></div>
      </div>
    `;
  }

  updateStepperUI() {
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach(ind => {
      const s = parseInt(ind.dataset.step, 10);
      ind.classList.toggle('active', s === this.activeStep);
      ind.classList.toggle('completed', s < this.activeStep);
    });
  }

  goToLessonStep(stepNumber) {
    this.activeStep = stepNumber;
    this.updateStepperUI();
    const stage = document.getElementById('lesson-step-stage');
    if (!stage) return;

    if (this.minigame) {
      this.minigame.destroy();
      this.minigame = null;
    }

    switch (stepNumber) {
      case 1:
        this.renderStep1Intro(stage);
        break;
      case 2:
        this.renderStep2Song(stage);
        break;
      case 3:
        this.renderStep3Game(stage);
        break;
      case 4:
        this.renderStep4Movement(stage);
        break;
      case 5:
        this.renderStep5Review(stage);
        break;
    }
  }

  // --- STEP 1: GIỚI THIỆU (INTRO) ---
  renderStep1Intro(stage) {
    this.mascot.setMood('happy');
    this.mascot.say(this.activeLesson.mascotIntroVi, 4500);

    stage.innerHTML = `
      <div class="step-content-card step-intro-card">
        <div class="step-badge">Bước 1: Làm quen cùng Rồng Con</div>
        <h2 class="step-lesson-title">${this.activeLesson.title}</h2>
        <div class="step-topic-icon">${this.activeLesson.icon}</div>
        <p class="intro-dialogue">${this.activeLesson.mascotIntroVi}</p>

        <button class="big-action-button" id="step1-next-btn">
          <span>Bắt đầu nghe nhạc nào! 🎵</span>
        </button>
      </div>
    `;

    const nextBtn = document.getElementById('step1-next-btn');
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (window.audioEngine) window.audioEngine.playPop();
        this.goToLessonStep(2);
      };
    }
  }

  // --- STEP 2: NGHE NHẠC & TỪ VỰNG (LISTEN / SONG) ---
  renderStep2Song(stage) {
    this.mascot.setMood('dancing');
    this.mascot.say("Cùng lắng nghe giai điệu và lặp lại từ vựng theo Rồng Con nhé!", 3500);

    stage.innerHTML = `
      <div class="step-content-card step-song-card">
        <div class="step-badge">Bước 2: Giai điệu âm nhạc</div>
        
        <div class="song-lyrics-banner">
          <span class="music-note-icon">🎶</span>
          <div class="lyrics-text">
            <span class="lyrics-en">"${this.activeLesson.songLyricsEn}"</span>
            <span class="lyrics-vi">${this.activeLesson.songLyricsVi}</span>
          </div>
        </div>

        <div class="vocab-preview-row">
          ${this.activeLesson.vocabulary.map(v => `
            <div class="vocab-preview-item" data-word="${v.word}">
              <div class="v-preview-badge" style="background-color: ${v.colorCode};">${v.icon || '✨'}</div>
              <span class="v-preview-word">${v.word}</span>
              <span class="v-preview-sub">${v.meaningVi}</span>
            </div>
          `).join('')}
        </div>

        <button class="big-action-button" id="step2-next-btn">
          <span>Bé sẵn sàng chơi trò chơi! 🎈</span>
        </button>
      </div>
    `;

    // Interactive pronunciation preview on tap
    const items = stage.querySelectorAll('.vocab-preview-item');
    items.forEach(it => {
      it.onclick = () => {
        const w = it.dataset.word;
        if (window.audioEngine) {
          window.audioEngine.playPop();
          window.audioEngine.speakEnglish(w);
        }
        it.classList.add('pill-bounce');
        setTimeout(() => it.classList.remove('pill-bounce'), 600);
      };
    });

    const nextBtn = document.getElementById('step2-next-btn');
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (window.audioEngine) window.audioEngine.playPop();
        this.goToLessonStep(3);
      };
    }
  }

  // --- STEP 3: CHƠI TƯƠNG TÁC (INTERACTIVE GAME) ---
  renderStep3Game(stage) {
    stage.innerHTML = `
      <div class="step-content-card step-game-card">
        <div class="step-badge">Bước 3: Trò chơi tương tác</div>
        <div id="minigame-container"></div>
      </div>
    `;

    this.minigame = new MinigameEngine(
      'minigame-container',
      this.activeLesson,
      this.mascot,
      () => {
        // Callback when minigame is completely finished!
        this.goToLessonStep(4);
      }
    );
    this.minigame.start();
  }

  // --- STEP 4: VẬN ĐỘNG THỂ CHẤT (KINESTHETIC MOVEMENT) ---
  renderStep4Movement(stage) {
    this.mascot.setMood('highFive');
    this.mascot.say(this.activeLesson.movementPromptVi, 4500);

    stage.innerHTML = `
      <div class="step-content-card step-movement-card">
        <div class="step-badge">Bước 4: Cùng Rồng Con vận động nào!</div>
        
        <div class="movement-instruction-box">
          <div class="movement-icon-dance">🏃‍♂️ 🤸‍♀️ ✨</div>
          <p class="movement-text">${this.activeLesson.movementPromptVi}</p>
        </div>

        <div class="high-five-prompt-banner">
          <span class="high-five-badge">✋ BÉ ĐÃ VẬN ĐỘNG XONG CHƯA?</span>
          <p class="high-five-desc">Hãy đập tay (High-Five) vào bàn tay vàng của Rồng Con trên màn hình để nhận sao nhé!</p>
        </div>

        <button class="big-action-button high-five-trigger-btn" id="high-five-btn">
          <span>✋ Đập tay High-Five cùng Rồng Con!</span>
        </button>
      </div>
    `;

    const highFiveBtn = document.getElementById('high-five-btn');
    if (highFiveBtn) {
      highFiveBtn.onclick = () => {
        this.mascot.triggerHighFiveSuccess();
      };
    }
  }

  // --- STEP 5: ÔN TẬP & HOÀN THÀNH (REVIEW & REWARD) ---
  renderStep5Review(stage) {
    if (window.audioEngine) {
      window.audioEngine.playFanfare();
    }

    // Save lesson progress into LocalStorage
    window.storageManager.recordLessonComplete(
      this.activeLesson.id,
      3, // 3 stars
      this.activeLesson.vocabulary
    );

    this.mascot.setMood('celebrate');
    this.mascot.say(this.activeLesson.reviewEncouragementVi, 4000);

    stage.innerHTML = `
      <div class="step-content-card step-review-card">
        <div class="confetti-burst-canvas" id="confetti-canvas"></div>

        <div class="review-stars-celebration">
          <span class="big-gold-star">⭐</span>
          <span class="big-gold-star">⭐</span>
          <span class="big-gold-star">⭐</span>
        </div>

        <h2 class="review-title">BÉ ĐÃ HOÀN THÀNH XUẤT SẮC!</h2>
        <p class="review-subtitle">Các từ vựng hôm nay bé đã nhớ rất giỏi:</p>

        <div class="review-vocab-grid">
          ${this.activeLesson.vocabulary.map(v => `
            <div class="review-vocab-pill" data-word="${v.word}">
              <span class="rv-icon">${v.icon || '🎈'}</span>
              <span class="rv-word">${v.word}</span>
              <span class="rv-meaning">(${v.meaningVi})</span>
              <span class="rv-speaker">🔊</span>
            </div>
          `).join('')}
        </div>

        <button class="big-action-button" id="review-continue-btn">
          <span>Tiếp tục thôi bé ơi! 🌟</span>
        </button>
      </div>
    `;

    // Audio click for review pills
    const pills = stage.querySelectorAll('.review-vocab-pill');
    pills.forEach(p => {
      p.onclick = () => {
        const w = p.dataset.word;
        if (window.audioEngine) {
          window.audioEngine.playPop();
          window.audioEngine.speakEnglish(w);
        }
      };
    });

    const continueBtn = document.getElementById('review-continue-btn');
    if (continueBtn) {
      continueBtn.onclick = () => {
        if (window.audioEngine) window.audioEngine.playPop();
        this.renderOutroScreen();
      };
    }
  }

  // --- VIEW: LESSON OUTRO ---
  renderOutroScreen() {
    this.currentView = 'outro';
    const screenContainer = document.getElementById('screen-container');

    this.mascot.setMood('happy');
    this.mascot.say("Bé muốn chơi lại bài này, đổi bài khác hay để mắt nghỉ ngơi nào?", 3500);

    screenContainer.innerHTML = `
      <div class="outro-screen-wrapper">
        <div class="outro-hero-card">
          <div class="trophy-icon">🏆</div>
          <h2 class="outro-title">Chúc mừng bé yêu!</h2>
          <p class="outro-sub">Bé đã hoàn thành bài học <strong>${this.activeLesson.title}</strong></p>
        </div>

        <div class="outro-buttons-stack">
          <button class="outro-choice-btn replay-btn" id="outro-replay-btn">
            <span class="btn-emoji">🔁</span>
            <div class="btn-text-block">
              <strong>Chơi lại bài này</strong>
              <span>Khám phá thêm lần nữa</span>
            </div>
          </button>

          <button class="outro-choice-btn home-btn" id="outro-home-btn">
            <span class="btn-emoji">🏠</span>
            <div class="btn-text-block">
              <strong>Đổi bài học khác</strong>
              <span>Chọn chủ đề mới</span>
            </div>
          </button>

          <button class="outro-choice-btn sleep-btn" id="outro-sleep-btn">
            <span class="btn-emoji">🌙</span>
            <div class="btn-text-block">
              <strong>Nghỉ ngơi cho mắt</strong>
              <span>Rồng Con đi ngủ khò</span>
            </div>
          </button>
        </div>
      </div>
    `;

    document.getElementById('outro-replay-btn').onclick = () => {
      if (window.audioEngine) window.audioEngine.playPop();
      this.startLesson(this.activeLesson);
    };

    document.getElementById('outro-home-btn').onclick = () => {
      if (window.audioEngine) window.audioEngine.playPop();
      this.renderHome();
    };

    document.getElementById('outro-sleep-btn').onclick = () => {
      if (window.audioEngine) window.audioEngine.playPop();
      this.triggerSleepMode();
    };
  }

  // --- VIEW: SLEEP / BEDTIME MODE ---
  triggerSleepMode() {
    this.currentView = 'sleep';
    const screenContainer = document.getElementById('screen-container');

    const backBtn = document.getElementById('global-back-btn');
    if (backBtn) backBtn.style.visibility = 'visible';

    this.mascot.setMood('sleeping');
    this.mascot.say("Bé ơi, mắt chúng mình cần nghỉ ngơi rồi. Cùng tớ uống nước nhé!", 4000);

    screenContainer.innerHTML = `
      <div class="sleep-screen-wrapper">
        <div class="sleep-sky-stars">✨ 🌟 🌙 💤</div>
        <h2 class="sleep-title">Giờ nghỉ ngơi của bé</h2>
        <p class="sleep-desc">
          Bé đã học và chơi rất chăm chỉ hôm nay!<br>
          Mắt bé cần được thư giãn. Hãy đứng dậy vươn vai, uống một cốc nước ấm và vui đùa cùng ba mẹ nhé!
        </p>

        <div class="sleep-unicef-note">
          <span>💡 Khuyến nghị UNICEF: Giới hạn thời gian nhìn màn hình giúp giấc ngủ của bé sâu và phát triển thể chất tối ưu.</span>
        </div>

        <button class="big-action-button wakeup-btn" id="sleep-wakeup-btn">
          <span>Đánh thức Rồng Con dậy ☀️</span>
        </button>
      </div>
    `;

    const wakeBtn = document.getElementById('sleep-wakeup-btn');
    if (wakeBtn) {
      wakeBtn.onclick = () => {
        this.mascot.handleMascotTap();
        this.renderHome();
      };
    }
  }
}

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new LittleMelodyApp();
});
