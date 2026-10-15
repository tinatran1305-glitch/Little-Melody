/**
 * Little Melody - Interactive Dragon Mascot ("Rồng Con")
 * Renders an animated, highly-expressive SVG dragon with multiple emotional states:
 * idle, happy, speaking, retry, dancing, sleeping, highFive.
 */

class DragonMascot {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.mood = 'idle';
    this.speechTimeout = null;
    this.size = options.size || 220; // default px
    this.isSleeping = false;
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="mascot-wrapper" id="mascot-wrapper">
        <div class="speech-bubble" id="mascot-bubble" style="display: none;">
          <span class="bubble-text" id="bubble-text">Xin chào bé yêu!</span>
          <div class="bubble-tail"></div>
        </div>

        <div class="dragon-svg-container" id="dragon-character">
          <svg viewBox="0 0 200 220" width="${this.size}" height="${this.size * 1.1}" class="dragon-svg mood-${this.mood}">
            <defs>
              <linearGradient id="dragonSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#48DBFB"/>
                <stop offset="50%" stop-color="#2ED573"/>
                <stop offset="100%" stop-color="#10AC84"/>
              </linearGradient>
              <linearGradient id="dragonBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFF275"/>
                <stop offset="100%" stop-color="#FFD32A"/>
              </linearGradient>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF7675"/>
                <stop offset="100%" stop-color="#FF9F43"/>
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Shadow underneath -->
            <ellipse cx="100" cy="205" rx="55" ry="12" fill="rgba(0,0,0,0.12)" class="dragon-shadow"/>

            <!-- Tail -->
            <g class="dragon-tail">
              <path d="M 60 170 C 40 185, 20 180, 15 155 C 10 135, 25 145, 38 155" fill="url(#dragonSkin)"/>
              <polygon points="12,145 22,140 18,155" fill="#FF9F43"/>
            </g>

            <!-- Wings (Left & Right) -->
            <g class="dragon-wings">
              <path class="wing-left" d="M 45 105 C 15 75, 20 50, 48 70 C 40 85, 45 95, 52 105 Z" fill="url(#wingGrad)"/>
              <path class="wing-right" d="M 155 105 C 185 75, 180 50, 152 70 C 160 85, 155 95, 148 105 Z" fill="url(#wingGrad)"/>
            </g>

            <!-- Body -->
            <g class="dragon-body">
              <ellipse cx="100" cy="145" rx="52" ry="50" fill="url(#dragonSkin)"/>
              <!-- Belly with soft stripes -->
              <ellipse cx="100" cy="155" rx="35" ry="34" fill="url(#dragonBelly)"/>
              <path d="M 80 148 Q 100 154 120 148" stroke="#FFA801" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M 75 162 Q 100 168 125 162" stroke="#FFA801" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            </g>

            <!-- Little Feet -->
            <g class="dragon-feet">
              <ellipse cx="72" cy="195" rx="18" ry="12" fill="#2ED573"/>
              <ellipse cx="128" cy="195" rx="18" ry="12" fill="#2ED573"/>
              <circle cx="64" cy="197" r="3.5" fill="#FFF275"/>
              <circle cx="72" cy="199" r="3.5" fill="#FFF275"/>
              <circle cx="80" cy="197" r="3.5" fill="#FFF275"/>
              <circle cx="120" cy="197" r="3.5" fill="#FFF275"/>
              <circle cx="128" cy="199" r="3.5" fill="#FFF275"/>
              <circle cx="136" cy="197" r="3.5" fill="#FFF275"/>
            </g>

            <!-- Head Group -->
            <g class="dragon-head">
              <!-- Horns -->
              <path d="M 70 50 Q 55 25 72 20 Q 80 35 78 52" fill="#FFA801"/>
              <path d="M 130 50 Q 145 25 128 20 Q 120 35 122 52" fill="#FFA801"/>

              <!-- Cute head shape -->
              <ellipse cx="100" cy="78" rx="54" ry="46" fill="url(#dragonSkin)"/>

              <!-- Cheeks (Blushing pink) -->
              <ellipse cx="60" cy="92" rx="10" ry="7" fill="#FF7675" opacity="0.6"/>
              <ellipse cx="140" cy="92" rx="10" ry="7" fill="#FF7675" opacity="0.6"/>

              <!-- Eyes (Normal open state) -->
              <g class="dragon-eyes eye-open">
                <ellipse cx="76" cy="74" rx="13" ry="16" fill="#2D3436"/>
                <ellipse cx="124" cy="74" rx="13" ry="16" fill="#2D3436"/>
                <!-- Sparkle highlights -->
                <circle cx="72" cy="69" r="5" fill="#FFFFFF"/>
                <circle cx="79" cy="78" r="2.5" fill="#FFFFFF"/>
                <circle cx="120" cy="69" r="5" fill="#FFFFFF"/>
                <circle cx="127" cy="78" r="2.5" fill="#FFFFFF"/>
              </g>

