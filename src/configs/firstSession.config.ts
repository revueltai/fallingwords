import FirstSessionStep3 from '@/components/ui/first-session/FirstSessionStep3.vue'
import FirstSessionStep4 from '@/components/ui/first-session/FirstSessionStep4.vue'
import FirstSessionStep5 from '@/components/ui/first-session/FirstSessionStep5.vue'
import FirstSessionStep6 from '@/components/ui/first-session/FirstSessionStep6.vue'
import FirstSessionStep7 from '@/components/ui/first-session/FirstSessionStep7.vue'
import FirstSessionStep8 from '@/components/ui/first-session/FirstSessionStep8.vue'
import { FirstSessionMouthChew, FirstSessionMouthLove, MouthHungry, MouthIdle, MouthOpen, MouthSweat } from '@/configs/assets.config'
import { h } from 'vue'

export default [
  {
    asset: {
      name: MouthOpen,
      className: '-rotate-12',
    },
    icon: null,
    text: {
      top: 'Hi! I’m [DOT]%senary-light%!',
      bottom: 'Nice to meet you!',
    },
    content: null,
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    asset: {
      name: MouthSweat,
      className: '',
    },
    icon: null,
    text: {
      top: 'I’m hungry for learning!',
      bottom: 'But I don’t eat just anything...',
    },
    content: null,
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    asset: {
      name: MouthHungry,
      className: '',
    },
    icon: null,
    text: {
      top: 'I need [YOU]%quinary-light% to create [Words]%primary%',
      bottom: 'for me to eat!',
    },
    content: null,
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    asset: {
      name: MouthIdle,
      className: '',
    },
    icon: {
      name: 'word',
      color: 'white',
    },
    text: {
      top: 'Each word has two parts:',
      bottom: 'One in [your language]%senary-light%, [one to learn]%tertiary-light%!',
    },
    content: () => h(FirstSessionStep3),
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    asset: {
      name: FirstSessionMouthChew,
      className: '',
    },
    icon: null,
    text: {
      top: 'When we play, [letters]%primary% fall down.',
      bottom: 'I must eat the right ones!',
    },
    content: () => h(FirstSessionStep4),
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    asset: {
      name: FirstSessionMouthChew,
      className: '',
    },
    icon: null,
    text: {
      top: 'Be careful! Not all letters belong.',
      bottom: 'If I eat the wrong ones… [I lose a life]%quaternary-light%!',
    },
    content: () => h(FirstSessionStep5),
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    asset: {
      name: FirstSessionMouthLove,
      className: '',
    },
    icon: null,
    text: {
      top: '[Power-ups]%quinary-light% help me munch the right',
      bottom: 'letters and make learning easier!',
    },
    content: () => h(FirstSessionStep6),
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    asset: {
      name: MouthIdle,
      className: '',
    },
    icon: {
      name: 'collection',
      color: 'white',
      type: 'fill',
    },
    text: {
      top: 'Create [Collections]%primary% to store words,',
      bottom: 'feed me, practice and learn!',
    },
    content: () => h(FirstSessionStep7),
    cta: {
      text: 'Save Collection',
      action: 'validate',
    },
  },
  {
    asset: {
      name: MouthIdle,
      className: '',
    },
    icon: {
      name: 'word',
      color: 'white',
      type: 'stroke',
    },
    text: {
      top: 'Great! Now let’s add your first [Word]%primary%',
      bottom: 'in your [Collection]%primary%',
    },
    content: () => h(FirstSessionStep8),
    cta: {
      text: 'Save Collection',
      action: 'validate',
    },
  },
]
