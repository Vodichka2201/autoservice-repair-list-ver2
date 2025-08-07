import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/strapi'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])

  async function fetchClients() {
    try {
      const response = await api.get('/api/clients', {
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.data?.data) {
        throw new Error('Invalid API response structure')
      }

      clients.value = Array.isArray(response.data.data) 
        ? response.data.data.map(item => ({
            id: item.id,
            ...item.attributes
          }))
        : []
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error)
      clients.value = []
      throw error
    }
  }

  async function addClient(client) {
    try {
      const clientData = { ...client }
      delete clientData.id
      if (!clientData.registrationDate) {
        clientData.registrationDate = new Date().toISOString().split('T')[0]
      }
      const response = await api.post('/api/clients', { data: clientData })
      const newClient = {
        id: response.data.data.id,
        ...response.data.data.attributes
      }
      clients.value.push(newClient)
      return newClient
    } catch (error) {
      console.error('Ошибка добавления клиента:', error)
      throw error
    }
  }

  async function updateClient(id, updatedClient) {
    try {
      const response = await api.put(`/api/clients/${id}`, { data: updatedClient })
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
      await api.delete(`/api/clients/${id}`)
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
    getClientById
  }
})
