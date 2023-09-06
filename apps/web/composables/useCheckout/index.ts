import { sdk } from '@/sdk.config';
import '@erpgap/odoo-sdk-api-client';

export const useCheckout: any = () => {
  const loading = ref(false);
  const error = reactive<any>({
    loadAddress: null,
    addShippingAddress: null,
    updateShippingAddress: null,
  });

  const loadAddress = async (params: any) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.shippingGetAddress();
      return data.addresses;
    } catch (err) {
      error.loadAddress = err;
    }
  };

  const loadShippingAddress = async () => {
    try {
      loading.value = true;
      const address =
        context.useCart?.cart?.value?.order?.partnerShipping || {};
      const shippingAdress = {
        ...address,
        country: { id: String(address?.country?.id) },
        state: { id: String(address?.state?.id) },
      };
      return shippingAdress;
    } catch (err) {
      error.loadAddress = err;
    }
  };

  const loadBillingAddress = async () => {
    try {
      loading.value = true;
      const address = context.useCart?.cart?.value?.order?.partnerInvoice || {};
      const billingAddress = {
        ...address,
        country: { id: String(address?.country?.id || null) },
        state: { id: String(address?.state?.id || null) },
      };
      return billingAddress;
    } catch (err) {
      error.loadAddress = err;
    }
  };

  const updateShippingAddress = async ({ params, customQuery }: any) => {
    if ('id' in params && params.id) {
      try {
        const { data } = await sdk.oddo.shippingUpdateAddress(
          params,
          customQuery
        );
        //   context.useCart.cart.value.order.partnerShipping = data.updateAddress;
        return data.updateAddress;
      } catch (err) {
        error.updateShippingAddress = err;
      }
    } else {
      try {
        const { data } = await sdk.oddo.shippingAddAdress(params, customQuery);
        // context.useCart.cart.value.order.partnerShipping = data.addAddress;
        return data.addAddress;
      } catch (err) {
        error.addShippingAddress = err;
      }
    }
  };

  const updateBillingAddress = async ({ params, customQuery }: any) => {
    if ('id' in params && params.id) {
      try {
        const { data } = await sdk.oddo.billingUpdateAddress(
          params,
          customQuery
        );
        //   context.useCart.cart.value.order.partnerShipping = data.updateAddress;
        return data.updateAddress;
      } catch (err) {
        error.updateShippingAddress = err;
      }
    } else {
      try {
        const { data } = await sdk.oddo.billingUpdateAddress(
          params,
          customQuery
        );
        // context.useCart.cart.value.order.partnerShipping = data.addAddress;
        return data.addAddress;
      } catch (err) {
        error.addShippingAddress = err;
      }
    }
  };

  const deleteAddress = async (params: any) => {
    await sdk.oddo.deleteAddress(params);
  };

  const useShippingAsBillingAddress = (): any => {
    const { cart }: any = useCart();
    const address = cart.value.order.partnerShipping;
    return {
      ...address,
      country: { id: String(address.country.id) },
      state: { id: String(address.state.id) },
    };
  };

  return {
    loading,
    loadAddress,
    loadShippingAddress,
    updateShippingAddress,
    updateBillingAddress,
    useShippingAsBillingAddress,
    deleteAddress,
    error: computed(() => error),
  };
};
