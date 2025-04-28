<script setup lang="ts">
import PageContainer from '@/components/ui/PageContainer.vue'
import PageContent from '@/components/ui/PageContent.vue'
import Streak from '@/components/ui/Streak.vue'
import { useStreakStore } from '@/stores/streak.store'
import { isMobile, renderPluralWord } from '@/utils'

const streakStore = useStreakStore()
</script>

<template>
  <PageContainer
    :heading="$t('streakDays')"
    :subheading="$t('keepStreak')"
  >
    <PageContent
      :is-empty="false"
      :has-footer="false"
      columns="1"
    >
      <div>
        <div
          :class="streakStore.hasStreak ? 'bg-secondary border-secondary-light' : 'bg-quaternary-dark border-quaternary-light'"
          class="anim-scale-in-timed rounded-[32px] border border-b-4 w-60 mx-auto flex items-center justify-center gap-2 pt-2 pb-4 pl-2 pr-8 mt-6"
        >
          <Icon
            name="streak"
            :size="isMobile() ? '3xl' : '6xl'"
          />

          <div class="relative inline-block">
            <div class="absolute inset-0 z-10 text-6xl sm:text-9xl">
              {{ streakStore.currentStreak }}
            </div>

            <div
              class="text-6xl sm:text-9xl"
              :class="streakStore.hasStreak ? 'text-stroke' : 'text-stroke-empty'"
            >
              {{ streakStore.currentStreak }}
            </div>
          </div>
        </div>

        <p class="text-center text-lg mt-8 mb-2">
          {{ $t('youHaveAStreakOf') }}

          <strong :class="streakStore.hasStreak ? 'text-quinary-light' : 'text-quaternary-light'">
            {{ streakStore.currentStreak }} {{ renderPluralWord('Day', streakStore.currentStreak) }}.
          </strong>
        </p>

        <div class="mb-8 sm:mb-16">
          <p
            v-if="streakStore.hasStreak"
            class="text-center"
          >
            {{ $t('keepUpGoodWork') }}
          </p>

          <p
            v-else
            class="text-center"
          >
            {{ $t('playToBuildStreak') }}
          </p>
        </div>
      </div>

      <div>
        <p class="mb-4 pl-4 text-primary text-sm sm:text-md">
          {{ $t('yourWeeklyProgress') }}
        </p>

        <Streak />
      </div>
    </PageContent>
  </PageContainer>
</template>

<style>
.text-stroke {
  -webkit-text-stroke: 12px var(--color-quinary);
}

.text-stroke-empty {
  -webkit-text-stroke: 12px var(--color-quaternary-light);
}
</style>
