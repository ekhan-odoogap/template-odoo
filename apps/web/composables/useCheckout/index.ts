import { sdk } from '@/sdk.config';
import '@erpgap/odoo-sdk-api-client';

export const useCheckout: any = () => {
  const loading = ref(false);
  const error = reactive<any>({
    loadShippingAddress: null,
    addShippingAddress: null,
    updateShippingAddress: null,
  });

  const loadShippingAddress = async (params: any) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.shippingGetAddress();
      return data.addresses;
    } catch (err) {
      error.loadShippingAddress = err;
    }
  };

  const updateShippingAddress = async (params: any) => {
    if ('id' in params && params.id) {
      try {
        const { data } = await sdk.oddo.shippingUpdateAddress(params);
        //   context.useCart.cart.value.order.partnerShipping = data.updateAddress;
        return data.updateAddress;
      } catch (err) {
        error.updateShippingAddress = err;
      }
    } else {
      try {
        const { data } = await sdk.oddo.shippingAddAdress(params);
        // context.useCart.cart.value.order.partnerShipping = data.addAddress;
        return data.addAddress;
      } catch (err) {
        error.addShippingAddress = err;
      }
    }
  };
  return {
    loading,
    loadShippingAddress,
    updateShippingAddress,
    error: computed(() => error),
  };
};
