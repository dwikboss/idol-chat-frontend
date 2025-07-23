<template>
  <div class="bubble-wrapper" :class="chat.role">
    <div class="message-info" v-if="chat.role != 'user'" :class="chat.grouped_message ? 'transparent' : ''">
      <img src="/images/profile_pictures/yuni-sharapfp.jpg" alt="pfp" />
    </div>
    <div v-if="chat.role === 'assistant'" class="message-content">
      <div class="message-bubble" :class="[chat.role, audio]">
        <p v-if="!chat.voice">{{ formatMessage }}</p>
        <div v-if="chat.voice" class="voice-message-player">
          <div class="voice-controls">
            <button 
              @click="togglePlay" 
              class="play-button"
              :class="{ playing: isPlaying }"
            >
              <svg v-if="!isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4H10V20H6V4Z" fill="currentColor"/>
                <path d="M14 4H18V20H14V4Z" fill="currentColor"/>
              </svg>
            </button>
            <div class="voice-info">
              <div class="progress-container">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
                </div>
                <div class="time-display">
                  <span class="current-time">{{ formatTime(currentTime) }}</span>
                  <span class="duration">{{ formatTime(duration) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="voice-waveform">
            <div class="wave-bar" v-for="i in 20" :key="i" :style="{ height: getWaveHeight(i) + '%' }"></div>
          </div>
        </div>
        <img v-if="chat.media" :src="`/images/minji_pics/${chat.media}`" alt="pic_minji" />
      </div>
      <div v-if="!chat.voice && chat.role === 'assistant'" class="action-buttons">
        <div @click="translate" class="translate-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path
              :fill="translateBg"
              d="M5.4 12.575q.65 0 1.113-.287t.462-.863t-.462-.875t-1.113-.3t-1.112.3t-.463.875t.463.863t1.112.287M1.875 8.8V7.7h2.85V6.3h1.3v1.4H8.9v1.1zM5.4 13.675q-1.175 0-2.013-.587t-.837-1.663q0-1.1.838-1.675T5.4 9.175q1.2 0 2.038.575t.837 1.675t-.837 1.675t-2.038.575M3.575 17.7v-3.5H4.9v2.4h6.6v1.1zM9.7 15.075V6.3h1.275v3.75H12.7v1.1H11v3.925zm7.85.575q.7 0 1.363-.325t1.212-.925v-2.65q-.575.075-1.062.175t-.913.225q-1.125.35-1.687.875T15.9 14.25q0 .65.45 1.025t1.2.375m-.575 1.7q-1.425 0-2.25-.812t-.825-2.213q0-1.3.825-2.125t2.65-1.325q.575-.15 1.263-.275t1.487-.225q-.05-1.175-.55-1.713t-1.55-.537q-.65 0-1.287.238T15.1 9.2l-.8-1.4q.825-.625 1.938-1.012T18.5 6.4q1.775 0 2.7 1.1t.925 3.2v6.425H20.45L20.3 16q-.7.625-1.537.988t-1.788.362"
            />
          </svg>
          <span class="translate-text">menerjemahkan</span>
        </div>
        <div @click="copyToClipboard" class="copy-btn" :class="{ copied: copied }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.24162C20 6.7034 19.7831 6.18791 19.4 5.8L16.2 2.6C15.8121 2.21694 15.2966 2 14.7584 2H10C8.89543 2 8 2.89543 8 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V8C4 6.89543 4.89543 6 6 6H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="copy-text">{{ copyButtonText }}</span>
        </div>
      </div>
    </div>
    <div v-else class="message-bubble" :class="[chat.role, audio]">
      <p v-if="!chat.voice">{{ formatMessage }}</p>
      <div v-if="chat.voice" class="voice-message-player">
        <div class="voice-controls">
          <button 
            @click="togglePlay" 
            class="play-button"
            :class="{ playing: isPlaying }"
          >
            <svg v-if="!isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4H10V20H6V4Z" fill="currentColor"/>
              <path d="M14 4H18V20H14V4Z" fill="currentColor"/>
            </svg>
          </button>
          <div class="voice-info">
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <div class="time-display">
                <span class="current-time">{{ formatTime(currentTime) }}</span>
                <span class="duration">{{ formatTime(duration) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="voice-waveform">
          <div class="wave-bar" v-for="i in 20" :key="i" :style="{ height: getWaveHeight(i) + '%' }"></div>
        </div>
      </div>
      <img v-if="chat.media" :src="`/images/minji_pics/${chat.media}`" alt="pic_minji" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type Idol from '@/interfaces/_IIdol';

export default defineComponent({
  name: 'ChatMessage',
  data() {
    return {
      translated: false as boolean,
      copied: false as boolean,
      isPlaying: false as boolean,
      currentTime: 0 as number,
      duration: 0 as number,
      audioElement: null as HTMLAudioElement | null,
    };
  },
  props: {
    chat: {
      type: Object as () => any,
      required: true,
    },
    idol: {
      type: Object as () => Idol,
      required: true,
    },
  },
  computed: {
    audio() {
      return this.chat.voice ? 'audio' : '';
    },
    formatMessage() {
      if (this.chat.role === 'assistant') {
        return this.translated ? this.chat.content.Dutch : this.chat.content.Indonesian;
      } else {
        return this.chat.content;
      }
    },
    translateBg() {
      if (this.translated == true) {
        return '#63ba00';
      } else {
        return '#808080';
      }
    },
    copyButtonText(): string {
      return this.copied ? 'Copied!' : 'Copy';
    },
    progressPercent(): number {
      if (this.duration === 0) return 0;
      return (this.currentTime / this.duration) * 100;
    },
  },
  mounted() {
    if (this.chat.voice) {
      this.initAudio();
    }
  },
  beforeUnmount() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.removeEventListener('timeupdate', this.updateTime);
      this.audioElement.removeEventListener('loadedmetadata', this.updateDuration);
      this.audioElement.removeEventListener('ended', this.onEnded);
    }
  },
  methods: {
    initAudio() {
      this.audioElement = new Audio(this.chat.voice);
      this.audioElement.addEventListener('timeupdate', this.updateTime);
      this.audioElement.addEventListener('loadedmetadata', this.updateDuration);
      this.audioElement.addEventListener('ended', this.onEnded);
    },
    togglePlay() {
      if (!this.audioElement) return;
      
      if (this.isPlaying) {
        this.audioElement.pause();
      } else {
        this.audioElement.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    updateTime() {
      if (this.audioElement) {
        this.currentTime = this.audioElement.currentTime;
      }
    },
    updateDuration() {
      if (this.audioElement) {
        this.duration = this.audioElement.duration;
      }
    },
    onEnded() {
      this.isPlaying = false;
      this.currentTime = 0;
    },
    formatTime(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    getWaveHeight(index: number): number {
      // Create a realistic waveform pattern
      const baseHeight = 30;
      const variation = Math.sin(index * 0.5) * 20;
      const random = Math.random() * 10;
      return Math.max(10, baseHeight + variation + random);
    },
    translate() {
      this.translated = !this.translated;
    },
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.formatMessage);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.transparent {
  opacity: 0;
}

.message-info {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  align-self: flex-end;
  flex-shrink: 0;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #e1e5e9;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.bubble-wrapper {
  display: flex;
  align-items: flex-end;
  margin-bottom: 16px;

  &.user {
    justify-content: flex-end;
  }

  &.assistant {
    justify-content: flex-start;
  }

  .message-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .translate-btn {
    color: #6b7280;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 500;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 16px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
    
    svg {
      transition: transform 0.2s ease;
    }
    
    &:hover svg {
      transform: scale(1.1);
    }
    
    .translate-text {
      color: #6b7280;
      font-size: 12px;
      font-weight: 500;
    }
  }

  .copy-btn {
    color: #6b7280;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 500;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 16px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
    
    svg {
      transition: transform 0.2s ease;
    }
    
    &:hover svg {
      transform: scale(1.1);
    }
    
    .copy-text {
      color: #6b7280;
      font-size: 12px;
      font-weight: 500;
    }
    
    &.copied {
      background: #10b981;
      border-color: #10b981;
      color: white;
      
      .copy-text {
        color: white;
      }
      
      svg {
        stroke: white;
      }
    }
  }

  .message-bubble {
    padding: 12px 16px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 15px;
    line-height: 1.5;
    max-width: 70%;
    word-wrap: break-word;
    position: relative;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &.audio {
      max-width: 100%;
    }

    img {
      width: 100%;
      margin-top: 8px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    &.user {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 18px 18px 4px 18px;
      margin-left: auto;
      max-width: 75%;
      box-shadow: 0 1px 3px rgba(102, 126, 234, 0.15);
      
      &:hover {
        box-shadow: 0 2px 6px rgba(102, 126, 234, 0.2);
        transform: translateY(-1px);
      }
      
      p {
        margin: 0;
        color: white;
        font-weight: 400;
      }
    }

    &.assistant {
      background: white;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      border-radius: 18px 18px 18px 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      
      &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        transform: translateY(-1px);
      }
      
      p {
        margin: 0;
        color: #1f2937;
        font-weight: 400;
      }
    }
  }
}

.voice-message-player {
  width: 100%;
  margin-top: 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .voice-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .play-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      flex-shrink: 0;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
      }

      &.playing {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);

        &:hover {
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
      }

      svg {
        transition: transform 0.2s ease;
      }

      &:hover svg {
        transform: scale(1.1);
      }
    }

    .voice-info {
      flex-grow: 1;
      min-width: 0;

      .progress-container {
        .progress-bar {
          width: 100%;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 6px;

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
            transition: width 0.1s ease;
          }
        }

        .time-display {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;

          .current-time {
            color: #667eea;
            font-weight: 600;
          }

          .duration {
            color: #9ca3af;
          }
        }
      }
    }
  }

  .voice-waveform {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 40px;
    padding: 8px 0;

    .wave-bar {
      flex: 1;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 1px;
      min-height: 4px;
      transition: all 0.3s ease;
      opacity: 0.6;

      &:nth-child(odd) {
        background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
      }

      &:hover {
        opacity: 1;
        transform: scaleY(1.1);
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .bubble-wrapper {
    margin-bottom: 12px;
    
    .message-bubble {
      max-width: 85%;
      padding: 10px 14px;
      font-size: 14px;
    }
  }
  
  .message-info {
    width: 28px;
    height: 28px;
    margin-right: 8px;
    
    img {
      width: 28px;
      height: 28px;
    }
  }

  .voice-message-player {
    padding: 12px;

    .voice-controls {
      gap: 8px;

      .play-button {
        width: 36px;
        height: 36px;
      }

      .voice-info {
        .progress-container {
          .time-display {
            font-size: 11px;
          }
        }
      }
    }

    .voice-waveform {
      height: 32px;
      gap: 1px;

      .wave-bar {
        min-height: 3px;
      }
    }
  }
}
</style>
