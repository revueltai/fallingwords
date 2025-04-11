import FirstSessionStep1 from '@/components/ui/first-session/FirstSessionStep1.vue'
import FirstSessionStep2 from '@/components/ui/first-session/FirstSessionStep2.vue'
import FirstSessionStep3 from '@/components/ui/first-session/FirstSessionStep3.vue'
import FirstSessionStep4 from '@/components/ui/first-session/FirstSessionStep4.vue'
import FirstSessionStep5 from '@/components/ui/first-session/FirstSessionStep5.vue'
import FirstSessionStep6 from '@/components/ui/first-session/FirstSessionStep6.vue'
import FirstSessionStep7 from '@/components/ui/first-session/FirstSessionStep7.vue'
import FirstSessionStep8 from '@/components/ui/first-session/FirstSessionStep8.vue'
import FirstSessionStep9 from '@/components/ui/first-session/FirstSessionStep9.vue'
import FirstSessionStep10 from '@/components/ui/first-session/FirstSessionStep10.vue'
import {
  FirstSessionMouthChew,
  FirstSessionMouthChewBg,
  FirstSessionMouthChewDislike,
  FirstSessionMouthLove,
  MouthBlush,
  MouthHungry,
  MouthIdle,
  MouthLove,
  MouthOpen,
  MouthSurprised,
  MouthSweat,
} from '@/configs/assets.config'

export default [
  {
    id: 'intro',
    bgAsset: null,
    asset: {
      name: MouthOpen,
      className: '',
    },
    icon: null,
    text: {
      top: 'fsIntroTop',
      bottom: 'fsIntroBottom',
    },
    content: null,
    cta: {
      text: 'continue',
      action: 'next',
    },
  },
  {
    id: 'nativeLocalePrompt',
    bgAsset: null,
    asset: {
      name: MouthOpen,
      className: '-rotate-12',
    },
    icon: null,
    text: {
      top: 'fsNativeLocalePromptTop',
      bottom: 'fsNativeLocalePromptBottom',
    },
    content: FirstSessionStep1,
    cta: {
      text: 'continue',
      action: 'validate',
    },
  },
  {
    id: 'learnLocalePrompt',
    asset: {
      name: MouthOpen,
      className: 'rotate-12',
    },
    icon: null,
    text: {
      top: 'fsLearnLocalePromptTop',
      bottom: 'fsLearnLocalePromptBottom',
    },
    content: FirstSessionStep2,
    cta: {
      text: 'continue',
      action: 'validate',
    },
  },
  {
    id: 'eating',
    bgAsset: null,
    asset: {
      name: MouthSweat,
      className: '',
    },
    icon: null,
    text: {
      top: 'fsEatingTop',
      bottom: 'fsEatingBottom',
    },
    content: null,
    cta: {
      text: 'continue',
      action: 'next',
    },
  },
  {
    id: 'createWords',
    bgAsset: null,
    asset: {
      name: MouthHungry,
      className: '',
    },
    icon: null,
    text: {
      top: 'fsCreateWordsTop',
      bottom: 'fsCreateWordsBottom',
    },
    content: null,
    cta: {
      text: 'continue',
      action: 'next',
    },
  },
  {
    id: 'wordsParts',
    bgAsset: null,
    asset: {
      name: MouthIdle,
      className: '',
    },
    icon: {
      name: 'word',
      color: 'white',
    },
    text: {
      top: 'fsWordsPartsTop',
      bottom: 'fsWordsPartsBottom',
    },
    content: FirstSessionStep3,
    cta: {
      text: 'continue',
      action: 'next',
    },
  },
  {
    id: 'eatCorrectLetters',
    bgAsset: {
      name: FirstSessionMouthChewBg,
      className: '',
    },
    asset: {
      name: FirstSessionMouthChew,
      className: '',
    },
    icon: null,
    text: {
      top: 'fsEatCorrectLettersTop',
      bottom: 'fsEatCorrectLettersBottom',
    },
    content: FirstSessionStep4,
    cta: {
      text: 'continue',
      action: 'next',
    },
  },
  {
    id: 'avoidWrongLetters',
    bgAsset: {
      name: FirstSessionMouthChewBg,
      className: '',
    },
    asset: {
      name: FirstSessionMouthChewDislike,
      className: '',
    },
    icon: null,
    text: {
      top: 'fsAvoidWrongLettersTop',
      bottom: 'fsAvoidWrongLettersBottom',
    },
    content: FirstSessionStep5,
    cta: {
      text: 'continue',
      action: 'next',
    },
  },
  {
    id: 'powerups',
    bgAsset: null,
    asset: {
      name: FirstSessionMouthLove,
      className: '',
    },
    icon: null,
    text: {
      top: 'fsPowerupsTop',
      bottom: 'fsPowerupsBottom',
    },
    content: FirstSessionStep6,
    cta: {
      text: 'continue',
      action: 'next',
    },
  },
  {
    id: 'gems',
    bgAsset: null,
    asset: {
      name: MouthSurprised,
      className: '',
    },
    icon: {
      name: 'gem',
      type: 'fill',
    },
    text: {
      top: 'fsGemsTop',
      bottom: 'fsGemsBottom',
    },
    content: FirstSessionStep10,
    cta: {
      text: 'continue',
      action: 'next',
    },
  },
  {
    id: 'collectionsPrompt',
    bgAsset: null,
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
      top: 'fsCollectionsPromptTop',
      bottom: 'fsCollectionsPromptBottom',
    },
    content: FirstSessionStep7,
    cta: {
      text: 'saveCollection',
      action: 'validate',
    },
  },
  {
    id: 'wordsPrompt',
    bgAsset: null,
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
      top: 'fsWordsPromptTop',
      bottom: 'fsWordsPromptBottom',
    },
    content: FirstSessionStep8,
    cta: {
      text: 'saveWord',
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
      top: 'fsCreateAccountPromptTop',
      bottom: 'fsCreateAccountPromptBottom',
    },
    content: FirstSessionStep9,
    cta: {
      text: 'createAccount',
      color: 'tertiary',
      action: 'validate',
    },
  },
  {
    id: 'end',
    bgAsset: null,
    asset: {
      name: MouthBlush,
      className: '',
    },
    icon: null,
    text: {
      top: 'fsEndTop',
      bottom: 'fsEndBottom',
    },
    content: null,
    cta: {
      text: 'letsStart',
      action: 'end',
    },
  },
]
