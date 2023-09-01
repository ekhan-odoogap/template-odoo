import { sdk } from '@/sdk.config';

export const useAuth: any = () => {
  const loading = ref(false);

  const loadAuthInfo = async () => {
    try {
      loading.value = true;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    loadAuthInfo,
  };
};
