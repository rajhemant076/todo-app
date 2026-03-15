// services/todoService.js — Todo API calls
import api from './api'

export const todoService = {
  // Fetch todos with optional filters
  getAll: async (params = {}) => {
    const res = await api.get('/todos', { params })
    return res.data.data
  },
  create: async (data) => {
    const res = await api.post('/todos', data)
    return res.data.data
  },
  update: async (id, data) => {
    const res = await api.put(`/todos/${id}`, data)
    return res.data.data
  },
  delete: async (id) => {
    const res = await api.delete(`/todos/${id}`)
    return res.data
  },
  toggle: async (id, completed) => {
    const res = await api.put(`/todos/${id}`, { completed })
    return res.data.data
  },
}
