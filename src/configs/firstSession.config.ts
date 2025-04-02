import FirstSessionStep1 from '@/components/ui/first-session/FirstSessionStep1.vue'
import FirstSessionStep3 from '@/components/ui/first-session/FirstSessionStep3.vue'
import FirstSessionStep4 from '@/components/ui/first-session/FirstSessionStep4.vue'
import FirstSessionStep5 from '@/components/ui/first-session/FirstSessionStep5.vue'
import FirstSessionStep6 from '@/components/ui/first-session/FirstSessionStep6.vue'
import FirstSessionStep7 from '@/components/ui/first-session/FirstSessionStep7.vue'
import FirstSessionStep8 from '@/components/ui/first-session/FirstSessionStep8.vue'
import FirstSessionStep9 from '@/components/ui/first-session/FirstSessionStep9.vue'
import {
  FirstSessionMouthChew,
  FirstSessionMouthLove,
  MouthBlush,
  MouthHungry,
  MouthIdle,
  MouthLove,
  MouthOpen,
  MouthSweat,
} from '@/configs/assets.config'

export default [
  {
    id: 'intro',
    asset: {
      name: MouthOpen,
      className: '',
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
    id: 'nativeLocalePrompt',
    asset: {
      name: MouthOpen,
      className: '-rotate-12',
    },
    icon: null,
    text: {
      top: 'Before we start,',
      bottom: 'what’s your native language?',
    },
    content: FirstSessionStep1,
    cta: {
      text: 'Continue',
      action: 'validate',
    },
  },
  {
    id: 'eating',
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
    id: 'createWords',
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
    id: 'wordsParts',
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
    content: FirstSessionStep3,
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    id: 'eatCorrectLetters',
    asset: {
      name: FirstSessionMouthChew,
      className: '',
    },
    icon: null,
    text: {
      top: 'When we play, [letters]%primary% fall down.',
      bottom: 'I must eat the right ones!',
    },
    content: FirstSessionStep4,
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    id: 'avoidWrongLetters',
    asset: {
      name: FirstSessionMouthChew,
      className: '',
    },
    icon: null,
    text: {
      top: 'Be careful! Not all letters belong.',
      bottom: 'If I eat the wrong ones… [I lose a life]%quaternary-light%!',
    },
    content: FirstSessionStep5,
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    id: 'powerups',
    asset: {
      name: FirstSessionMouthLove,
      className: '',
    },
    icon: null,
    text: {
      top: '[Power-ups]%quinary-light% help me munch the right',
      bottom: 'letters and make learning easier!',
    },
    content: FirstSessionStep6,
    cta: {
      text: 'Continue',
      action: 'next',
    },
  },
  {
    id: 'collectionsPrompt',
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
    content: FirstSessionStep7,
    cta: {
      text: 'Save Collection',
      action: 'validate',
    },
  },
  {
    id: 'wordsPrompt',
    asset: {
      name: MouthLove,
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
    content: FirstSessionStep8,
    cta: {
      text: 'Save Word',
      action: 'validate',
    },
  },
  {
    id: 'createAccountPrompt',
    asset: null,
    icon: {
      name: 'word',
      color: 'white',
      type: 'stroke',
    },
    text: {
      top: 'Let’s set up your account',
      bottom: 'so we keep feeding me!',
    },
    content: FirstSessionStep9,
    cta: {
      text: 'Create Account',
      color: 'tertiary',
      action: 'validate',
    },
  },
  {
    id: 'end',
    asset: {
      name: MouthBlush,
      className: '',
    },
    icon: null,
    text: {
      top: 'You’re all set! Let’s start learning',
      bottom: 'and having fun together!',
    },
    content: null,
    cta: {
      text: 'Let’s Start!',
      action: 'end',
    },
  },
]
