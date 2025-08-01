import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/strapi'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])

  async function fetchClients() {
    try {
      const response = await api.get('/clients')
      clients.value = response.data.data.map(item => ({
        id: item.id,
        ...item.attributes
      }))
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error)
    }
  }

  async function addClient(client) {
    try {
      if (!client.registrationDate) {
        client.registrationDate = new Date().toISOString().split('T')[0]
      }
      const response = await api.post('/clients', { data: client })
      clients.value.push({
        id: response.data.data.id,
        ...response.data.data.attributes
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
          id: response.data.data.id,
          ...response.data.data.attributes
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
