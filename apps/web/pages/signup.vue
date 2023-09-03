<script setup lang="ts">
import { useUser } from '@/composables';
import {
  SfButton,
  SfInput,
  SfCheckbox,
  SfLink,
  SfModal,
  useDisclosure,
} from '@storefront-ui/vue';
import { useToast } from 'vue-toastification';

definePageMeta({
  layout: false,
});

const NuxtLink = resolveComponent('NuxtLink');
const { isOpen, open } = useDisclosure();
const toast = useToast();
const { error, loading, register } = useUser();

const form: any = ref({});
const createAccount = ref<boolean>(false);

const handleSignup = async () => {
  await register({
    name: form.value.name,
    email: form.value.email,
    password: form.value.password,
  });

  if (!error.value.login) {
    toast.success('Welcome! You are logged in');
  } else {
    toast.error(error?.value?.login);
  }
};
</script>

<template>
  <div>
    <NuxtLayout name="auth" :heading="$t('auth.signup.heading')">
      <form
        data-testid="signup-form"
        class="flex flex-col md:border md:border-neutral-200 rounded-md gap-4 md:p-6"
        @submit.prevent="
          open();
          handleSignup();
        "
      >
        <label>
          <FormLabel>{{ $t('form.NameLabel') }} *</FormLabel>
          <SfInput
            name="name"
            autocomplete="given-name"
            v-model="form.name"
            required
          />
        </label>
        <label>
          <FormLabel>{{ $t('form.emailLabel') }} *</FormLabel>
          <SfInput
            name="email"
            type="email"
            autocomplete="email"
            v-model="form.email"
            required
          />
        </label>
        <div>
          <label>
            <FormLabel>{{ $t('form.passwordLabel') }} *</FormLabel>
            <FormPasswordInput
              name="password"
              autocomplete="current-password"
              v-model="form.password"
              required
            />
            <FormHelperText class="mb-2">{{
              $t('form.passwordHint')
            }}</FormHelperText>
          </label>
        </div>

        <div class="flex items-center">
          <SfCheckbox
            id="terms"
            v-model="createAccount"
            value="value"
            class="peer"
            required
          />
          <label
            class="ml-3 text-base text-neutral-900 cursor-pointer font-body peer-disabled:text-disabled-900"
            for="terms"
          >
            *
            <i18n-t keypath="form.termsAndConditionsLabel" scope="global">
              <template #terms>
                <SfLink
                  href="#"
                  class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                >
                  {{ $t('termsAndConditions') }}
                </SfLink>
              </template>
            </i18n-t>
          </label>
        </div>
        <SfButton type="submit" size="lg" class="w-full">
          {{ $t('auth.signup.createButton') }}
        </SfButton>
      </form>

      <UiOverlay :visible="isOpen">
        <SfModal
          v-model="isOpen"
          class="max-w-[480px] inset-x-4 md:inset-x-0"
          tag="section"
          role="alertdialog"
          disable-click-away
          aria-labelledby="signUpModalTitle"
          aria-describedby="signUpModalDesc"
        >
          <header class="flex items-center flex-col">
            <NuxtImg
              src="/images/signup-success.svg"
              :alt="$t('auth.signup.modal.imageAlt')"
              width="192"
              height="192"
              class="my-6"
            />
            <h2
              id="signUpModalTitle"
              class="mt-6 mb-4 font-bold typography-headline-3"
            >
              {{ $t('auth.signup.modal.heading') }}
            </h2>
          </header>
          <UiAlert
            class="w-full p-4 mb-6 !justify-start typography-text-base"
            variant="neutral"
          >
            <i18n-t
              keypath="auth.signup.modal.description"
              scope="global"
              tag="p"
              id="signUpModalDesc"
            >
              <template #information>
                <SfLink
                  :tag="NuxtLink"
                  to="/my-account"
                  class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                >
                  {{ $t('auth.signup.modal.information') }}
                </SfLink>
              </template>
            </i18n-t>
          </UiAlert>

          <footer class="flex justify-end">
            <SfButton type="button" :tag="NuxtLink" to="/" class="w-full">
              {{ $t('auth.signup.modal.button') }}
            </SfButton>
          </footer>
        </SfModal>
      </UiOverlay>
    </NuxtLayout>
  </div>
</template>
