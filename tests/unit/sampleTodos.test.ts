import { describe, it, expect } from 'vitest'
import { sampleTodos } from '~/data/sampleTodos'
import type { Todo } from '~/lib/types'

describe('sampleTodos', () => {
  it('should contain 10 todo items', () => {
    expect(sampleTodos).toHaveLength(10)
  })

  it('should have valid Todo structure for all items', () => {
    sampleTodos.forEach((todo: Todo) => {
      expect(todo).toHaveProperty('id')
      expect(todo).toHaveProperty('title')
      expect(todo).toHaveProperty('completed')
      expect(todo).toHaveProperty('priority')
      expect(todo).toHaveProperty('createdAt')
      expect(todo).toHaveProperty('tags')
      
      expect(typeof todo.id).toBe('number')
      expect(typeof todo.title).toBe('string')
      expect(typeof todo.completed).toBe('boolean')
      expect(['low', 'medium', 'high']).toContain(todo.priority)
      expect(typeof todo.createdAt).toBe('string')
      expect(Array.isArray(todo.tags)).toBe(true)
    })
  })

  it('should have some completed and some incomplete todos', () => {
    const completedTodos = sampleTodos.filter(todo => todo.completed)
    const incompleteTodos = sampleTodos.filter(todo => !todo.completed)
    
    expect(completedTodos.length).toBeGreaterThan(0)
    expect(incompleteTodos.length).toBeGreaterThan(0)
  })

  it('should have todos with different priorities', () => {
    const priorities = sampleTodos.map(todo => todo.priority)
    const uniquePriorities = [...new Set(priorities)]
    
    expect(uniquePriorities.length).toBeGreaterThan(1)
    expect(uniquePriorities).toContain('high')
  })

  it('should have valid ISO date strings', () => {
    sampleTodos.forEach(todo => {
      const date = new Date(todo.createdAt)
      expect(isNaN(date.getTime())).toBe(false)
      expect(todo.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
    })
  })

  it('should have unique IDs', () => {
    const ids = sampleTodos.map(todo => todo.id)
    const uniqueIds = [...new Set(ids)]
    
    expect(uniqueIds.length).toBe(sampleTodos.length)
  })
})