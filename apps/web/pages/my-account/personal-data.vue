<script setup lang="ts">
import { useUser } from '@/composables';
import {
  SfButton,
  SfIconClose,
  SfModal,
  useDisclosure,
  SfInput,
  SfIconVisibility,
  SfLoaderCircular,
} from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';
import { useToast } from 'vue-toastification';

definePageMeta({
  layout: 'account',
});

const { isOpen, open, close } = useDisclosure();
const toast = useToast();
const { loading, error, updateUser, user } = useUser();

const lastActiveElement = ref();
const modalElement = ref();
const openedForm = ref('');
const passwordVisible = ref(false);
const firstNewPasswordVisible = ref(false);
const secondNewPasswordVisible = ref(false);

const userPasswords: any = ref({});

const openModal = async (modalName: string) => {
  openedForm.value = modalName;
  lastActiveElement.value = document.activeElement;
  open();
  await nextTick();
  unrefElement(modalElement).focus();
};
const closeModal = () => {
  close();
  lastActiveElement.value.focus();
};

const form: any = ref({});
const handleUpdateUser = async () => {
  const response = await updateUser({
    user: {
      ...user,
      name: form.value.name,
      email: form.value.email,
    },
  });
  if (response) {
    toast.success('Successfully updated!');
    closeModal();
  }
  if (error.updateUser) {
    toast.success(error.value.updateUser);
  }
};

const handleUpdatePassword = async () => {
  // const response = await updatePassword(
  //   form.value.currentPassword,
  //   form.value.newPassword
  // );

  if (response) {
    toast.success('Successfully updated!');
    closeModal();
  } else {
    toast.success(error.value.updateUser);
  }
};
</script>

<template>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <AccountProfileData
    class="col-span-3"
    :header="'Profile'"
    :button-text="$t('account.accountSettings.personalData.edit')"
    @on-click="openModal('profile')"
  >
    <p>Mahade Hasan</p>
    <p>mahade@gmail.com</p>
  </AccountProfileData>

  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <AccountProfileData
    class="col-span-3"
    :header="$t('account.accountSettings.personalData.yourPassword')"
    :button-text="$t('account.accountSettings.personalData.change')"
    @on-click="openModal('passwordChange')"
  >
    ******
  </AccountProfileData>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <UiOverlay v-if="isOpen" :visible="isOpen">
    <SfModal
      v-model="isOpen"
      ref="modalElement"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="address-modal-title"
    >
      <header>
        <SfButton
          type="button"
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="closeModal"
        >
          <SfIconClose />
        </SfButton>
        <h3
          id="address-modal-title"
          class="text-neutral-900 text-lg md:text-2xl font-bold mb-6"
        >
          {{ $t(`My ${openedForm}`) }}
        </h3>
      </header>

      <div v-if="openedForm === 'profile'">
        <form
          @submit.prevent="handleUpdateUser"
          data-testid="account-forms-name"
        >
          <label class="block">
            <FormLabel>{{
              $t('account.accountSettings.personalData.yourName')
            }}</FormLabel>
            <SfInput
              name="firstname"
              type="text"
              v-model="form.name"
              required
            />
          </label>
          <label class="block mt-4">
            <FormLabel>{{
              $t('account.accountSettings.personalData.yourEmail')
            }}</FormLabel>
            <SfInput name="email" type="email" v-model="form.email" required />
          </label>
          <div
            class="mt-6 flex flex-col-reverse md:flex-row md:justify-end gap-4"
          >
            <SfButton type="reset" variant="secondary" @click="closeModal">
              {{ $t('contactInfo.cancel') }}
            </SfButton>
            <SfButton type="submit" :disabled="loading">
              <SfLoaderCircular
                v-if="loading"
                class="flex justify-center items-center"
                size="base"
              />
              <span v-else>
                {{ $t('contactInfo.save') }}
              </span>
            </SfButton>
          </div>
        </form>
      </div>

      <div v-else-if="openedForm === 'passwordChange'">
        <form
          @submit.prevent="handleUpdatePassword"
          data-testid="account-forms-password"
        >
          <label class="block">
            <FormLabel>{{
              $t('account.accountSettings.personalData.currentPassword')
            }}</FormLabel>
            <SfInput
              name="password"
              :type="passwordVisible ? 'text' : 'password'"
              v-model="userPasswords.currentPassword"
              required
            >
              <template #suffix>
                <button
                  type="button"
                  @click="passwordVisible = !passwordVisible"
                >
                  <SfIconVisibility />
                </button>
              </template>
            </SfInput>
          </label>
          <label class="block my-4">
            <FormLabel>{{
              $t('account.accountSettings.personalData.newPassword')
            }}</FormLabel>
            <SfInput
              name="password"
              :type="firstNewPasswordVisible ? 'text' : 'password'"
              v-model="form.newPassword"
              required
            >
              <template #suffix>
                <button
                  type="button"
                  @click="firstNewPasswordVisible = !firstNewPasswordVisible"
                >
                  <SfIconVisibility />
                </button>
              </template>
            </SfInput>
            <FormHelperText class="block">
              {{
                $t('account.accountSettings.personalData.passwordHelp')
              }}</FormHelperText
            >
          </label>
          <label class="block">
            <FormLabel>{{
              $t('account.accountSettings.personalData.newPasswordAgain')
            }}</FormLabel>
            <SfInput
              name="password"
              :type="secondNewPasswordVisible ? 'text' : 'password'"
              v-model="form.repeatPassword"
              required
            >
              <template #suffix>
                <button
                  type="button"
                  @click="secondNewPasswordVisible = !secondNewPasswordVisible"
                >
                  <SfIconVisibility />
                </button>
              </template>
            </SfInput>
          </label>
          <div
            class="mt-6 flex flex-col-reverse md:flex-row md:justify-end gap-4"
          >
            <SfButton
              type="reset"
              variant="secondary"
              @click="$emit('on-cancel')"
            >
              {{ $t('contactInfo.cancel') }}
            </SfButton>
            <SfButton type="submit" class="min-w-[120px]" :disabled="loading">
              <SfLoaderCircular
                v-if="loading"
                class="flex justify-center items-center"
                size="base"
              />
              <span v-else>
                {{ $t('account.accountSettings.personalData.changePassword') }}
              </span>
            </SfButton>
          </div>
        </form>
      </div>
    </SfModal>
  </UiOverlay>
</template>