              <!-- Eyes (Smiling curved arcs) -->
              <g class="dragon-eyes eye-happy" style="display:none;">
                <path d="M 64 76 Q 76 60 88 76" stroke="#2D3436" stroke-width="4.5" stroke-linecap="round" fill="none"/>
                <path d="M 112 76 Q 124 60 136 76" stroke="#2D3436" stroke-width="4.5" stroke-linecap="round" fill="none"/>
              </g>

              <!-- Eyes (Sleeping closed) -->
              <g class="dragon-eyes eye-sleep" style="display:none;">
                <path d="M 64 74 Q 76 86 88 74" stroke="#2D3436" stroke-width="4" stroke-linecap="round" fill="none"/>
                <path d="M 112 74 Q 124 86 136 74" stroke="#2D3436" stroke-width="4" stroke-linecap="round" fill="none"/>
              </g>

              <!-- Cute Little Snout / Nostrils -->
              <ellipse cx="94" cy="85" rx="2.5" ry="3.5" fill="#0C8D6D"/>
              <ellipse cx="106" cy="85" rx="2.5" ry="3.5" fill="#0C8D6D"/>

              <!-- Mouth states -->
              <!-- Smile (Default) -->
              <path class="mouth-smile" d="M 85 96 Q 100 112 115 96" stroke="#2D3436" stroke-width="3.5" stroke-linecap="round" fill="none"/>
              
              <!-- Open happy laughing / speaking mouth -->
              <g class="mouth-open" style="display:none;">
                <path d="M 84 94 Q 100 125 116 94 Z" fill="#D63031"/>
                <path d="M 88 108 Q 100 124 112 108" fill="#FF7675"/>
                <path d="M 84 94 Q 100 100 116 94" stroke="#2D3436" stroke-width="3" fill="none"/>
              </g>
            </g>

            <!-- Little Arms / Hands -->
            <!-- Left hand -->
            <g class="dragon-arm arm-left">
              <path d="M 52 135 Q 36 142 42 155 Q 56 150 58 138 Z" fill="url(#dragonSkin)"/>
            </g>

            <!-- Right hand (Waving or High-Five) -->
            <g class="dragon-arm arm-right" id="dragon-right-arm">
              <path d="M 148 135 Q 164 142 158 155 Q 144 150 142 138 Z" fill="url(#dragonSkin)"/>
            </g>

            <!-- High-Five Glowing Hand (Visible only in highFive state) -->
            <g class="high-five-hand" id="high-five-hand" style="display:none; cursor: pointer;">
              <circle cx="165" cy="110" r="26" fill="#FFEAA7" opacity="0.6" filter="url(#softGlow)"/>
              <circle cx="165" cy="110" r="20" fill="#FF9F43"/>
              <!-- Palm and fingers -->
              <ellipse cx="165" cy="112" rx="14" ry="12" fill="#FFA801"/>
              <circle cx="154" cy="98" r="4.5" fill="#FFA801"/>
              <circle cx="162" cy="94" r="4.5" fill="#FFA801"/>
              <circle cx="170" cy="96" r="4.5" fill="#FFA801"/>
              <circle cx="177" cy="102" r="4.5" fill="#FFA801"/>
              <!-- Sparkle -->
              <text x="160" y="80" font-size="16" fill="#FFD32A" class="sparkle-star">✨</text>
            </g>

