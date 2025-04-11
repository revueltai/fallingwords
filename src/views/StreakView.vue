<script setup lang="ts">
import PageContainer from '@/components/ui/PageContainer.vue'
import PageContent from '@/components/ui/PageContent.vue'
import Streak from '@/components/ui/Streak.vue'
import { useStreakStore } from '@/stores/streak.store'
import { renderPluralWord } from '@/utils'

const streakStore = useStreakStore()

const hasStreak = streakStore.currentStreak > 0
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
          :class="hasStreak ? 'bg-secondary border-secondary-light' : 'bg-quaternary-dark border-quaternary-light'"
          class="anim-scale-in-timed rounded-[32px] border border-b-4 w-60 mx-auto flex items-center justify-center gap-2 pt-2 pb-4 pl-2 pr-8 mt-6"
        >
          <Icon
            name="streak"
            size="6xl"
          />

          <div class="relative inline-block">
            <div class="text-9xl absolute inset-0 z-10">
              {{ streakStore.currentStreak }}
            </div>

            <div
              class="text-9xl"
              :class="hasStreak ? 'text-stroke' : 'text-stroke-empty'"
            >
              {{ streakStore.currentStreak }}
            </div>
          </div>
        </div>

        <p class="text-center text-lg mt-8 mb-2">
          {{ $t('youHaveAStreakOf') }}

          <strong :class="hasStreak ? 'text-quinary-light' : 'text-quaternary-light'">
            {{ streakStore.currentStreak }} {{ renderPluralWord('Day', streakStore.currentStreak) }}.
          </strong>
        </p>

        <div class="mb-8 sm:mb-16">
          <p
            v-if="hasStreak"
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
        <p class="mb-4 pl-4 text-md text-primary">
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
