<script lang="ts" setup>
import { useCheckout, useCountrySearch } from '@/composables';
import {
  SfButton,
  SfCheckbox,
  SfInput,
  SfLoaderCircular,
  SfSelect,
} from '@storefront-ui/vue';
import { useToast } from 'vue-toastification';

const emit = defineEmits(['on-save', 'on-close']);
const props = defineProps({
  savedAddress: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const { savedAddress, type }: any = toRefs(props);
const toast = useToast();
const {
  loading,
  error,
  updateShippingAddress,
  updateBillingAddress,
  useShippingAsBillingAddress,
} = useCheckout();
const {
  loading: loadingCounties,
  error: loadCountryError,
  countries,
  countryStates,
  searchCountries,
  searchCountryStates,
} = useCountrySearch();

// await searchCountries();

const form: any = ref({
  name: savedAddress.value?.name || '',
  streetName: savedAddress?.value?.streetName || '',
  phone: savedAddress?.value?.phoneNumber || '',
  state: { id: ' ' },
  country: { id: ' ' },
  city: savedAddress?.value?.city || '',
  postalCode: savedAddress?.value?.postalCode || '',
});

if (form?.country?.id && form.country.id !== 'null') {
  await searchCountryStates(parseInt(form.country.id));
}
// watch(
//   () => form.country.id,
//   async () => {
//     await searchCountryStates(form.country.id);
//     if (!countryStates.value || countryStates.value.length === 0) {
//       form.state.id = null;
//     }
//   }
// );

const updateAddress = async () => {
  if (type.value === 'shippingAddress') {
    const response = await updateShippingAddress({
      params: {
        ...form,
        countryId: Number(form.country.id),
        stateId: Number(form.state.id),
        type: 'Shipping',
      },
      customQuery: {
        shippingAddAdress: 'customAddAddress',
        shippingUpdateAddress: 'customUpdateAddress',
      },
    });
    if (response) {
      toast.success('Successfully Updated');
      emit('on-close');
    } else {
      toast.error(error.updateShippingAddress);
    }
  }
  if (type.value === 'billingAddress') {
    const response = await updateBillingAddress({
      params: {
        ...form,
        countryId: Number(form.country.id),
        stateId: Number(form.state.id),
        type: 'Billing',
      },
      customQuery: {
        billingUpdateAddress: 'customUpdateAddress',
        billingAddAddress: 'customAddAddress',
      },
    });
    if (response) {
      toast.success('Successfully Updated');
      emit('on-close');
    } else {
      toast.error(error.updateShippingAddress);
    }
  }
};

const sameAsShipping = ref(false);
const handleCheckSameAddress = async () => {
  sameAsShipping.value = !sameAsShipping.value;
  if (sameAsShipping.value) {
    const shippingAddress = await useShippingAsBillingAddress();
    form.value = shippingAddress;
    await searchCountryStates(form.value?.country?.id);
  }
};
</script>

<template>
  <form
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="address-form"
    @submit.prevent="$emit('on-close')"
  >
    <label>
      <FormLabel>{{ $t('form.NameLabel') }}</FormLabel>
      <SfInput
        name="name"
        autocomplete="given-name"
        v-model="form.name"
        required
      />
    </label>
    <label class="md:col-span-2">
      <FormLabel>{{ $t('form.streetNameLabel') }}</FormLabel>
      <SfInput
        name="streetName"
        autocomplete="family-name"
        v-model="form.streetName"
        required
      />
    </label>
    <label class="md:col-span-3">
      <FormLabel>{{ $t('form.phoneLabel') }}</FormLabel>
      <SfInput
        name="phone"
        type="tel"
        autocomplete="tel"
        v-model="form.phone"
        required
      />
    </label>
    <label class="md:col-span-3">
      <FormLabel>{{ $t('form.countryLabel') }}</FormLabel>
      <SfSelect
        v-model="form.country.id"
        name="country"
        :placeholder="$t('form.selectPlaceholder')"
        autocomplete="country-name"
        required
      >
        <option
          v-for="country in countries"
          :key="country.id"
          :value="country.id"
        >
          {{ country.name }}
        </option>
      </SfSelect>
    </label>
    <label class="md:col-span-3">
      <FormLabel>{{ $t('form.stateLabel') }}</FormLabel>
      <SfSelect
        v-model="form.state.id"
        name="state"
        :placeholder="$t('form.selectPlaceholder')"
        autocomplete="state-name"
        required
      >
        <option
          v-for="state in countryStates"
          :key="state.id"
          :value="state.id"
        >
          {{ state.name }}
        </option>
      </SfSelect>
    </label>

    <label class="md:col-span-2">
      <FormLabel>{{ $t('form.cityLabel') }}</FormLabel>
      <SfInput
        name="city"
        autocomplete="address-level2"
        v-model="form.city"
        required
      />
    </label>
    <label>
      <FormLabel>{{ $t('form.postalCodeLabel') }}</FormLabel>
      <SfInput
        name="postalCode"
        autocomplete="postal-code"
        v-model="form.postalCode"
        required
      />
    </label>

    <label
      v-if="props.type === 'billingAddress'"
      class="md:col-span-3 flex items-center gap-2"
    >
      <SfCheckbox
        name="useAsShipping"
        :selected="sameAsShipping"
        @change="handleCheckSameAddress"
      />
      {{ $t('form.useAsShippingLabel') }}
    </label>

    <div
      class="md:col-span-3 flex flex-col-reverse md:flex-row justify-end mt-6 gap-4"
    >
      <SfButton
        type="reset"
        class=""
        variant="secondary"
        @click="$emit('on-close')"
      >
        {{ $t('contactInfo.cancel') }}
      </SfButton>
      <SfButton type="submit" class="min-w-[120px]" :disabled="loading">
        <SfLoaderCircular
          v-if="loading"
          class="flex justify-center items-center"
          size="sm"
        />
        <span v-else>
          {{ $t('contactInfo.save') }}
        </span>
      </SfButton>
    </div>
  </form>
</template>
