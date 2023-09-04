<template>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <h2 class="hidden md:block typography-headline-4 font-bold mx-4 capitalize">
    {{ $t('account.ordersAndReturns.myOrders') }}
  </h2>
  <div v-if="!data" class="col-span-3 text-center mt-8">
    <NuxtImg
      src="/images/empty-cart.svg"
      :alt="$t('account.ordersAndReturns.noOrdersAltText')"
      width="192"
      height="192"
      class="mx-auto"
    />
    <h3 class="typography-headline-3 font-bold mb-4 mt-6">
      {{ $t('account.ordersAndReturns.noOrders') }}
    </h3>
    <SfButton variant="secondary" class="!ring-neutral-200">
      {{ $t('account.ordersAndReturns.continue') }}</SfButton
    >
  </div>
  <div v-else class="col-span-3">
    <table class="hidden md:block text-left typography-text-sm mx-4">
      <caption class="hidden">
        List of orders
      </caption>
      <thead class="border-b-2 border-neutral-200">
        <tr>
          <th class="py-4 pr-4 font-medium">
            {{ $t('account.ordersAndReturns.orderId') }}
          </th>
          <th class="py-4 pr-4 font-medium">Order Name</th>
          <th class="py-4 px-4 font-medium lg:whitespace-nowrap">
            {{ $t('account.ordersAndReturns.orderDate') }}
          </th>
          <th class="py-4 px-4 font-medium">
            {{ $t('account.ordersAndReturns.amount') }}
          </th>
          <th class="py-4 px-4 font-medium">
            {{ $t('account.ordersAndReturns.status') }}
          </th>
          <th class="py-4 pl-4"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="{ id, name, date, paymentAmount, status } in data"
          :key="id"
          class="border-b border-neutral-200"
        >
          <td class="py-4 pr-4 lg:whitespace-nowrap">{{ id }}</td>
          <td class="py-4 pr-4 lg:whitespace-nowrap">{{ name }}</td>
          <td class="p-4 lg:whitespace-nowrap">{{ date }}</td>
          <td class="p-4">${{ paymentAmount }}</td>
          <td :class="['p-4', { 'text-negative-700': status === 'Cancelled' }]">
            {{ status }}
          </td>
          <td class="py-1.5 pl-4 text-right w-full">
            <SfButton :tag="NuxtLink" size="sm" variant="tertiary">
              {{ $t('account.ordersAndReturns.details') }}</SfButton
            >
            <SfButton
              size="sm"
              variant="tertiary"
              @click="downloadOrder(parseInt(id))"
            >
              Download</SfButton
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useUserOrder } from '@/composables';
import { SfButton } from '@storefront-ui/vue';

definePageMeta({
  layout: 'account',
});

const NuxtLink = resolveComponent('NuxtLink');

const { loading, orders, searchOrders } = useUserOrder();

const currentOrder = await searchOrders();

const data = ref([
  {
    id: '0e4fec5a',
    name: 'Leather jacket Bully dark blue',
    date: '2022-08-11	',
    paymentAmount: '295.87',
    status: 'Completed',
  },
  {
    id: '0e4fec5a',
    name: 'Leather jacket Bully dark blue',
    date: '2022-08-11	',
    paymentAmount: '295.87',
    status: 'Completed',
  },
  {
    id: '0e4fec5a',
    name: 'Leather jacket Bully dark blue',
    date: '2022-08-11	',
    paymentAmount: '295.87',
    status: 'Completed',
  },
  {
    id: '0e4fec5a',
    name: 'Leather jacket Bully dark blue',
    date: '2022-08-11	',
    paymentAmount: '295.87',
    status: 'Completed',
  },
]);
const downloadFile = (file: Blob | MediaSource, name: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  const url = window.URL.createObjectURL(file);
  a.href = url;
  a.download = name;
  a.click();
  window.URL.revokeObjectURL(url);
};

const downloadOrders = async () => {
  downloadFile(
    new Blob([JSON.stringify(orders.value)], { type: 'application/json' }),
    'orders.json'
  );
};

const downloadOrder = async (id: number) => {
  downloadFile(
    new Blob([JSON.stringify(id)], { type: 'application/json' }),
    'order ' + id + '.json'
  );
};
</script>
