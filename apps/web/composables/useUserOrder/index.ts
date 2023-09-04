import { sdk } from '@/sdk.config';
import '@erpgap/odoo-sdk-api-client';

export const useUserOrder: any = () => {
  const loading = ref(false);
  const error = reactive<any>({
    searchOrders: null,
  });
  const orders = useState('order');

  const searchOrders = async (params: any) => {
    try {
      loading.value = true;
      const { data } = await sdk.oddo.ordersGet(params);
      orders.value = data?.orders?.orders || [];
      return data?.orders?.orders;
    } catch (err) {
      error.searchOrders = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    orders,
    searchOrders,
    error: computed(() => error),
  };
};
