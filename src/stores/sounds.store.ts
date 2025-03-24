import { defineStore } from 'pinia'

interface SoundState {
  soundsOn: boolean
  soundEffectsOn: boolean
  soundActive: GameSoundName | ''
  soundEffectActive: GameSoundEffectName | ''
  sounds: GameSoundsMap
  soundsEffects: GameSoundsEffectsMap
}

export const useSoundStore = defineStore('sound', {
  state: (): SoundState => ({
    soundsOn: true,
    soundEffectsOn: true,
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
    },
    sounds: {
      dashboardBg: {
        audio: new Audio('/sounds/dashboardBg.mp3'),
        volume: 0.5,
      },
      gameBg: {
        audio: new Audio('/sounds/gameBg.mp3'),
        volume: 0.2,
      },
    },
  }),

  actions: {
    playSoundEffect(key: GameSoundEffectName) {
      if (!this.soundEffectsOn) {
        return
      }

      const audio = this.soundsEffects[key].audio
      if (audio) {
        this.soundEffectActive = key as GameSoundEffectName
        audio.volume = this.soundsEffects[key].volume
        audio.currentTime = 0
        audio.play()
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
        audio.play()
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

    // toggleSound() {
    //   this.soundEffectsOn = !this.soundEffectsOn

    //   if (!this.soundEffectsOn) {
    //     for (const sound of Object.values(this.sounds)) {
    //       sound.pause()
    //     }
    //   }
    // },
  },
})
