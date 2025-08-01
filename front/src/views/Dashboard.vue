<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-700 dark:text-gray-300">
    <section class="mb-12">
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white animate-fade-in-down">
        Дашборд с общей статистикой
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div class="p-6 bg-white dark:bg-gray-800 rounded shadow text-center">
          <h2 class="text-2xl font-semibold mb-2">Клиенты</h2>
          <p class="text-4xl font-bold">{{ clientsCount }}</p>
        </div>
        <div class="p-6 bg-white dark:bg-gray-800 rounded shadow text-center">
          <h2 class="text-2xl font-semibold mb-2">Автомобили</h2>
          <p class="text-4xl font-bold">{{ carsCount }}</p>
        </div>
        <div class="p-6 bg-white dark:bg-gray-800 rounded shadow text-center">
          <h2 class="text-2xl font-semibold mb-2">Заказы</h2>
          <p class="text-4xl font-bold">{{ ordersCount }}</p>
        </div>
        <div class="p-6 bg-white dark:bg-gray-800 rounded shadow text-center">
          <h2 class="text-2xl font-semibold mb-2">Машины в ремонте</h2>
          <p class="text-4xl font-bold">{{ ordersInRepairCount }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useClientsStore } from '../stores/clients'
import { useCarsStore } from '../stores/cars'
import { useOrdersStore } from '../stores/orders'

export default {
  name: 'Dashboard',
  setup() {
    const clientsStore = useClientsStore()
    const carsStore = useCarsStore()
    const ordersStore = useOrdersStore()

    const clientsCount = computed(() => clientsStore.clients.length)
    const carsCount = computed(() => carsStore.cars.length)
    const ordersCount = computed(() => ordersStore.orders.length)
    const ordersInRepairCount = computed(() => ordersStore.getOrdersInRepair().length)

    return {
      clientsCount,
      carsCount,
      ordersCount,
      ordersInRepairCount,
    }
  },
}
</script>

<style>
.animate-fade-in-down {
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
