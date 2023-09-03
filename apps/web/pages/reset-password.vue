<script setup lang="ts">
import { useUser } from '@/composables';
import { SfButton, SfInput } from '@storefront-ui/vue';
import toastClient from 'plugins/toast.client';
import { useToast } from 'vue-toastification';

definePageMeta({
  layout: false,
});

const NuxtLink = resolveComponent('NuxtLink');
const router = useRouter();

const toast = useToast();
const { error, loading, sendResetPassword } = useUser();

const form: any = ref({});
const isForgottenPassword = ref<boolean>(false);
const handleResetPassword = async () => {
  await sendResetPassword({ email: form.value.email });
  if (isForgottenPassword.value) {
    toast.success(
      `Thanks! If there is an account registered with the ${form.value.email} email, you will find message with a password reset link in your inbox. If the message is not arriving in your inbox, try another email address you might’ve used to register.`
    );
  }
  if (!error.value.resetPassword) {
    router.push('/reset-password-success');
  } else {
    toast.error(error?.value?.resetPassword);
  }
};
</script>

<template>
  <div>
    <NuxtLayout name="auth" :heading="$t('auth.resetPassword.heading')">
      <form
        class="pb-4 md:p-6 mt-10 md:border md:border-neutral-200 rounded-md"
        @submit.prevent="handleResetPassword"
      >
        <p class="mb-6">
          {{ $t('auth.resetPassword.info') }}
        </p>
        <label>
          <FormLabel>{{ $t('auth.resetPassword.email') }}</FormLabel>
          <SfInput name="email" type="email" v-model="form.email" required />
        </label>
        <div class="mt-6 flex flex-col-reverse md:flex-row gap-4">
          <SfButton
            :tag="NuxtLink"
            to="/login"
            class="flex-1"
            variant="tertiary"
          >
            {{ $t('auth.resetPassword.backToLogin') }}
          </SfButton>
          <SfButton type="submit" class="flex-1">
            {{ $t('auth.resetPassword.continue') }}
          </SfButton>
        </div>
      </form>
    </NuxtLayout>
  </div>
</template>
