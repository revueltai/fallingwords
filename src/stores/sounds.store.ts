import { defineStore } from 'pinia'

interface SoundState {
  soundsOn: boolean
  soundEffectsOn: boolean
  sounds: SoundsMap
  soundsEffects: SoundsEffectsMap
}

export const useSoundStore = defineStore('sound', {
  state: (): SoundState => ({
    soundsOn: true,
    soundEffectsOn: true,
    soundsEffects: {
      buttonClick: new Audio('/sounds/uiButtonClick.wav'),
      fire: new Audio('/sounds/powerupFire.wav'),
      ice: new Audio('/sounds/powerupIce.wav'),
      wind: new Audio('/sounds/powerupWind.mp3'),
      characterMove: new Audio('/sounds/characterMove.wav'),
      characterChew: new Audio('/sounds/characterChew.wav'),
      characterLike: new Audio('/sounds/characterLike.wav'),
      characterDislike: new Audio('/sounds/characterDislike.wav'),
      characterLove: new Audio('/sounds/characterLove.wav'),
      gameTick: new Audio('/sounds/gameTick.wav'),
      gameTilePop: new Audio('/sounds/gameTilePop.wav'),
    },
    sounds: {
      // dashboardBgm: new Audio('/sounds/dashboard-bgm.mp3'),
      // gameBgm: new Audio('/sounds/game-bgm.mp3'),
    },
  }),

  actions: {
    playSoundEffect(key: SoundName) {
      if (!this.soundEffectsOn) {
        return
      }

      const sound = this.soundsEffects[key]
      if (sound) {
        sound.currentTime = 0
        sound.play()
      }
    },

    playSound(key: SoundName) {
      if (!this.soundEffectsOn) {
        return
      }

      const sound = this.soundsEffects[key]
      if (sound) {
        sound.loop = true
        sound.play()
      }
    },

    // stopSound(key: SoundName) {
    //   const sound = this.sounds[key]

    //   if (sound) {
    //     sound.pause()
    //     sound.currentTime = 0
    //   }
    // },

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
