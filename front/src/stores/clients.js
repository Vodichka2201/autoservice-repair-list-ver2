import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/strapi'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])

  // Для Strapi 5 данные приходят напрямую, без обертки в attributes
  function transformClientData(item) {
    return {
      id: item.id,
      name: item.name || 'Без имени',
      phone: item.phone || 'Не указан',
      email: item.email || 'Не указан',
      address: item.address || '',
      registrationDate: item.registrationDate || new Date().toISOString().split('T')[0],
      notes: item.notes || '',
      ...item
    }
  }

  async function fetchClients() {
    try {
      const response = await api.get('/api/clients')
      
      // Handle both direct array response and { data: [...] } format
      const responseData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data
        
      if (!Array.isArray(responseData)) {
        throw new Error('Некорректная структура ответа API')
      }

      clients.value = responseData.map(transformClientData)
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error)
      clients.value = []
      throw error
    }
  }

  async function addClient(client) {
    try {
      const clientData = {
        name: client.name || 'Новый клиент',
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
        registrationDate: client.registrationDate || new Date().toISOString().split('T')[0],
        notes: client.notes || ''
      }
      
      const response = await api.post('/api/clients', clientData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const newClient = transformClientData(response.data)
      clients.value.push(newClient)
      return newClient
    } catch (error) {
      console.error('Ошибка добавления клиента:', error)
      throw error
    }
  }

  async function updateClient(id, updatedClient) {
    try {
      const clientData = {
        name: updatedClient.name,
        phone: updatedClient.phone,
        email: updatedClient.email,
        address: updatedClient.address,
        registrationDate: updatedClient.registrationDate,
        notes: updatedClient.notes
      }
      
      const response = await api.put(`/api/clients/${id}`, clientData)
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index] = transformClientData(response.data)
      }
    } catch (error) {
      console.error('Ошибка обновления клиента:', error)
      throw error
    }
  }

  async function removeClient(id) {
    try {
      await api.delete(`/api/clients/${id}`)
      clients.value = clients.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Ошибка удаления клиента:', error)
      throw error
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
