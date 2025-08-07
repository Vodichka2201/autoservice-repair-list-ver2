<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-700 dark:text-gray-300">
    <section class="mb-12">
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white animate-fade-in-down">
        Клиенты
      </h1>

      <p class="mb-4 text-gray-600 dark:text-gray-300">Управление базой клиентов автосервиса</p>

      <button @click="openAddModal" class="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Добавить клиента</span>
      </button>

      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-gray-300 dark:border-gray-700">
            <th class="py-2 px-4">Имя</th>
            <th class="py-2 px-4">Контакты</th>
            <th class="py-2 px-4">Адрес</th>
            <th class="py-2 px-4">Дата регистрации</th>
            <th class="py-2 px-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id" class="border-b border-gray-200 dark:border-gray-700">
            <td class="py-2 px-4 font-semibold">{{ client.name }}</td>
            <td class="py-2 px-4 space-y-1">
              <div class="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m-6 4h12M9 7v2m-6 4h12M9 11v2m-6 4h12M9 15v2m-6 4h12M9 19v2" />
                </svg>
                <span>{{ client.phone }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 01-8 0 4 4 0 018 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7m-4-4h8" />
                </svg>
                <span>{{ client.email || '-' }}</span>
              </div>
            </td>
            <td class="py-2 px-4">{{ client.address || '-' }}</td>
            <td class="py-2 px-4">{{ formatDate(client.registrationDate) }}</td>
            <td class="py-2 px-4 space-x-2">
              <button @click="editClient(client)" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">✏️</button>
              <button @click="deleteClient(client.id)" class="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Модальное окно добавления клиента -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-md w-full relative">
          <button @click="closeAddModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 class="text-xl font-semibold mb-4">Добавить клиента</h3>
          <form @submit.prevent="addNewClient" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold" for="name">Имя *</label>
              <input v-model="newClient.name" id="name" type="text" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="phone">Телефон *</label>
              <input v-model="newClient.phone" id="phone" type="text" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="email">Email</label>
              <input v-model="newClient.email" id="email" type="email"
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="address">Адрес</label>
              <input v-model="newClient.address" id="address" type="text"
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
            </div>
            <div class="flex justify-end space-x-4 mt-4">
              <button type="button" @click="closeAddModal" class="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 transition-colors">Отмена</button>
              <button type="submit" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">Добавить</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="editingClient" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-md w-full">
          <h3 class="text-xl font-semibold mb-4">Редактировать клиента</h3>
          <form @submit.prevent="updateClientData" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold" for="editName">Имя *</label>
              <input v-model="editingClient.name" id="editName" type="text" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="editPhone">Телефон *</label>
              <input v-model="editingClient.phone" id="editPhone" type="text" required
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="editEmail">Email</label>
              <input v-model="editingClient.email" id="editEmail" type="email"
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label class="block mb-1 font-semibold" for="editAddress">Адрес</label>
              <input v-model="editingClient.address" id="editAddress" type="text"
                class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200" />
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
import { ref, computed } from 'vue'
import { useClientsStore } from '../stores/clients'

export default {
  name: 'Clients',
    setup() {
      const clientsStore = useClientsStore()
      const clients = computed(() => clientsStore.clients)

      clientsStore.fetchClients()  // Added to load clients on setup

      const showAddModal = ref(false)
      const newClient = ref({
        name: '',
        phone: '',
        email: '',
        address: '',
      })

      const editingClient = ref(null)

      function openAddModal() {
        showAddModal.value = true
        newClient.value = {
          name: '',
          phone: '',
          email: '',
          address: '',
        }
      }

      function closeAddModal() {
        showAddModal.value = false
      }

      async function addNewClient() {
        if (!newClient.value.name.trim() || !newClient.value.phone.trim()) return
        const clientToAdd = {
          name: newClient.value.name.trim(),
          phone: newClient.value.phone.trim(),
          email: newClient.value.email.trim() || '',
          address: newClient.value.address.trim() || '',
        }
        const result = await clientsStore.addClient(clientToAdd)
        if (result) {
          newClient.value = {
            name: '',
            phone: '',
            email: '',
            address: '',
          }
        }
        closeAddModal()

      }

      function editClient(client) {
        editingClient.value = { ...client }
      }

      function updateClientData() {
        if (!editingClient.value.name.trim() || !editingClient.value.phone.trim()) return
        clientsStore.updateClient(editingClient.value.id, {
          name: editingClient.value.name.trim(),
          phone: editingClient.value.phone.trim(),
          email: editingClient.value.email.trim() || '',
          address: editingClient.value.address.trim() || '',
        })
        editingClient.value = null
      }

      function cancelEdit() {
        editingClient.value = null
      }

      function deleteClient(id) {
        clientsStore.removeClient(id)
      }

      function formatDate(dateStr) {
        if (!dateStr) return '-'
        const date = new Date(dateStr)
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
      }

      return {
        clients,
        showAddModal,
        newClient,
        editingClient,
        openAddModal,
        closeAddModal,
        addNewClient,
        editClient,
        updateClientData,
        cancelEdit,
        deleteClient,
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
