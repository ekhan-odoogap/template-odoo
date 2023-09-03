import { sdk } from '@/sdk.config';

export const useUser: any = () => {
  const loading = ref(false);
  const error = reactive<any>({
    user: null,
    logIn: null,
    logOut: null,
    register: null,
    updateUser: null,
    resetPassword: null,
  });
  const isAuthenticated = ref(false);

  const loadAuthUser = async () => {
    try {
      loading.value = true;
      const user = sdk.odoo.config.app.$cookies.get('odoo-user');

      if (!user) {
        const { data } = await sdk.odoo.loadUser();
        sdk.odoo.config.app.$cookies.set('odoo-user', data?.partner, {
          sameSite: true,
        });
        return data?.partner;
      }
      return user;
    } catch (err) {
      error.user = err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (params?: any) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.signUpUser(params);
      sdk.odoo.config.app.$cookies.set('odoo-user', data.register, {
        sameSite: true,
      });
      return data?.register;
    } catch (err) {
      error.register = err;
    } finally {
      loading.value = false;
    }
  };

  const logIn = async (params?: any) => {
    try {
      const { customQuery } = params;
      const { data } = await context.$odoo.api.logInUser(params, customQuery);
      sdk.odoo.config.app.$cookies.set('odoo-user', data?.login?.partner, {
        sameSite: true,
      });
      return data?.login?.partner;
    } catch (err) {
      error.logIn = err;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async ({
    currentUser,
    updatedUserData,
    customQuery,
  }: any) => {
    const params: any = {
      id: currentUser.id,
      name: updatedUserData.name,
      email: updatedUserData.email,
    };
    try {
      loading.value = true;
      const { data } = await sdk.odoo.updateAccount(params, customQuery);
      return data.updateMyAccount;
    } catch (err) {
      error.updateUser = err;
    } finally {
      loading.value = false;
    }
  };

  const logOut = async () => {
    try {
      loading.value = true;
      sdk.odoo.config.app.$cookies.remove('odoo-user');
      await sdk.odoo.logOutUser();
    } catch (err) {
      error.logOut = err;
    } finally {
      loading.value = false;
    }
  };

  const sendResetPassword = async (email) => {
    try {
      loading.value = true;
      const data = await sdk.odoo.sendResetPassword(email);
      return data;
    } catch (err) {
      error.resetPassword = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error: computed(() => error),
    isAuthenticated,
    loadAuthUser,
    register,
    logIn,
    updateUser,
    logOut,
    sendResetPassword,
  };
};
