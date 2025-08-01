<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-700 dark:text-gray-300">
    <section class="mb-12">
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white animate-fade-in-down">
        Мониторинг машин в ремонте
      </h1>

      <div>
        <h2 class="text-2xl font-semibold mb-4">Машины в ремонте</h2>
        <ul>
          <li v-for="order in ordersInRepair" :key="order.id" class="mb-2 p-2 border rounded dark:bg-gray-800">
            <p><strong>Клиент:</strong> {{ getClientName(order.clientId) }}</p>
            <p><strong>Автомобиль:</strong> {{ getCarName(order.carId) }}</p>
            <p><strong>Описание:</strong> {{ order.description }}</p>
            <p><strong>Статус:</strong> В ремонте</p>
          </li>
        </ul>
        <p v-if="ordersInRepair.length === 0" class="text-gray-500 dark:text-gray-400">Нет машин в ремонте.</p>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useOrdersStore } from '../stores/orders'
import { useClientsStore } from '../stores/clients'
import { useCarsStore } from '../stores/cars'

export default {
  name: 'RepairMonitor',
  setup() {
    const ordersStore = useOrdersStore()
    const clientsStore = useClientsStore()
    const carsStore = useCarsStore()

    const ordersInRepair = computed(() => ordersStore.getOrdersInRepair())
    const clients = clientsStore.clients
    const cars = carsStore.cars

    function getClientName(clientId) {
      const client = clients.find(c => c.id === clientId)
      return client ? client.name : 'Неизвестный клиент'
    }

    function getCarName(carId) {
      const car = cars.find(c => c.id === carId)
      return car ? `${car.make} ${car.model} (${car.year})` : 'Неизвестный автомобиль'
    }

    return {
      ordersInRepair,
      getClientName,
      getCarName,
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
