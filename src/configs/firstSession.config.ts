import FirstSessionStep3 from '@/components/ui/first-session/FirstSessionStep3.vue'
import FirstSessionStep4 from '@/components/ui/first-session/FirstSessionStep4.vue'
import { FirstSessionMouthChew, MouthHungry, MouthIdle, MouthOpen, MouthSweat } from '@/configs/assets.config'
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
      className: 'bg-',
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
      top: 'When we play, [letters]%primary% fall down. ',
      bottom: 'I must eat the right ones!',
    },
    content: () => h(FirstSessionStep4),
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
]
