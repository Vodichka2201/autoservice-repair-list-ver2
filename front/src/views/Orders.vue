<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-700 dark:text-gray-300">
    <section class="mb-12">
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white animate-fade-in-down">
        Заказ-наряды
      </h1>

      <p class="mb-4 text-gray-600 dark:text-gray-300">Управление заказами на ремонт и обслуживание</p>

      <button @click="openAddModal" class="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Создать заказ-наряд</span>
      </button>

      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-gray-300 dark:border-gray-700">
            <th class="py-2 px-4">№</th>
            <th class="py-2 px-4">Клиент</th>
            <th class="py-2 px-4">Автомобиль</th>
            <th class="py-2 px-4">Статус</th>
            <th class="py-2 px-4">Стоимость</th>
            <th class="py-2 px-4">Дата создания</th>
            <th class="py-2 px-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="order.id" class="border-b border-gray-200 dark:border-gray-700">
            <td class="py-2 px-4 font-semibold">#{{ index + 1 }}</td>
            <td class="py-2 px-4">
              <div>{{ getClientName(order.clientId) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ getClientPhone(order.clientId) }}</div>
            </td>
            <td class="py-2 px-4">
              <div>{{ getCarName(order.carId) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ getCarLicensePlate(order.carId) }}</div>
            </td>
            <td class="py-2 px-4">
              <span :class="statusClass(order.status)">{{ getStatusText(order.status) }}</span>
            </td>
            <td class="py-2 px-4">
              <div>{{ formatPrice(order.finalCost) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">план: {{ formatPrice(order.estimatedCost) }}</div>
            </td>
            <td class="py-2 px-4">{{ formatDate(order.createdAt) }}</td>
            <td class="py-2 px-4 space-x-2">
              <button @click="openEditModal(order)" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">✏️</button>
              <button @click="deleteOrder(order.id)" class="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Модальное окно создания заказа -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-md w-full relative">
          <button @click="closeAddModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 class="text-xl font-semibold mb-4">Создать заказ-наряд</h3>
          <form @submit.prevent="addNewOrder" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold" for="clientId">Клиент *</label>
              <select v-model="newOrder.clientId" id="clientId" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200">
                <option value="" disabled>Выберите клиента</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="carId">Автомобиль *</label>
              <select v-model="newOrder.carId" id="carId" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200">
                <option value="" disabled>Выберите автомобиль</option>
                <option v-for="car in cars" :key="car.id" :value="car.id">{{ car.make }} {{ car.model }} ({{ car.licensePlate }})</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="status">Статус *</label>
              <select v-model="newOrder.status" id="status" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200">
                <option value="new">Новый</option>
                <option value="in_repair">В работе</option>
                <option value="completed">Завершен</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="description">Описание работ *</label>
              <textarea v-model="newOrder.description" id="description" rows="3" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold" for="estimatedCost">Предварительная стоимость (₽) *</label>
                <input v-model.number="newOrder.estimatedCost" id="estimatedCost" type="number" min="0" step="100"
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="finalCost">Итоговая стоимость (₽)</label>
                <input v-model.number="newOrder.finalCost" id="finalCost" type="number" min="0" step="100" disabled
                  class="w-full px-3 py-2 border rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-400" />
              </div>
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="notes">Примечания</label>
              <textarea v-model="newOrder.notes" id="notes" rows="2"
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"></textarea>
            </div>
            <div class="flex justify-end space-x-4 mt-4">
              <button type="button" @click="closeAddModal" class="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 transition-colors">Отмена</button>
              <button type="submit" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">Создать</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Модальное окно редактирования заказа -->
      <div v-if="editingOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-md w-full relative">
          <button @click="closeEditModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 class="text-xl font-semibold mb-4">Редактировать заказ-наряд</h3>
          <form @submit.prevent="updateOrderData" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold" for="editClientId">Клиент *</label>
              <select v-model="editingOrder.clientId" id="editClientId" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200">
                <option value="" disabled>Выберите клиента</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="editCarId">Автомобиль *</label>
              <select v-model="editingOrder.carId" id="editCarId" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200">
                <option value="" disabled>Выберите автомобиль</option>
                <option v-for="car in cars" :key="car.id" :value="car.id">{{ car.make }} {{ car.model }} ({{ car.licensePlate }})</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="editStatus">Статус *</label>
              <select v-model="editingOrder.status" id="editStatus" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200">
                <option value="new">Новый</option>
                <option value="in_repair">В работе</option>
                <option value="completed">Завершен</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="editDescription">Описание работ *</label>
              <textarea v-model="editingOrder.description" id="editDescription" rows="3" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold" for="editEstimatedCost">Предварительная стоимость (₽) *</label>
                <input v-model.number="editingOrder.estimatedCost" id="editEstimatedCost" type="number" min="0" step="100"
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="editFinalCost">Итоговая стоимость (₽)</label>
                <input v-model.number="editingOrder.finalCost" id="editFinalCost" type="number" min="0" step="100" disabled
                  class="w-full px-3 py-2 border rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-400" />
              </div>
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="editNotes">Примечания</label>
              <textarea v-model="editingOrder.notes" id="editNotes" rows="2"
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"></textarea>
            </div>
            <div class="flex justify-end space-x-4 mt-4">
              <button type="button" @click="cancelEdit" class="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 transition-colors">Отмена</button>
              <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useOrdersStore } from '../stores/orders'
import { useClientsStore } from '../stores/clients'
import { useCarsStore } from '../stores/cars'

export default {
  name: 'Orders',
  setup() {
    const ordersStore = useOrdersStore()
    const clientsStore = useClientsStore()
    const carsStore = useCarsStore()

    const orders = ordersStore.orders
    const clients = clientsStore.clients
    const cars = carsStore.cars

    const showAddModal = ref(false)
    const showEditModal = ref(false)

    const newOrder = ref({
      clientId: '',
      carId: '',
      status: 'new',
      description: '',
      estimatedCost: 0,
      finalCost: 0,
      notes: '',
      createdAt: new Date().toISOString(),
    })

    const editingOrder = ref(null)

    function openAddModal() {
      showAddModal.value = true
      newOrder.value = {
        clientId: '',
        carId: '',
        status: 'new',
        description: '',
        estimatedCost: 0,
        finalCost: 0,
        notes: '',
        createdAt: new Date().toISOString(),
      }
    }

    function closeAddModal() {
      showAddModal.value = false
    }

    function addNewOrder() {
      if (!newOrder.value.clientId || !newOrder.value.carId || !newOrder.value.description.trim()) return
      const orderToAdd = {
        id: Date.now().toString(),
        clientId: newOrder.value.clientId,
        carId: newOrder.value.carId,
        status: newOrder.value.status,
        description: newOrder.value.description.trim(),
        estimatedCost: newOrder.value.estimatedCost,
        finalCost: newOrder.value.finalCost,
        notes: newOrder.value.notes.trim(),
        createdAt: newOrder.value.createdAt,
      }
      ordersStore.addOrder(orderToAdd)
      closeAddModal()
    }

    function openEditModal(order) {
      editingOrder.value = { ...order }
      showEditModal.value = true
    }

    function closeEditModal() {
      showEditModal.value = false
    }

    function updateOrderData() {
      if (!editingOrder.value.clientId || !editingOrder.value.carId || !editingOrder.value.description.trim()) return
      ordersStore.updateOrder(editingOrder.value.id, {
        clientId: editingOrder.value.clientId,
        carId: editingOrder.value.carId,
        status: editingOrder.value.status,
        description: editingOrder.value.description.trim(),
        estimatedCost: editingOrder.value.estimatedCost,
        finalCost: editingOrder.value.finalCost,
        notes: editingOrder.value.notes.trim(),
        createdAt: editingOrder.value.createdAt,
      })
      showEditModal.value = false
      editingOrder.value = null
    }

    function cancelEdit() {
      showEditModal.value = false
      editingOrder.value = null
    }

    function deleteOrder(id) {
      ordersStore.removeOrder(id)
    }

    function getClientName(clientId) {
      const client = clients.find(c => c.id === clientId)
      return client ? client.name : 'Неизвестный клиент'
    }

    function getClientPhone(clientId) {
      const client = clients.find(c => c.id === clientId)
      return client ? client.phone : '-'
    }

    function getCarName(carId) {
      const car = cars.find(c => c.id === carId)
      return car ? `${car.make} ${car.model}` : 'Неизвестный автомобиль'
    }

    function getCarLicensePlate(carId) {
      const car = cars.find(c => c.id === carId)
      return car ? car.licensePlate : '-'
    }

    function getStatusText(status) {
      switch (status) {
        case 'new':
          return 'Новый'
        case 'in_repair':
          return 'В работе'
        case 'completed':
          return 'Завершен'
        default:
          return status
      }
    }

    function statusClass(status) {
      switch (status) {
        case 'new':
          return 'inline-block px-2 py-1 rounded bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        case 'in_repair':
          return 'inline-block px-2 py-1 rounded bg-yellow-300 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-300'
        case 'completed':
          return 'inline-block px-2 py-1 rounded bg-green-300 text-green-900 dark:bg-green-700 dark:text-green-300'
        default:
          return ''
      }
    }

    function formatPrice(price) {
      if (price == null || price === undefined) return '-'
      return price.toLocaleString('ru-RU') + ' ₽'
    }

    function formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    return {
      orders,
      clients,
      cars,
      showAddModal,
      showEditModal,
      newOrder,
      editingOrder,
      openAddModal,
      closeAddModal,
      addNewOrder,
      openEditModal,
      closeEditModal,
      updateOrderData,
      cancelEdit,
      deleteOrder,
      getClientName,
      getClientPhone,
      getCarName,
      getCarLicensePlate,
      getStatusText,
      statusClass,
      formatPrice,
      formatDate,
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
