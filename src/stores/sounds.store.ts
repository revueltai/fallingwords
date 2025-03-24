import { API_KEYS } from '@/configs/constants'
import APIService from '@/utils/apiService'
import { defineStore } from 'pinia'

interface SoundState {
  initialized: boolean
  soundsOn: boolean | undefined
  soundEffectsOn: boolean | undefined
  soundActive: GameSoundName | ''
  soundEffectActive: GameSoundEffectName | ''
  sounds: GameSoundsMap
  soundsEffects: GameSoundsEffectsMap
}

export const useSoundStore = defineStore('sound', {
  state: (): SoundState => ({
    initialized: false,
    soundsOn: undefined,
    soundEffectsOn: undefined,
    soundActive: '',
    soundEffectActive: '',
    soundsEffects: {
      buttonClick: {
        audio: new Audio('/sounds/uiButtonClick.wav'),
        volume: 0.5,
      },
      fire: {
        audio: new Audio('/sounds/powerupFire.mp3'),
        volume: 0.5,
      },
      ice: {
        audio: new Audio('/sounds/powerupIce.wav'),
        volume: 0.5,
      },
      wind: {
        audio: new Audio('/sounds/powerupWind.mp3'),
        volume: 0.5,
      },
      characterMove: {
        audio: new Audio('/sounds/characterMove.wav'),
        volume: 0.5,
      },
      characterChew: {
        audio: new Audio('/sounds/characterChew.wav'),
        volume: 0.5,
      },
      characterLike: {
        audio: new Audio('/sounds/characterLike.wav'),
        volume: 0.5,
      },
      characterDislike: {
        audio: new Audio('/sounds/characterDislike.wav'),
        volume: 0.5,
      },
      characterLove: {
        audio: new Audio('/sounds/characterLove.wav'),
        volume: 0.5,
      },
      gameTick: {
        audio: new Audio('/sounds/gameTick.wav'),
        volume: 0.5,
      },
      gameTilePop: {
        audio: new Audio('/sounds/gameTilePop.mp3'),
        volume: 0.5,
      },
      gameTilePowerup: {
        audio: new Audio('/sounds/gameTilePowerup.mp3'),
        volume: 0.5,
      },
      gameRoundOver: {
        audio: new Audio('/sounds/gameRoundOver.wav'),
        volume: 0.5,
      },
      gameRoundLost: {
        audio: new Audio('/sounds/gameRoundLost.mp3'),
        volume: 0.5,
      },
      gameWon: {
        audio: new Audio('/sounds/gameWon.mp3'),
        volume: 0.5,
      },
      gameLost: {
        audio: new Audio('/sounds/gameLost.mp3'),
        volume: 0.5,
      },
    },
    sounds: {
      dashboardBg: {
        audio: new Audio('/sounds/dashboardBg.mp3'),
        volume: 0.2,
      },
      gameBg: {
        audio: new Audio('/sounds/gameBg.mp3'),
        volume: 0.2,
      },
    },
  }),

  actions: {
    playAudio(audio: HTMLAudioElement) {
      // if (document.hasFocus()) {
      audio.play().catch((err: any) => {
        console.error('Audio Play failed:', err)
      })
      // }
    },

    playSoundEffect(key: GameSoundEffectName) {
      if (!this.soundEffectsOn) {
        return
      }

      const audio = this.soundsEffects[key].audio
      if (audio) {
        this.soundEffectActive = key as GameSoundEffectName
        audio.volume = this.soundsEffects[key].volume
        audio.currentTime = 0
        this.playAudio(audio)
      }
    },

    playLoopSound(key: GameSoundName | '') {
      if (!key) {
        return
      }

      if (!this.soundsOn) {
        this.stopLoopSound()
        return
      }

      const audio = this.sounds[key].audio
      if (audio) {
        this.soundActive = key as GameSoundName
        audio.volume = this.sounds[key].volume
        audio.loop = true
        this.playAudio(audio)
      }
    },

    stopLoopSound() {
      if (this.soundActive) {
        const audio = this.sounds[this.soundActive as GameSoundName].audio

        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
      }
    },

    stopSoundEffect() {
      if (this.soundEffectActive) {
        const audio = this.soundsEffects[this.soundEffectActive as GameSoundEffectName].audio

        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
      }
    },

    updateSoundSetting(value: boolean) {
      this.soundsOn = value
      APIService.saveStoreData(API_KEYS.settings, {
        sound: this.soundsOn,
        soundEffects: this.soundEffectsOn,
      })
    },

    updateSoundEffectsSetting(value: boolean) {
      this.soundEffectsOn = value
      APIService.saveStoreData(API_KEYS.settings, {
        sound: this.soundsOn,
        soundEffects: this.soundEffectsOn,
      })
    },

    initializeSounds() {
      if (!this.initialized) {
        const settingsData = APIService.loadStoreData(API_KEYS.settings)

        if (settingsData) {
          if (settingsData.sound) {
            this.soundsOn = settingsData.sound
          }

          if (settingsData.soundEffects) {
            this.soundEffectsOn = settingsData.soundEffects
          }
        } else {
          this.soundsOn = true
          this.soundEffectsOn = true

          APIService.saveStoreData(API_KEYS.settings, {
            sound: this.soundsOn,
            soundEffects: this.soundEffectsOn,
          })
        }

        this.initialized = true
      }
    },
  },
})
