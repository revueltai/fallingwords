import { APP_LOCALSTORAGE_KEYS } from '@/configs/constants'
import { soundsConfig, soundsEffectsConfig } from '@/configs/sounds.config'
import APIService from '@/services/LocalStorageService'
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
    soundsEffects: soundsEffectsConfig,
    sounds: soundsConfig,
  }),

  actions: {
    playAudio(audio: HTMLAudioElement) {
      if (document.hasFocus()) {
        audio.play().catch((err: any) => {
          console.error('Audio Play failed:', err)
        })
      }
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
      APIService.saveStoreData(APP_LOCALSTORAGE_KEYS.settings, {
        sound: this.soundsOn,
        soundEffects: this.soundEffectsOn,
      })
    },

    updateSoundEffectsSetting(value: boolean) {
      this.soundEffectsOn = value
      APIService.saveStoreData(APP_LOCALSTORAGE_KEYS.settings, {
        sound: this.soundsOn,
        soundEffects: this.soundEffectsOn,
      })
    },

    initializeSounds() {
      if (!this.initialized) {
        const settingsData = APIService.loadStoreData(APP_LOCALSTORAGE_KEYS.settings)

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

          APIService.saveStoreData(APP_LOCALSTORAGE_KEYS.settings, {
            sound: this.soundsOn,
            soundEffects: this.soundEffectsOn,
          })
        }

        this.initialized = true
      }
    },
  },
})
