import { sdk } from '@/sdk.config';
import '@erpgap/odoo-sdk-api-client';

export const useCountrySearch: any = () => {
  const loading = ref(false);
  const error = reactive<any>({
    searchCountries: null,
    searchCountryStates: null,
  });

  const countries = useState('countries');
  const countryStates = useState('states');

  const resetCountryErrors = () => (error.value = null);

  const searchCountries = async () => {
    try {
      loading.value = true;
      const { data } = await sdk.oddo.getCountries();
      countries.value = data.countries.countries;
    } catch (err) {
      error.searchCountries = err;
    } finally {
      loading.value = false;
    }
  };

  const searchCountryStates = async (countryId: number) => {
    if (!countryId) return;
    try {
      loading.value = true;
      const { data } = await sdk.oddo.getCountryStates(countryId);
      countryStates.value = data?.country?.states || [];
    } catch (err) {
      error.searchCountries = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    searchCountries,
    resetCountryErrors,
    searchCountryStates,
    countries,
    countryStates,
    error: computed(() => error),
  };
};
