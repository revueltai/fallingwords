import { defineStore } from 'pinia'

interface SoundState {
  soundOn: boolean
  sounds: SoundsMap
}

export const useSoundStore = defineStore('sound', {
  state: (): SoundState => ({
    soundOn: true,
    sounds: {
      buttonClick: new Audio('/sounds/uiButtonClick.wav'),
      fire: new Audio('/sounds/powerupFire.wav'),
      ice: new Audio('/sounds/powerupIce.wav'),
      wind: new Audio('/sounds/powerupWind.mp3'),
      characterMove: new Audio('/sounds/characterMove.wav'),
      // characterEat: new Audio('/sounds/characterEat.mp3'),
      // characterLike: new Audio('/sounds/character-like.mp3'),
      // characterDislike: new Audio('/sounds/character-dislike.mp3'),
      // characterSuperLike: new Audio('/sounds/character-super-like.mp3'),
      // dashboardBgm: new Audio('/sounds/dashboard-bgm.mp3'),
      // gameBgm: new Audio('/sounds/game-bgm.mp3'),
    },
  }),

  actions: {
    playSound(key: SoundName) {
      if (!this.soundOn) {
        return
      }

      const sound = this.sounds[key]
      if (sound) {
        sound.currentTime = 0
        sound.play()
      }
    },
    playLoop(key: SoundName) {
      if (!this.soundOn) {
        return
      }

      const sound = this.sounds[key]
      if (sound) {
        sound.loop = true
        sound.play()
      }
    },

    stopSound(key: SoundName) {
      const sound = this.sounds[key]

      if (sound) {
        sound.pause()
        sound.currentTime = 0
      }
    },

    toggleSound() {
      this.soundOn = !this.soundOn

      if (!this.soundOn) {
        for (const sound of Object.values(this.sounds)) {
          sound.pause()
        }
      }
    },
  },
})
