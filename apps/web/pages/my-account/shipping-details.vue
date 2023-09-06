<script setup lang="ts">
import { useCheckout } from '@/composables';
import {
  SfButton,
  SfIconClose,
  SfModal,
  useDisclosure,
} from '@storefront-ui/vue';

definePageMeta({
  layout: 'account',
});

const { isOpen, open, close } = useDisclosure();
const { loadAddress, deleteAddress } = useCheckout();

// const shippingAddress = loadAddress();
const shippingAddress = ref([
  {
    id: 1,
    name: 'Hieronim',
    streetName: 'Oak Drive',
    city: 'Colonie',
    phoneNumber: '+1 321 765 0987',
    postalCode: '12205',
  },
  {
    id: 2,
    name: 'Mahade',
    streetName: 'Oak Drive',
    city: 'Colonie',
    phoneNumber: '+1 321 765 0987',
    postalCode: '12205',
  },
]);
</script>

<template>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <h2 class="typography-headline-4 font-bold">
    {{ $t('account.accountSettings.shippingDetails.shippingAddress') }}
  </h2>
  <div
    v-for="{
      id,
      name,
      streetName,
      city,
      country,
      phoneNumber,
      postalCode,
      state,
    } in shippingAddress"
    class="col-span-full"
  >
    <div class="block">
      <div class="flex justify-between">
        <div>
          <p>
            {{ name }}
          </p>
          <p>{{ phoneNumber }}</p>
          <p>{{ streetName }}</p>
          <p>
            {{ country }}, {{ city }}, {{ state }}
            {{ postalCode }}
          </p>
        </div>
        <div>
          <SfButton
            variant="tertiary"
            size="sm"
            class="self-start"
            @click="open"
            >Edit
          </SfButton>
          <SfButton
            variant="tertiary"
            size="sm"
            class="self-start !text-red-600"
            @click="deleteAddress(id)"
            >Delete
          </SfButton>
        </div>
      </div>
    </div>
  </div>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <UiOverlay v-if="isOpen" :visible="isOpen">
    <SfModal
      v-model="isOpen"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="address-modal-title"
    >
      <header>
        <SfButton
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="close"
        >
          <SfIconClose />
        </SfButton>
        <h3
          id="address-modal-title"
          class="text-neutral-900 text-lg md:text-2xl font-bold mb-4"
        >
          {{ $t('account.accountSettings.shippingDetails.shippingAddress') }}
        </h3>
      </header>
      <FormAddAddress
        :saved-address="shippingAddress"
        type="shippingAddress"
        @on-close="close"
      />
    </SfModal>
  </UiOverlay>
</template>