            <!-- Floating Zzz (Sleeping state) -->
            <g class="sleep-bubbles" id="sleep-bubbles" style="display:none;">
              <text x="135" y="45" font-family="'Fredoka', sans-serif" font-size="18" font-weight="bold" fill="#74B9FF" class="zzz-text z1">Z</text>
              <text x="150" y="30" font-family="'Fredoka', sans-serif" font-size="24" font-weight="bold" fill="#0984E3" class="zzz-text z2">z</text>
              <text x="168" y="15" font-family="'Fredoka', sans-serif" font-size="28" font-weight="bold" fill="#6C5CE7" class="zzz-text z3">z</text>
            </g>
          </svg>
        </div>
      </div>
    `;

    // Add interactive click/tap on Dragon Mascot
    const char = document.getElementById('dragon-character');
    if (char) {
      char.addEventListener('click', () => this.handleMascotTap());
      char.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.handleMascotTap();
      });
    }

    // High five tap listener
    const highFive = document.getElementById('high-five-hand');
    if (highFive) {
      highFive.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerHighFiveSuccess();
      });
    }
  }

  setMood(mood) {
    this.mood = mood;
    const svg = this.container ? this.container.querySelector('.dragon-svg') : null;
    if (!svg) return;

    svg.setAttribute('class', `dragon-svg mood-${mood}`);

    const eyeOpen = svg.querySelector('.eye-open');
    const eyeHappy = svg.querySelector('.eye-happy');
    const eyeSleep = svg.querySelector('.eye-sleep');
    const mouthSmile = svg.querySelector('.mouth-smile');
    const mouthOpen = svg.querySelector('.mouth-open');
    const sleepBubbles = svg.querySelector('#sleep-bubbles');
    const highFiveHand = svg.querySelector('#high-five-hand');

    // Reset visibility
    if (eyeOpen) eyeOpen.style.display = 'block';
    if (eyeHappy) eyeHappy.style.display = 'none';
    if (eyeSleep) eyeSleep.style.display = 'none';
    if (mouthSmile) mouthSmile.style.display = 'block';
    if (mouthOpen) mouthOpen.style.display = 'none';
    if (sleepBubbles) sleepBubbles.style.display = 'none';
    if (highFiveHand) highFiveHand.style.display = 'none';

    if (mood === 'happy' || mood === 'celebrate') {
      if (eyeOpen) eyeOpen.style.display = 'none';
      if (eyeHappy) eyeHappy.style.display = 'block';
      if (mouthSmile) mouthSmile.style.display = 'none';
      if (mouthOpen) mouthOpen.style.display = 'block';
    } else if (mood === 'speaking') {
      if (mouthSmile) mouthSmile.style.display = 'none';
      if (mouthOpen) mouthOpen.style.display = 'block';
    } else if (mood === 'retry') {
      // Gentle thinking look
      if (mouthSmile) mouthSmile.style.display = 'block';
    } else if (mood === 'sleeping') {
      if (eyeOpen) eyeOpen.style.display = 'none';
      if (eyeSleep) eyeSleep.style.display = 'block';
      if (sleepBubbles) sleepBubbles.style.display = 'block';
    } else if (mood === 'highFive') {
      if (eyeOpen) eyeOpen.style.display = 'none';
      if (eyeHappy) eyeHappy.style.display = 'block';
      if (mouthSmile) mouthSmile.style.display = 'none';
      if (mouthOpen) mouthOpen.style.display = 'block';
      if (highFiveHand) highFiveHand.style.display = 'block';
    }
  }

  say(text, duration = 3500) {
    const bubble = document.getElementById('mascot-bubble');
    const bubbleText = document.getElementById('bubble-text');
    if (!bubble || !bubbleText) return;

    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
    }

    bubbleText.textContent = text;
    bubble.style.display = 'block';
    bubble.classList.add('pop-in');

    this.setMood('speaking');

    // Voice reading through Web Audio Speech
    if (window.audioEngine) {
      window.audioEngine.speakVietnamese(text, () => {
        if (this.mood === 'speaking') {
          this.setMood('idle');
        }
      });
    }

    this.speechTimeout = setTimeout(() => {
      bubble.style.display = 'none';
      if (this.mood === 'speaking') {
        this.setMood('idle');
      }
    }, duration);
  }

  handleMascotTap() {
    if (this.mood === 'sleeping') {
      this.setMood('happy');
      this.say("Bé đánh thức tớ dậy rồi! Cùng chơi tiếp nào!", 3000);
      if (window.audioEngine) window.audioEngine.playPop();
      return;
    }

    if (this.mood === 'highFive') {
      this.triggerHighFiveSuccess();
      return;
    }

    // Friendly giggling response
    this.setMood('happy');
    if (window.audioEngine) {
      window.audioEngine.playPop();
      window.audioEngine.playChime(1.1);
    }

    const cheerfulLines = [
      "Tớ yêu bé nhiều lắm!",
      "Chúng mình cùng học vui nhé!",
      "Rồng Con chào bé!",
      "Bé chạm vào tớ nhột quá đi! Hihi!"
    ];
    const line = cheerfulLines[Math.floor(Math.random() * cheerfulLines.length)];
    this.say(line, 2500);

    setTimeout(() => {
      if (this.mood === 'happy') this.setMood('idle');
    }, 2500);
  }

  triggerHighFiveSuccess() {
    if (window.audioEngine) {
      window.audioEngine.playHighFive();
    }
    this.setMood('happy');
    this.say("Đập tay thành công! Bé quá xuất sắc!", 2500);

    // Dispatch custom event for lesson step transition
    const event = new CustomEvent('mascot:highFiveComplete');
    window.dispatchEvent(event);
  }
}

window.DragonMascot = DragonMascot;
