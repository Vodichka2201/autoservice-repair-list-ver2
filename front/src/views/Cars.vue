<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-700 dark:text-gray-300">
    <section class="mb-12">
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white animate-fade-in-down">
        Автомобили
      </h1>

      <p class="mb-4 text-gray-600 dark:text-gray-300">Управление автомобилями клиентов</p>

      <button @click="openAddModal" class="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Добавить автомобиль</span>
      </button>

      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-gray-300 dark:border-gray-700">
            <th class="py-2 px-4">Автомобиль</th>
            <th class="py-2 px-4">Владелец</th>
            <th class="py-2 px-4">Гос. номер</th>
            <th class="py-2 px-4">VIN</th>
            <th class="py-2 px-4">Пробег</th>
            <th class="py-2 px-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="car in cars" :key="car.id" class="border-b border-gray-200 dark:border-gray-700">
            <td class="py-2 px-4 font-semibold">
              {{ car.make }} {{ car.model }}, {{ car.year }} г., {{ car.color || '-' }}
            </td>
            <td class="py-2 px-4">
              <div>{{ getClientName(car.ownerId) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ getClientPhone(car.ownerId) }}</div>
            </td>
            <td class="py-2 px-4">{{ car.licensePlate || '-' }}</td>
            <td class="py-2 px-4">{{ car.vin || '-' }}</td>
            <td class="py-2 px-4">{{ formatMileage(car.mileage) }}</td>
            <td class="py-2 px-4 space-x-2">
              <button @click="editCar(car)" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">✏️</button>
              <button @click="deleteCar(car.id)" class="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Модальное окно добавления автомобиля -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-md w-full relative">
          <button @click="closeAddModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 class="text-xl font-semibold mb-4">Добавить автомобиль</h3>
          <form @submit.prevent="addNewCar" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold" for="ownerId">Клиент *</label>
              <select v-model="newCar.ownerId" id="ownerId" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200">
                <option value="" disabled>Выберите клиента</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold" for="make">Марка *</label>
                <input v-model="newCar.make" id="make" type="text" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="model">Модель *</label>
                <input v-model="newCar.model" id="model" type="text" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="year">Год *</label>
                <input v-model.number="newCar.year" id="year" type="number" min="1900" max="2099" step="1" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="color">Цвет</label>
                <input v-model="newCar.color" id="color" type="text"
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="vin">VIN номер *</label>
                <input v-model="newCar.vin" id="vin" type="text" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="licensePlate">Гос. номер *</label>
                <input v-model="newCar.licensePlate" id="licensePlate" type="text" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="mileage">Пробег (км)</label>
                <input v-model.number="newCar.mileage" id="mileage" type="number" min="0" step="1"
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
            </div>
            <div class="flex justify-end space-x-4 mt-4">
              <button type="button" @click="closeAddModal" class="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 transition-colors">Отмена</button>
              <button type="submit" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">Добавить</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="editingCar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-md w-full relative">
          <button @click="closeEditModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 class="text-xl font-semibold mb-4">Редактировать автомобиль</h3>
          <form @submit.prevent="updateCarData" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold" for="editOwnerId">Клиент *</label>
              <select v-model="editingCar.ownerId" id="editOwnerId" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200">
                <option value="" disabled>Выберите клиента</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold" for="editMake">Марка *</label>
                <input v-model="editingCar.make" id="editMake" type="text" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="editModel">Модель *</label>
                <input v-model="editingCar.model" id="editModel" type="text" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="editYear">Год *</label>
                <input v-model.number="editingCar.year" id="editYear" type="number" min="1900" max="2099" step="1" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="editColor">Цвет</label>
                <input v-model="editingCar.color" id="editColor" type="text"
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="editVin">VIN номер *</label>
                <input v-model="editingCar.vin" id="editVin" type="text" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="editLicensePlate">Гос. номер *</label>
                <input v-model="editingCar.licensePlate" id="editLicensePlate" type="text" required
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label class="block mb-1 font-semibold" for="editMileage">Пробег (км)</label>
                <input v-model.number="editingCar.mileage" id="editMileage" type="number" min="0" step="1"
                  class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
              </div>
            </div>
            <div class="flex justify-end space-x-4 mt-4">
              <button type="button" @click="closeEditModal" class="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 transition-colors">Отмена</button>
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
import { useCarsStore } from '../stores/cars'
import { useClientsStore } from '../stores/clients'

export default {
  name: 'Cars',
  setup() {
    const carsStore = useCarsStore()
    const clientsStore = useClientsStore()
    const cars = carsStore.cars
    const clients = clientsStore.clients

    const showAddModal = ref(false)
    const showEditModal = ref(false)

    const newCar = ref({
      ownerId: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      vin: '',
      licensePlate: '',
      mileage: 0,
    })

    const editingCar = ref(null)

    function openAddModal() {
      showAddModal.value = true
      newCar.value = {
        ownerId: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        vin: '',
        licensePlate: '',
        mileage: 0,
      }
    }

    function closeAddModal() {
      showAddModal.value = false
    }

    function addNewCar() {
      if (!newCar.value.ownerId || !newCar.value.make.trim() || !newCar.value.model.trim() || !newCar.value.year || !newCar.value.vin.trim() || !newCar.value.licensePlate.trim()) return
      const carToAdd = {
        id: Date.now().toString(),
        ownerId: newCar.value.ownerId,
        make: newCar.value.make.trim(),
        model: newCar.value.model.trim(),
        year: newCar.value.year,
        color: newCar.value.color.trim() || '',
        vin: newCar.value.vin.trim(),
        licensePlate: newCar.value.licensePlate.trim(),
        mileage: newCar.value.mileage || 0,
      }
      carsStore.addCar(carToAdd)
      closeAddModal()
    }

    function openEditModal(car) {
      editingCar.value = { ...car }
      showEditModal.value = true
    }

    function closeEditModal() {
      showEditModal.value = false
    }

    function updateCarData() {
      if (!editingCar.value.ownerId || !editingCar.value.make.trim() || !editingCar.value.model.trim() || !editingCar.value.year || !editingCar.value.vin.trim() || !editingCar.value.licensePlate.trim()) return
      carsStore.updateCar(editingCar.value.id, {
        ownerId: editingCar.value.ownerId,
        make: editingCar.value.make.trim(),
        model: editingCar.value.model.trim(),
        year: editingCar.value.year,
        color: editingCar.value.color.trim() || '',
        vin: editingCar.value.vin.trim(),
        licensePlate: editingCar.value.licensePlate.trim(),
        mileage: editingCar.value.mileage || 0,
      })
      showEditModal.value = false
      editingCar.value = null
    }

    function cancelEdit() {
      showEditModal.value = false
      editingCar.value = null
    }

    function deleteCar(id) {
      carsStore.removeCar(id)
    }

    function getClientName(clientId) {
      const client = clients.find(c => c.id === clientId)
      return client ? client.name : 'Неизвестный клиент'
    }

    function getClientPhone(clientId) {
      const client = clients.find(c => c.id === clientId)
      return client ? client.phone : '-'
    }

    function formatMileage(mileage) {
      if (mileage == null || mileage === undefined) return '-'
      return mileage.toLocaleString('ru-RU') + ' км'
    }

    return {
      cars,
      clients,
      showAddModal,
      showEditModal,
      newCar,
      editingCar,
      openAddModal,
      closeAddModal,
      addNewCar,
      openEditModal,
      closeEditModal,
      updateCarData,
      cancelEdit,
      deleteCar,
      getClientName,
      getClientPhone,
      formatMileage,
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
