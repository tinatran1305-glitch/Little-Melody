/**
 * Little Melody - Parent Zone & Parental Gate (UNICEF Standards)
 * Protects settings with a child-safe gate, provides clear screen time insights,
 * vocabulary inventory, timer limiter, and practical UNICEF co-parenting advice.
 */

class ParentZone {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.storage = window.storageManager;
    this.audio = window.audioEngine;
    this.onCloseCallback = options.onClose || null;
    this.onResetCallback = options.onReset || null;
    this.onSleepTriggered = options.onSleep || null;

    this.gateHoldTimer = null;
    this.gateHoldProgress = 0;
    this.screenTimerInterval = null;

    this.initScreenTimer();
  }

  // --- PARENTAL GATE ---
  showGate(onSuccess) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="parental-gate-card">
          <div class="gate-icon">🔒</div>
          <h2 class="gate-title">Khu vực dành cho Phụ huynh</h2>
          <p class="gate-sub">Để bảo vệ bé, xin mời ba mẹ giữ ngón tay vào nút bên dưới trong 3 giây:</p>

          <div class="gate-hold-button-wrapper">
            <svg class="gate-progress-ring" width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" class="ring-bg"></circle>
              <circle cx="60" cy="60" r="52" class="ring-fg" id="gate-ring-fg"></circle>
            </svg>
            <button class="gate-hold-button" id="gate-hold-btn">
              <span class="btn-lock-icon">⏱️</span>
              <span class="btn-lock-text">Giữ 3s</span>
            </button>
          </div>

          <div class="gate-math-alternative">
            <span class="alt-label">Hoặc giải câu đố: <strong>3 + 2 = ?</strong></span>
            <div class="math-options">
              <button class="math-btn" data-ans="4">4</button>
              <button class="math-btn" data-ans="5">5</button>
              <button class="math-btn" data-ans="6">6</button>
            </div>
          </div>

          <button class="gate-close-btn" id="gate-close-btn">Quay lại trò chơi</button>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('gate-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => this.hide();
    }

    // Math options
    const mathBtns = this.container.querySelectorAll('.math-btn');
    mathBtns.forEach(btn => {
      btn.onclick = () => {
        if (btn.dataset.ans === '5') {
          if (this.audio) this.audio.playChime(1.2);
          onSuccess();
        } else {
          if (this.audio) this.audio.playGentleBoing();
          btn.classList.add('btn-shake');
          setTimeout(() => btn.classList.remove('btn-shake'), 400);
        }
      };
    });

    // Hold button logic
    const holdBtn = document.getElementById('gate-hold-btn');
    const ringFg = document.getElementById('gate-ring-fg');
    const circumference = 2 * Math.PI * 52;
    ringFg.style.strokeDasharray = `${circumference} ${circumference}`;
    ringFg.style.strokeDashoffset = circumference;

    const startHolding = (e) => {
      e.preventDefault();
      this.gateHoldProgress = 0;
      const startTime = Date.now();
      const duration = 3000;

      this.gateHoldTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        const offset = circumference - (progress * circumference);
        ringFg.style.strokeDashoffset = offset;

        if (progress >= 1) {
          clearInterval(this.gateHoldTimer);
          if (this.audio) this.audio.playChime(1.2);
          onSuccess();
        }
      }, 50);
    };

    const stopHolding = () => {
      if (this.gateHoldTimer) {
        clearInterval(this.gateHoldTimer);
        ringFg.style.strokeDashoffset = circumference;
      }
    };

    holdBtn.addEventListener('mousedown', startHolding);
    holdBtn.addEventListener('mouseup', stopHolding);
    holdBtn.addEventListener('mouseleave', stopHolding);
    holdBtn.addEventListener('touchstart', startHolding, { passive: false });
    holdBtn.addEventListener('touchend', stopHolding);
  }

  // --- PARENT DASHBOARD ---
  openDashboard() {
    this.showGate(() => {
      this.renderDashboard();
    });
  }

  renderDashboard() {
    if (!this.container) return;

    const stats = this.storage.loadProgress();
    const settings = this.storage.loadSettings();
    const playedMinutes = this.storage.getTodayPlayMinutes();
    const vocabList = this.storage.getAllLearnedVocab();
    const completedCount = this.storage.getCompletedLessonsCount();

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="parent-dashboard-card">
          <div class="dashboard-header">
            <div class="header-left">
              <span class="dashboard-badge">Góc Phụ Huynh</span>
              <h2 class="dashboard-title">Đồng hành cùng bé</h2>
            </div>
            <button class="close-x-btn" id="dash-close-btn">✕</button>
          </div>

          <div class="dashboard-scrollable-content">
            <!-- Metric Cards -->
            <div class="dashboard-stats-grid">
              <div class="stat-card">
                <span class="stat-icon">⏱️</span>
                <span class="stat-value">${playedMinutes} phút</span>
                <span class="stat-desc">Thời gian chơi hôm nay</span>
              </div>
              <div class="stat-card">
                <span class="stat-icon">🎓</span>
                <span class="stat-value">${completedCount} / 6</span>
                <span class="stat-desc">Chủ đề bé đã hoàn thành</span>
              </div>
              <div class="stat-card">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">${stats.totalStars || 0}</span>
                <span class="stat-desc">Ngôi sao khen thưởng</span>
              </div>
              <div class="stat-card">
                <span class="stat-icon">💡</span>
                <span class="stat-value">${vocabList.length}</span>
                <span class="stat-desc">Từ vựng bé đã gặp</span>
              </div>
            </div>

            <!-- Important UNICEF Philosophy Banner -->
            <div class="unicef-philosophy-banner">
              <span class="unicef-icon">💙</span>
              <div class="unicef-text">
                <strong>Khuyến nghị từ UNICEF Parenting:</strong>
                <p>Chỉ số trên nhằm ghi nhận sự tiếp xúc ngôn ngữ tích cực của bé, <em>không dùng để đánh giá mức độ giỏi/dở</em>. Trẻ 3–4 tuổi học tốt nhất khi có sự đồng hành vui vẻ của cha mẹ!</p>
              </div>
            </div>

            <!-- Vocabulary Bank -->
            <div class="dash-section">
              <h3 class="section-title">Danh mục từ vựng bé đã làm quen (${vocabList.length} từ)</h3>
              ${vocabList.length === 0 ? `
                <p class="empty-hint">Bé chưa bắt đầu bài học nào. Hãy cùng bé chơi chủ đề đầu tiên nhé!</p>
              ` : `
                <div class="vocab-pill-grid">
                  ${vocabList.map(item => `
                    <div class="vocab-pill-card" data-word="${item.word}">
                      <div class="v-word">${item.word}</div>
                      <div class="v-meaning">${item.meaningVi}</div>
                      <button class="v-audio-btn" title="Nghe phát âm">🔊</button>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- Screen Time & Settings -->
            <div class="dash-section">
              <h3 class="section-title">Cài đặt an toàn & Hẹn giờ nghỉ</h3>
              
              <div class="settings-row">
                <label class="setting-label">
                  <span>Giới hạn thời gian màn hình:</span>
                  <small class="setting-sub">Rồng Con sẽ nhắc bé nghỉ ngơi khi hết giờ</small>
                </label>
                <select class="custom-select" id="timer-limit-select">
                  <option value="10" ${settings.screenTimeLimitMinutes === 10 ? 'selected' : ''}>10 phút</option>
                  <option value="15" ${settings.screenTimeLimitMinutes === 15 ? 'selected' : ''}>15 phút (Khuyến nghị)</option>
                  <option value="20" ${settings.screenTimeLimitMinutes === 20 ? 'selected' : ''}>20 phút</option>
                  <option value="0" ${settings.screenTimeLimitMinutes === 0 ? 'selected' : ''}>Không giới hạn</option>
                </select>
              </div>

              <div class="settings-row">
                <label class="setting-label">
                  <span>Âm lượng nhạc nền:</span>
                </label>
                <input type="range" min="0" max="1" step="0.05" value="${settings.bgmVolume}" id="bgm-volume-slider" class="volume-slider">
              </div>

              <div class="settings-row">
                <label class="setting-label">
                  <span>Âm lượng giọng đọc Rồng Con:</span>
                </label>
                <input type="range" min="0" max="1" step="0.05" value="${settings.voiceVolume}" id="sfx-volume-slider" class="volume-slider">
              </div>
            </div>

            <!-- UNICEF Parenting Tips Carousel/Cards -->
            <div class="dash-section">
              <h3 class="section-title">Gợi ý chơi cùng con ngoài đời thực (UNICEF)</h3>
              <div class="unicef-tips-list">
                <div class="tip-card">
                  <span class="tip-num">1</span>
                  <div class="tip-body">
                    <strong>Đưa từ vựng vào sinh hoạt hàng ngày</strong>
                    <p>Khi bé ăn trái cây, hãy cùng bé reo to "Apple!" hoặc "Banana!". Trẻ mầm non tiếp thu nhanh nhất qua các đồ vật xúc chạm được.</p>
                  </div>
                </div>
                <div class="tip-card">
                  <span class="tip-num">2</span>
                  <div class="tip-body">
                    <strong>Khen ngợi nỗ lực, không tạo áp lực</strong>
                    <p>Thay vì hỏi kiểm tra "Từ này là gì?", hãy hỏi "Màu này đẹp quá, có giống quả bóng Red hôm nay Rồng Con chỉ bé không nhỉ?".</p>
                  </div>
                </div>
                <div class="tip-card">
                  <span class="tip-num">3</span>
                  <div class="tip-body">
                    <strong>Cùng vận động thể chất</strong>
                    <p>Khi Rồng Con làm mẫu động tác vỗ tay hoặc nhún nhảy, ba mẹ hãy cùng đứng dậy vận động với bé để biến việc học thành kỷ niệm ấm áp.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reset Data Zone -->
            <div class="dash-section danger-zone">
              <button class="reset-data-btn" id="reset-all-data-btn">
                🗑️ Xóa toàn bộ dữ liệu & Chơi lại từ đầu
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners inside dashboard
    const closeBtn = document.getElementById('dash-close-btn');
    if (closeBtn) closeBtn.onclick = () => this.hide();

    // Vocab audio buttons
    const vocabCards = this.container.querySelectorAll('.vocab-pill-card');
    vocabCards.forEach(card => {
      const btn = card.querySelector('.v-audio-btn');
      btn.onclick = (e) => {
        e.stopPropagation();
        const word = card.dataset.word;
        if (this.audio) {
          this.audio.playPop();
          this.audio.speakEnglish(word);
        }
      };
    });

    // Select screen timer
    const timerSelect = document.getElementById('timer-limit-select');
    if (timerSelect) {
      timerSelect.onchange = () => {
        const val = parseInt(timerSelect.value, 10);
        this.storage.saveSettings({ screenTimeLimitMinutes: val });
        this.initScreenTimer();
      };
    }

    // Volume sliders
    const bgmSlider = document.getElementById('bgm-volume-slider');
    if (bgmSlider) {
      bgmSlider.oninput = () => {
        const val = parseFloat(bgmSlider.value);
        this.storage.saveSettings({ bgmVolume: val });
        if (this.audio) this.audio.setBgmVolume(val);
      };
    }

    const sfxSlider = document.getElementById('sfx-volume-slider');
    if (sfxSlider) {
      sfxSlider.oninput = () => {
        const val = parseFloat(sfxSlider.value);
        this.storage.saveSettings({ voiceVolume: val });
        if (this.audio) this.audio.setSfxVolume(val);
      };
    }

    // Reset button
    const resetBtn = document.getElementById('reset-all-data-btn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm("Ba mẹ có chắc muốn đặt lại toàn bộ tiến độ chơi của bé không?")) {
          this.storage.resetAllData();
          alert("Đã làm mới dữ liệu thành công!");
          this.renderDashboard();
          if (this.onResetCallback) this.onResetCallback();
        }
      };
    }
  }

  hide() {
    if (this.container) this.container.innerHTML = '';
    if (this.onCloseCallback) this.onCloseCallback();
  }

  // --- SCREEN TIME LIMITER ENGINE ---
  initScreenTimer() {
    if (this.screenTimerInterval) {
      clearInterval(this.screenTimerInterval);
    }

    // Record 1 minute every 60 seconds
    this.screenTimerInterval = setInterval(() => {
      this.storage.addPlayTime(60);

      const settings = this.storage.loadSettings();
      const limit = settings.screenTimeLimitMinutes;
      if (limit > 0) {
        const played = this.storage.getTodayPlayMinutes();
        if (played >= limit) {
          // Trigger bedtime / rest screen
          if (this.onSleepTriggered) {
            this.onSleepTriggered();
          }
        }
      }
    }, 60000);
  }
}

window.ParentZone = ParentZone;
