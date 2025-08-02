import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/strapi'

export const useCarsStore = defineStore('cars', () => {
  const cars = ref([])

  async function fetchCars() {
    try {
      const response = await api.get('/cars')
      // Adjusted to match actual response structure (response.data is an array)
      cars.value = response.data.map(item => ({
        id: item.id,
        ...item
      }))
    } catch (error) {
      console.error('Ошибка загрузки автомобилей:', error)
    }
  }

  async function addCar(car) {
    try {
      console.log('Adding car with data:', car)  // Added for debugging
      const response = await api.post('/cars', { data: car })
      console.log('API response for addCar:', response)  // Added for debugging
      cars.value.push({
        id: response.data.id,
        ...response.data
      })
    } catch (error) {
      console.error('Ошибка добавления автомобиля:', error)
    }
  }

  async function updateCar(id, updatedCar) {
    try {
      console.log('Updating car with id:', id, 'data:', updatedCar)  // Added for debugging
      const response = await api.put(`/cars/${id}`, { data: updatedCar })
      console.log('API response for updateCar:', response)  // Added for debugging
      const index = cars.value.findIndex(c => c.id === id)
      if (index !== -1) {
        cars.value[index] = {
          id: response.data.id,
          ...response.data
        }
      }
    } catch (error) {
      console.error('Ошибка обновления автомобиля:', error)
    }
  }

  async function removeCar(id) {
    try {
      console.log('Deleting car with id:', id)  // Added for debugging
      await api.delete(`/cars/${id}`)
      console.log('Car deleted, updating list')  // Added for debugging
      cars.value = cars.value.filter(c => c.id !== id)
      console.log('List updated, new length:', cars.value.length)  // Added for debugging
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
