import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/strapi'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])

  async function fetchOrders() {
    try {
      const response = await api.get('/orders')
      orders.value = response.data.data.map(item => ({
        id: item.id,
        ...item.attributes
      }))
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error)
    }
  }

  async function addOrder(order) {
    try {
      const response = await api.post('/orders', { data: order })
      orders.value.push({
        id: response.data.data.id,
        ...response.data.data.attributes
      })
    } catch (error) {
      console.error('Ошибка добавления заказа:', error)
    }
  }

  async function updateOrder(id, updatedOrder) {
    try {
      const response = await api.put(`/orders/${id}`, { data: updatedOrder })
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = {
          id: response.data.data.id,
          ...response.data.data.attributes
        }
      }
    } catch (error) {
      console.error('Ошибка обновления заказа:', error)
    }
  }

  async function removeOrder(id) {
    try {
      await api.delete(`/orders/${id}`)
      orders.value = orders.value.filter(o => o.id !== id)
    } catch (error) {
      console.error('Ошибка удаления заказа:', error)
    }
  }

  function getOrderById(id) {
    return orders.value.find(o => o.id === id)
  }

  function getOrdersInRepair() {
    return orders.value.filter(o => o.status === 'in_repair')
  }

  return {
    orders,
    fetchOrders,
    addOrder,
    updateOrder,
    removeOrder,
    getOrderById,
    getOrdersInRepair,
  }
})
