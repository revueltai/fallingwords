<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4 min-w-64">
      <h3 class="text-sm text-primary">
        {{ $t('creditsHeading') }}
      </h3>

      <Button
        type="link"
        to="https://www.iamnacho.com/?ref=fallingwords"
        class="text-center block mx-auto"
      >
        <img
          src="/images/shared/logoIamnacho.svg"
          alt="iamnacho"
          width="48"
          height="48"
          class="w-20 h-20"
        >
      </Button>

      <div class="flex gap-3 justify-center">
        <Button
          type="link"
          to="https://github.com/revueltai/fallingwords"
          size="xs"
        >
          <Icon
            name="github"
            size="md"
            stroke-width="1"
            color="primary"
          />

          {{ $t('creditsRepoFw') }}
        </Button>

        <Button
          type="link"
          to="https://github.com/revueltai"
          size="xs"
        >
          <Icon
            name="github"
            size="md"
            stroke-width="1"
            color="primary"
          />

          {{ $t('creditsRepoPersonal') }}
        </Button>
      </div>
    </div>

    <div class="flex flex-col gap-1 min-w-64 border-t border-senary-dark pt-6">
      <div class="grid grid-cols-2 gap-3">
        <h4 class="text-xs text-primary-dark text-right">
          {{ $t('creditsIcons') }}
        </h4>

        <div class="flex flex-col items-start">
          <Button
            type="link"
            to="https://lucide.dev/"
            size="xs"
          >
            lucide.dev
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <h4 class="text-xs text-primary-dark text-right">
          {{ $t('soundEffects') }}
        </h4>

        <div class="flex flex-col items-start">
          <Button
            type="link"
            to="https://pixabay.com/"
            size="xs"
          >
            pixabay.com
          </Button>

          <Button
            type="link"
            to="https://freesound.org/"
            size="xs"
          >
            freesound.org
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
