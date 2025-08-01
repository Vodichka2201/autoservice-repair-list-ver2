import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/strapi'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])

  async function fetchClients() {
    try {
      const response = await api.get('/clients')
      console.log('API response for clients:', response)  // Added for debugging
      // Adjusted to match actual response structure (response.data is an array)
      clients.value = response.data.map(item => ({
        id: item.id,
        ...item
      }))
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error)
    }
  }

  async function addClient(client) {
    try {
      console.log('Adding client with data:', client)  // Added for debugging
      if (!client.registrationDate) {
        client.registrationDate = new Date().toISOString().split('T')[0]
      }
      const response = await api.post('/clients', { data: client })
      console.log('API response for addClient:', response)  // Added for debugging
      const data = response.data && response.data.data ? response.data.data : response.data
      clients.value.push({
        id: data.id,
        ...data.attributes
      })
    } catch (error) {
      console.error('Ошибка добавления клиента:', error)
    }
  }

  async function updateClient(id, updatedClient) {
    try {
      const response = await api.put(`/clients/${id}`, { data: updatedClient })
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index] = {
          id: response.data.id,
          ...response.data
        }
      }
    } catch (error) {
      console.error('Ошибка обновления клиента:', error)
    }
  }

  async function removeClient(id) {
    try {
      await api.delete(`/clients/${id}`)
      clients.value = clients.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Ошибка удаления клиента:', error)
    }
  }

  function getClientById(id) {
    return clients.value.find(c => c.id === id)
  }

  return {
    clients,
    fetchClients,
    addClient,
    updateClient,
    removeClient,
    getClientById,
  }
})
