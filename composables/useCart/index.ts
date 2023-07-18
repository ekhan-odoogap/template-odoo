import { useCart as baseUseCart } from '@vue-storefront/odoo';
import { sharedRef, useVSFContext, Logger } from '@vue-storefront/core';
import { computed } from '@nuxtjs/composition-api';
const resolvePath = (object, path, defaultValue) => path
  .split('.')
  .reduce((o, p) => o ? o[p] : defaultValue, object);

const throwErrors = (errors: Array<{ message?: string }>) => {
  if (errors) {
    throw new Error(errors.map(error => error.message).join(',') || 'Some error');
  }
};

const useCart = () : any => {
  const context = useVSFContext();

  const { cart, setCart } = baseUseCart();
  const loading = sharedRef(null, 'useCart-loading');
  const error = sharedRef({
    load: null,
    clearCart: null,
    cartUpdateItem: null
  }, 'useCart-error');

  const cartTotalItems = computed(() => {
    if(process.server) return 0
    if((cart.value?.order as any)?.cartQuantity) {
      return (cart.value?.order as any)?.cartQuantity
    }
     return context.$odoo.config.app.$cookies.get('cart-size');
  })

  const load = async ({ customQuery } = { customQuery: undefined }) => {
    try {
      loading.value = false;
      const { data, graphQLErrors } = await context.$odoo.api.loadCart(customQuery);

      throwErrors(graphQLErrors);

      setCart(data.cart);
      error.value.load = null;

      const cookieIndex = context?.$odoo?.config?.app?.$config?.cart?.cookieIndex || 'cartQuantity';
      context.$odoo.config.app.$cookies.set('cart-size', resolvePath(cart?.value?.order, cookieIndex, 0) || 0);

    } catch (err) {
      error.value.load = err;
      Logger.error('useCart-load-error', err);
    } finally {
      loading.value = false;
    }
  };

  const cartAddItem = async (productId: number, quantity: number) => {
    try {
      loading.value = true;
      const { data, errors } = await context.$odoo.api.addToCart(
        {
          productId,
          quantity
        }
      );

      throwErrors(errors);
      setCart(data.cartAddItem);
      const cookieIndex = context?.$odoo?.config?.app?.$config?.cart?.cookieIndex || 'orderLines.length';
      context.$odoo.config.app.$cookies.set('cart-size', resolvePath(data?.cartAddItem?.order, cookieIndex, 0) || 0);

      error.value.addToCart = null;
    } catch (err) {
      error.value.addToCart = err;
      Logger.error('useCart-addToCart-error', err);
    } finally {
      loading.value = false;
    }
  };

  const updateItemQty = async (itemId: number, quantity: number) => {
    try {
      loading.value = true;
      const { data, errors } = await context.$odoo.api.updateItemQty(
        {
          lineId: itemId,
          quantity
        }
      );

      throwErrors(errors);
      setCart(data.cartUpdateItem);
      const cookieIndex = context?.$odoo?.config?.app?.$config?.cart?.cookieIndex || 'cartQuantity';
      context.$odoo.config.app.$cookies.set('cart-size', resolvePath(cart?.value?.order, cookieIndex, 0) || 0);
      error.value.cartUpdateItem = null;
    } catch (err) {
      error.value.cartUpdateItem = err;
      Logger.error('useCart-cartUpdateItem-error', err);
    } finally {
      loading.value = false;
    }
  };

  const removeItem = async (itemId: number,) => {
    try {
      loading.value = true;
      const { data, errors } = await context.$odoo.api.removeCartItem(
        {
          lineId: itemId,
        }
      );
      throwErrors(errors);
      setCart(data.cartRemoveItem);
      const cookieIndex = context?.$odoo?.config?.app?.$config?.cart?.cookieIndex || 'cartQuantity';
      context.$odoo.config.app.$cookies.set('cart-size', resolvePath(cart?.value?.order, cookieIndex, 0) || 0);
      error.value.cartRemoveItem = null;
    } catch (err) {
      error.value.cartRemoveItem = err;
      Logger.error('useCart-cartRemoveItem-error', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    ...baseUseCart(),
    cart,
    loading: computed(() => loading.value),
    cartTotalItems,
    load,
    cartAddItem,
    updateItemQty,
    removeItem,
    error: computed(() => error.value)
  };
};

export default useCart;
