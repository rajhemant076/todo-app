// hooks/useTodos.js — Todo state management hook
import { useState, useEffect, useCallback } from 'react'
import { todoService } from '../services/todoService'
import toast from 'react-hot-toast'

export const useTodos = (filters = {}) => {
  const [todos, setTodos] = useState([])
  const [stats, setStats] = useState({ total: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTodos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await todoService.getAll(filters)
      setTodos(data.todos)
      setStats(data.stats)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load todos.')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const createTodo = useCallback(async (formData) => {
    try {
      const data = await todoService.create(formData)
      toast.success('Task created!')
      await fetchTodos()
      return data.todo
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task.')
      throw err
    }
  }, [fetchTodos])

  const updateTodo = useCallback(async (id, formData) => {
    try {
      const data = await todoService.update(id, formData)
      toast.success('Task updated!')
      await fetchTodos()
      return data.todo
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task.')
      throw err
    }
  }, [fetchTodos])

  const toggleTodo = useCallback(async (id, completed) => {
    // Optimistic UI update
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed } : t))
    try {
      await todoService.toggle(id, completed)
      await fetchTodos()
    } catch (err) {
      // Revert on failure
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t))
      toast.error('Failed to update task.')
    }
  }, [fetchTodos])

  const deleteTodo = useCallback(async (id) => {
    try {
      await todoService.delete(id)
      toast.success('Task deleted.')
      setTodos(prev => prev.filter(t => t.id !== id))
      setStats(prev => ({ ...prev, total: prev.total - 1 }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task.')
      throw err
    }
  }, [])

  return { todos, stats, loading, error, fetchTodos, createTodo, updateTodo, toggleTodo, deleteTodo }
}
