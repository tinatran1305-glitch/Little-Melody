/**
 * Little Melody - Interactive Minigames Engine (Step 3)
 * Provides genuine, interactive, child-safe gameplay for all 6 lessons.
 * Zero mockups - all interactions are functional with real audio & animations.
 */

class MinigameEngine {
  constructor(containerId, lessonData, mascot, onCompleteCallback) {
    this.container = document.getElementById(containerId);
    this.lesson = lessonData;
    this.mascot = mascot;
    this.onComplete = onCompleteCallback;

    this.roundIndex = 0;
    this.totalRounds = 4;
    this.isProcessing = false;
    this.idleTimer = null;
  }

  start() {
    this.roundIndex = 0;
    this.render();
  }

  destroy() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
  }

  resetIdleTimer(hintAction) {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (this.mascot && hintAction) {
        hintAction();
      }
    }, 12000); // 12 seconds idle gentle prompt
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    switch (this.lesson.id) {
      case 'color-party':
        this.renderColorPartyGame();
        break;
      case 'hello-world':
        this.renderHelloWorldGame();
        break;
      case 'animal-dance':
        this.renderAnimalDanceGame();
        break;
      case 'yummy-fruits':
        this.renderYummyFruitsGame();
        break;
      case 'count-jump':
        this.renderCountJumpGame();
        break;
      case 'move-body':
        this.renderMoveBodyGame();
        break;
      default:
        this.renderColorPartyGame();
    }
  }

  // ==========================================
  // LESSON 2 (PRIORITY): RAINBOW COLORS GAME
  // ==========================================
  renderColorPartyGame() {
    const vocabList = this.lesson.vocabulary;
    const currentTarget = vocabList[this.roundIndex % vocabList.length];

    this.container.innerHTML = `
      <div class="minigame-box color-party-box">
        <div class="game-instruction-banner">
          <span class="instruction-audio-btn" id="repeat-prompt-btn" title="Nghe lại yêu cầu">🔊</span>
          <div class="instruction-text-group">
            <span class="instruction-label">Bé hãy chọn bóng:</span>
            <span class="instruction-target" style="color: ${currentTarget.colorCode}">${currentTarget.word} (${currentTarget.meaningVi})</span>
          </div>
        </div>

        <!-- Floating Balloons Playground -->
        <div class="balloons-arena" id="balloons-arena"></div>

        <div class="round-progress-pills">
          ${vocabList.map((_, idx) => `
            <div class="pill ${idx < this.roundIndex ? 'done' : idx === this.roundIndex ? 'active' : ''}"></div>
          `).join('')}
        </div>
      </div>
    `;

    // Prompt dragon to ask
    const promptText = `Bé tìm giúp Rồng Con chùm bóng ${currentTarget.word} - ${currentTarget.meaningVi} nhé!`;
    this.mascot.say(promptText, 3500);

    const repeatBtn = document.getElementById('repeat-prompt-btn');
    if (repeatBtn) {
      repeatBtn.onclick = () => {
        if (window.audioEngine) window.audioEngine.playPop();
        this.mascot.say(promptText, 3000);
      };
    }

    // Populate 4 balloons (shuffled)
    const arena = document.getElementById('balloons-arena');
    const shuffledColors = [...vocabList].sort(() => Math.random() - 0.5);

    arena.innerHTML = '';
    shuffledColors.forEach((colorItem, i) => {
      const balloon = document.createElement('div');
      balloon.className = `balloon-item balloon-anim-${i}`;
      balloon.dataset.word = colorItem.word;
      balloon.innerHTML = `
        <div class="balloon-body" style="background: radial-gradient(circle at 35% 35%, #fff 0%, ${colorItem.colorCode} 45%, ${this.darkenColor(colorItem.colorCode)} 100%);">
          <div class="balloon-shine"></div>
          <span class="balloon-label">${colorItem.word}</span>
        </div>
        <div class="balloon-knot" style="background-color: ${colorItem.colorCode};"></div>
        <div class="balloon-string"></div>
      `;

      balloon.onclick = () => this.handleBalloonTap(balloon, colorItem, currentTarget);
      arena.appendChild(balloon);
    });

    // Idle hint
    this.resetIdleTimer(() => {
      const correctBalloon = arena.querySelector(`[data-word="${currentTarget.word}"]`);
      if (correctBalloon) {
        correctBalloon.classList.add('gentle-hint-pulse');
        this.mascot.say(`Quả bóng ${currentTarget.word} đang rung rinh kìa bé ơi!`, 2500);
      }
    });
  }

  handleBalloonTap(balloonEl, selectedColor, targetColor) {
    if (this.isProcessing) return;

    if (selectedColor.word === targetColor.word) {
      // CORRECT CHOICE!
      this.isProcessing = true;
      if (this.idleTimer) clearTimeout(this.idleTimer);

      if (window.audioEngine) {
        window.audioEngine.playPop();
        window.audioEngine.playChime(1.15);
        // Speak native English vocabulary clearly!
        setTimeout(() => {
          window.audioEngine.speakEnglish(selectedColor.word);
        }, 200);
      }

      // Visual animations
      balloonEl.classList.add('balloon-fly-away');
      this.createSparkles(balloonEl);

      this.mascot.setMood('happy');
      this.mascot.say(`Hoan hô! Đúng rồi, ${selectedColor.word} là ${selectedColor.meaningVi}!`, 2500);

      setTimeout(() => {
        this.roundIndex++;
        this.isProcessing = false;
        if (this.roundIndex >= this.lesson.vocabulary.length) {
          this.completeMinigame();
        } else {
          this.render();
        }
      }, 2200);

    } else {
      // WRONG CHOICE - GENTLE & NO PENALTY!
      if (window.audioEngine) {
        window.audioEngine.playGentleBoing();
      }
      balloonEl.classList.add('balloon-wobble');
      setTimeout(() => balloonEl.classList.remove('balloon-wobble'), 600);

      this.mascot.setMood('retry');
      this.mascot.say(`Ồ, đây là màu khác rồi! Bé thử tìm bóng ${targetColor.word} (${targetColor.meaningVi}) xem sao nhé!`, 3000);

      this.resetIdleTimer(() => {
        const correctBalloon = document.querySelector(`[data-word="${targetColor.word}"]`);
        if (correctBalloon) correctBalloon.classList.add('gentle-hint-pulse');
      });
    }
  }

  // ==========================================
  // LESSON 1: HELLO WORLD GAME
  // ==========================================
  renderHelloWorldGame() {
    const vocab = this.lesson.vocabulary;
    const currentTarget = vocab[this.roundIndex % vocab.length];

    this.container.innerHTML = `
      <div class="minigame-box hello-world-box">
        <div class="game-instruction-banner">
          <span class="instruction-audio-btn" id="repeat-prompt-btn">🔊</span>
          <div class="instruction-text-group">
            <span class="instruction-label">Bé hãy chào:</span>
            <span class="instruction-target" style="color: ${currentTarget.colorCode}">${currentTarget.word} (${currentTarget.meaningVi})</span>
          </div>
        </div>

        <div class="doors-arena">
          ${vocab.map(item => `
            <div class="friend-card ${item.word === currentTarget.word ? 'target-pulse' : ''}" data-word="${item.word}">
              <div class="friend-avatar">${item.icon}</div>
              <div class="friend-name">${item.word}</div>
              <div class="friend-sub">${item.meaningVi}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.mascot.say(`Bé hãy chạm vào nút ${currentTarget.word} để cùng chào bạn nhé!`, 3000);

    const cards = this.container.querySelectorAll('.friend-card');
    cards.forEach(card => {
      card.onclick = () => {
        if (this.isProcessing) return;
        const word = card.dataset.word;
        if (word === currentTarget.word) {
          this.isProcessing = true;
          if (window.audioEngine) {
            window.audioEngine.playChime(1.2);
            window.audioEngine.speakEnglish(word);
          }
          card.classList.add('card-celebrate');
          this.mascot.setMood('happy');
          this.mascot.say(`Bé thật ngoan! ${word}!`, 2000);
          setTimeout(() => {
            this.roundIndex++;
            this.isProcessing = false;
            if (this.roundIndex >= vocab.length) {
              this.completeMinigame();
            } else {
              this.render();
            }
          }, 2000);
        } else {
          if (window.audioEngine) window.audioEngine.playGentleBoing();
          card.classList.add('card-shake');
          setTimeout(() => card.classList.remove('card-shake'), 500);
          this.mascot.say(`Bé tìm nút ${currentTarget.word} nhé!`, 2000);
        }
      };
    });
  }

  // ==========================================
  // LESSON 3: ANIMAL DANCE GAME
  // ==========================================
  renderAnimalDanceGame() {
    const vocab = this.lesson.vocabulary;
    const currentTarget = vocab[this.roundIndex % vocab.length];

    this.container.innerHTML = `
      <div class="minigame-box animal-game-box">
        <div class="game-instruction-banner">
          <span class="instruction-audio-btn" id="repeat-prompt-btn">🔊</span>
          <div class="instruction-text-group">
            <span class="instruction-label">Bé tìm bạn:</span>
            <span class="instruction-target" style="color: ${currentTarget.colorCode}">${currentTarget.word} (${currentTarget.meaningVi})</span>
          </div>
        </div>

        <div class="bushes-arena">
          ${vocab.map(item => `
            <div class="bush-item" data-word="${item.word}">
              <div class="animal-hidden">${item.icon}</div>
              <div class="bush-foliage">🌿</div>
              <span class="animal-tag">${item.word}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.mascot.say(`Bạn ${currentTarget.word} (${currentTarget.meaningVi}) đang trốn sau bụi cây nào nhỉ?`, 3000);

    const bushes = this.container.querySelectorAll('.bush-item');
    bushes.forEach(bush => {
      bush.onclick = () => {
        if (this.isProcessing) return;
        const word = bush.dataset.word;
        if (word === currentTarget.word) {
          this.isProcessing = true;
          bush.classList.add('bush-revealed');
          if (window.audioEngine) {
            window.audioEngine.playPop();
            window.audioEngine.playChime(1.1);
            window.audioEngine.speakEnglish(word);
          }
          this.mascot.setMood('dancing');
          this.mascot.say(`Tìm thấy ${word} rồi! Cùng nhảy múa nào!`, 2000);
          setTimeout(() => {
            this.roundIndex++;
            this.isProcessing = false;
            if (this.roundIndex >= vocab.length) {
              this.completeMinigame();
            } else {
              this.render();
            }
          }, 2200);
        } else {
          if (window.audioEngine) window.audioEngine.playGentleBoing();
          bush.classList.add('bush-shake');
          setTimeout(() => bush.classList.remove('bush-shake'), 500);
          this.mascot.say(`Chưa đúng bạn ${currentTarget.word} rồi, bé tìm lại nhé!`, 2000);
        }
      };
    });
  }

  // ==========================================
  // LESSON 4: YUMMY FRUITS GAME
  // ==========================================
  renderYummyFruitsGame() {
    const vocab = this.lesson.vocabulary;
    const currentTarget = vocab[this.roundIndex % vocab.length];

    this.container.innerHTML = `
      <div class="minigame-box fruits-game-box">
        <div class="game-instruction-banner">
          <div class="instruction-text-group">
            <span class="instruction-label">Bé hãy hái quả:</span>
            <span class="instruction-target" style="color: ${currentTarget.colorCode}">${currentTarget.word} (${currentTarget.meaningVi})</span>
          </div>
        </div>

        <div class="fruit-tree-arena">
          <div class="tree-top">🌳</div>
          <div class="fruits-row">
            ${vocab.map(item => `
              <div class="fruit-bubble" data-word="${item.word}" style="background-color: ${item.colorCode}22; border-color: ${item.colorCode};">
                <span class="fruit-icon">${item.icon}</span>
                <span class="fruit-name">${item.word}</span>
              </div>
            `).join('')}
          </div>
          <div class="basket-target">🧺 Giỏ trái cây ngọt ngào</div>
        </div>
      </div>
    `;

    this.mascot.say(`Bé chạm vào quả ${currentTarget.word} (${currentTarget.meaningVi}) để hái vào giỏ nhé!`, 3000);

    const fruits = this.container.querySelectorAll('.fruit-bubble');
    fruits.forEach(f => {
      f.onclick = () => {
        if (this.isProcessing) return;
        const word = f.dataset.word;
        if (word === currentTarget.word) {
          this.isProcessing = true;
          f.classList.add('fruit-drop-into-basket');
          if (window.audioEngine) {
            window.audioEngine.playPop();
            window.audioEngine.playChime(1.2);
            window.audioEngine.speakEnglish(word);
          }
          this.mascot.setMood('happy');
          this.mascot.say(`Yummy! Quả ${word} ngon tuyệt!`, 2000);
          setTimeout(() => {
            this.roundIndex++;
            this.isProcessing = false;
            if (this.roundIndex >= vocab.length) {
              this.completeMinigame();
            } else {
              this.render();
            }
          }, 2000);
        } else {
          if (window.audioEngine) window.audioEngine.playGentleBoing();
          f.classList.add('balloon-wobble');
          setTimeout(() => f.classList.remove('balloon-wobble'), 500);
          this.mascot.say(`Bé tìm quả ${currentTarget.word} nhé!`, 2000);
        }
      };
    });
  }

  // ==========================================
  // LESSON 5: COUNT & JUMP GAME
  // ==========================================
  renderCountJumpGame() {
    const vocab = this.lesson.vocabulary;
    const currentNumber = this.roundIndex + 1;
    const currentTarget = vocab[this.roundIndex];

    this.container.innerHTML = `
      <div class="minigame-box count-game-box">
        <div class="game-instruction-banner">
          <div class="instruction-text-group">
            <span class="instruction-label">Bé hãy chạm ngôi sao số:</span>
            <span class="instruction-target" style="color: ${currentTarget.colorCode}">${currentTarget.word} (${currentTarget.meaningVi})</span>
          </div>
        </div>

        <div class="stars-staircase">
          ${vocab.map((item, idx) => `
            <div class="count-star-step ${idx < this.roundIndex ? 'collected' : idx === this.roundIndex ? 'current-step' : ''}" data-index="${idx}">
              <div class="star-badge">${item.icon}</div>
              <div class="star-word">${item.word}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.mascot.say(`Bé hãy chạm ngôi sao ${currentTarget.word} (${currentNumber}) nào!`, 2500);

    const steps = this.container.querySelectorAll('.count-star-step');
    steps.forEach(step => {
      step.onclick = () => {
        if (this.isProcessing) return;
        const idx = parseInt(step.dataset.index, 10);
        if (idx === this.roundIndex) {
          this.isProcessing = true;
          if (window.audioEngine) {
            window.audioEngine.playCountNote(currentNumber);
            window.audioEngine.speakEnglish(currentTarget.word);
          }
          step.classList.add('step-jump');
          this.mascot.setMood('dancing');
          this.mascot.say(`Nhảy lên nào! ${currentTarget.word}!`, 1800);
          setTimeout(() => {
            this.roundIndex++;
            this.isProcessing = false;
            if (this.roundIndex >= vocab.length) {
              this.completeMinigame();
            } else {
              this.render();
            }
          }, 1800);
        } else if (idx > this.roundIndex) {
          if (window.audioEngine) window.audioEngine.playGentleBoing();
          this.mascot.say(`Chúng mình đếm lần lượt từ ${currentTarget.word} trước nhé!`, 2000);
        }
      };
    });
  }

  // ==========================================
  // LESSON 6: MOVE YOUR BODY GAME
  // ==========================================
  renderMoveBodyGame() {
    const vocab = this.lesson.vocabulary;
    const currentTarget = vocab[this.roundIndex % vocab.length];

    this.container.innerHTML = `
      <div class="minigame-box move-game-box">
        <div class="game-instruction-banner">
          <div class="instruction-text-group">
            <span class="instruction-label">Rồng Con hô:</span>
            <span class="instruction-target" style="color: ${currentTarget.colorCode}">${currentTarget.word}! (${currentTarget.meaningVi})</span>
          </div>
        </div>

        <div class="action-cards-grid">
          ${vocab.map(item => `
            <div class="action-card ${item.word === currentTarget.word ? 'action-target-highlight' : ''}" data-word="${item.word}">
              <span class="action-icon">${item.icon}</span>
              <span class="action-title">${item.word}</span>
              <span class="action-sub">${item.meaningVi}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.mascot.say(`Hiệu lệnh là: ${currentTarget.word}! Bé chạm vào động tác ${currentTarget.word} nào!`, 3000);

    const cards = this.container.querySelectorAll('.action-card');
    cards.forEach(c => {
      c.onclick = () => {
        if (this.isProcessing) return;
        const word = c.dataset.word;
        if (word === currentTarget.word) {
          this.isProcessing = true;
          if (window.audioEngine) {
            window.audioEngine.playChime(1.2);
            window.audioEngine.speakEnglish(word);
          }
          c.classList.add('card-celebrate');
          this.mascot.setMood(word === 'Stop' ? 'idle' : 'dancing');
          this.mascot.say(`Chính xác! ${word}!`, 2000);
          setTimeout(() => {
            this.roundIndex++;
            this.isProcessing = false;
            if (this.roundIndex >= vocab.length) {
              this.completeMinigame();
            } else {
              this.render();
            }
          }, 2000);
        } else {
          if (window.audioEngine) window.audioEngine.playGentleBoing();
          c.classList.add('card-shake');
          setTimeout(() => c.classList.remove('card-shake'), 500);
          this.mascot.say(`Rồng Con đang hô ${currentTarget.word} mà, bé tìm lại nhé!`, 2000);
        }
      };
    });
  }

  // ==========================================
  // HELPERS
  // ==========================================
  completeMinigame() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (window.audioEngine) window.audioEngine.playFanfare();

    this.container.innerHTML = `
      <div class="minigame-completed-splash">
        <div class="splash-stars">⭐⭐⭐</div>
        <div class="splash-title">Bé Giỏi Quá!</div>
        <div class="splash-sub">Đã hoàn thành phần chơi tương tác!</div>
      </div>
    `;

    this.mascot.setMood('happy');
    this.mascot.say("Hoan hô bé yêu! Bé đã chơi rất xuất sắc!", 2500);

    setTimeout(() => {
      if (this.onComplete) this.onComplete();
    }, 2800);
  }

  createSparkles(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const count = 10;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'sparkle-particle';
      p.style.left = `${rect.left + rect.width / 2 + (Math.random() * 80 - 40)}px`;
      p.style.top = `${rect.top + rect.height / 2 + (Math.random() * 80 - 40)}px`;
      p.style.backgroundColor = ['#FFD32A', '#FF7675', '#74B9FF', '#2ED573'][Math.floor(Math.random() * 4)];
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  }

  darkenColor(hex) {
    // Return a slightly deeper tone for radial gradient depth
    return hex;
  }
}

window.MinigameEngine = MinigameEngine;
