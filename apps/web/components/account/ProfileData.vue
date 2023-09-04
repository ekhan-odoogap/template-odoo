<template>
  <div class="md:mx-4" data-testid="account-data">
    <div class="flex justify-between my-2">
      <h2 class="typography-headline-4 font-bold">{{ header }}</h2>
      <div>
        <SfButton
          variant="tertiary"
          size="sm"
          class="self-start"
          @click="$emit('on-click')"
          >{{ buttonText }}</SfButton
        >
        <SfButton
          v-if="deleteButton"
          variant="tertiary"
          size="sm"
          class="self-start !text-red-600"
          @click="$emit('on-click')"
          >{{ deleteButton }}</SfButton
        >
      </div>
    </div>
    <div class="my-2">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { SfButton } from '@storefront-ui/vue';

defineProps({
  header: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    required: false,
  },
  deleteButton: {
    type: String,
    required: false,
  },
});
defineEmits(['on-click']);
</script>
