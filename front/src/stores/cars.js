import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/strapi'

export const useCarsStore = defineStore('cars', () => {
  const cars = ref([])

  async function fetchCars() {
    try {
      const response = await api.get('/cars')
      cars.value = response.data.data.map(item => ({
        id: item.id,
        ...item.attributes
      }))
    } catch (error) {
      console.error('Ошибка загрузки автомобилей:', error)
    }
  }

  async function addCar(car) {
    try {
      const response = await api.post('/cars', { data: car })
      cars.value.push({
        id: response.data.data.id,
        ...response.data.data.attributes
      })
    } catch (error) {
      console.error('Ошибка добавления автомобиля:', error)
    }
  }

  async function updateCar(id, updatedCar) {
    try {
      const response = await api.put(`/cars/${id}`, { data: updatedCar })
      const index = cars.value.findIndex(c => c.id === id)
      if (index !== -1) {
        cars.value[index] = {
          id: response.data.data.id,
          ...response.data.data.attributes
        }
      }
    } catch (error) {
      console.error('Ошибка обновления автомобиля:', error)
    }
  }

  async function removeCar(id) {
    try {
      await api.delete(`/cars/${id}`)
      cars.value = cars.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Ошибка удаления автомобиля:', error)
    }
  }

  function getCarById(id) {
    return cars.value.find(c => c.id === id)
  }

  return {
    cars,
    fetchCars,
    addCar,
    updateCar,
    removeCar,
    getCarById,
  }
})
