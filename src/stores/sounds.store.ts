import { soundsConfig, soundsEffectsConfig } from '@/configs/sounds.config'
import { defineStore } from 'pinia'

interface SoundState {
  initialized: boolean
  soundsOn: boolean
  soundEffectsOn: boolean
  soundActive: GameSoundName | ''
  soundEffectActive: GameSoundEffectName | ''
  sounds: GameSoundsMap
  soundsEffects: GameSoundsEffectsMap
}

export const useSoundStore = defineStore('sound', {
  state: (): SoundState => ({
    initialized: false,
    soundsOn: false,
    soundEffectsOn: false,
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

    async updateSoundSetting(value: boolean) {
      this.soundsOn = value
    },

    async updateSoundEffectsSetting(value: boolean) {
      this.soundEffectsOn = value
    },

    async initializeSounds(hasSound: boolean, hasEffects: boolean) {
      if (!this.initialized) {
        await this.updateSoundSetting(hasSound)
        await this.updateSoundEffectsSetting(hasEffects)

        this.initialized = true
      }
    },
  },
})
