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
        <form @submit.prevent="closeModal" data-testid="account-forms-name">
          <label class="block">
            <UiFormLabel>{{
              $t('account.accountSettings.personalData.yourName')
            }}</UiFormLabel>
            <SfInput
              name="firstname"
              type="text"
              v-model="userData.firstName"
              required
            />
          </label>
          <label class="block mt-4">
            <UiFormLabel>{{
              $t('account.accountSettings.personalData.yourEmail')
            }}</UiFormLabel>
            <SfInput
              name="email"
              type="email"
              v-model="userData.email"
              required
            />
          </label>
          <div
            class="mt-6 flex flex-col-reverse md:flex-row md:justify-end gap-4"
          >
            <SfButton type="reset" variant="secondary" @click="closeModal">
              {{ $t('contactInfo.cancel') }}
            </SfButton>
            <SfButton type="submit" class="min-w-[120px]">
              {{ $t('contactInfo.save') }}
            </SfButton>
          </div>
        </form>
      </div>

      <div v-else-if="openedForm === 'passwordChange'">
        <form
          @submit.prevent="$emit('on-save')"
          data-testid="account-forms-password"
        >
          <label class="block">
            <UiFormLabel>{{
              $t('account.accountSettings.personalData.currentPassword')
            }}</UiFormLabel>
            <SfInput
              name="password"
              :type="passwordVisible ? 'text' : 'password'"
              v-model="userPasswords.oldPassword"
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
            <UiFormLabel>{{
              $t('account.accountSettings.personalData.newPassword')
            }}</UiFormLabel>
            <SfInput
              name="password"
              :type="firstNewPasswordVisible ? 'text' : 'password'"
              v-model="userPasswords.firstNewPassword"
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
            <UiFormLabel>{{
              $t('account.accountSettings.personalData.newPasswordAgain')
            }}</UiFormLabel>
            <SfInput
              name="password"
              :type="secondNewPasswordVisible ? 'text' : 'password'"
              v-model="userPasswords.secondNewPassword"
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
            <SfButton type="submit" class="min-w-[120px]">
              {{ $t('account.accountSettings.personalData.changePassword') }}
            </SfButton>
          </div>
        </form>
      </div>
    </SfModal>
  </UiOverlay>
</template>

<script setup lang="ts">
import {
  SfButton,
  SfIconClose,
  SfModal,
  useDisclosure,
  SfInput,
  SfIconVisibility,
} from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';

definePageMeta({
  layout: 'account',
});

const { isOpen, open, close } = useDisclosure();

const lastActiveElement = ref();
const modalElement = ref();
const openedForm = ref('');
const passwordVisible = ref(false);
const firstNewPasswordVisible = ref(false);
const secondNewPasswordVisible = ref(false);

const userData: any = ref({});
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
</script>
