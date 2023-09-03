<script lang="ts" setup>
import { useUser } from '@/composables';
import {
  SfButton,
  SfLink,
  SfCheckbox,
  SfInput,
  SfLoaderCircular,
} from '@storefront-ui/vue';
import { useToast } from 'vue-toastification';

definePageMeta({
  layout: false,
});

const NuxtLink = resolveComponent('NuxtLink');
const toast = useToast();
const { error, loading, login } = useUser();

const form: any = ref({});
const rememberMe = ref<boolean>(false);

const handleLogin = async () => {
  // await login({
  //   email: form.value.email,
  //   password: form.value.password,
  // });

  if (!error.value.login) {
    toast.success('Welcome! You are logged in');
  } else {
    toast.error(error?.value?.login);
  }
};
</script>

<template>
  <div>
    <NuxtLayout name="auth" :heading="$t('auth.login.heading')">
      <form
        @submit.prevent="handleLogin"
        class="border-neutral-200 md:border flex flex-col gap-4 md:p-6 rounded-md"
      >
        <label>
          <FormLabel>{{ $t('form.emailLabel') }}</FormLabel>
          <SfInput
            name="email"
            type="email"
            autocomplete="email"
            v-model="form.email"
            required
          />
        </label>

        <label>
          <FormLabel>{{ $t('form.passwordLabel') }}</FormLabel>
          <FormPasswordInput
            name="password"
            autocomplete="current-password"
            v-model="form.password"
            required
          />
        </label>

        <label class="mt-2 flex items-center gap-2">
          <SfCheckbox name="rememberMe" v-model="rememberMe" />
          {{ $t('auth.login.rememberMeLabel') }}
        </label>

        <SfButton type="submit" class="mt-2" :disabled="loading">
          <SfLoaderCircular
            v-if="loading"
            class="flex justify-center items-center"
            size="base"
          />
          <span v-else>
            {{ $t('auth.login.submitLabel') }}
          </span>
        </SfButton>
        <SfButton :tag="NuxtLink" to="/reset-password" variant="tertiary">
          {{ $t('auth.login.forgotPasswordLabel') }}
        </SfButton>
      </form>

      <UiAlert
        class="mt-6 w-full p-4 md:p-6 !justify-start typography-text-base"
        variant="neutral"
      >
        <i18n-t
          tag="span"
          keypath="auth.login.createAccountBanner"
          scope="global"
        >
          <SfLink :tag="NuxtLink" to="/signup" variant="primary">
            {{ $t('auth.login.createAccountLinkLabel') }}
          </SfLink>
        </i18n-t>
      </UiAlert>
    </NuxtLayout>
  </div>
</template>
