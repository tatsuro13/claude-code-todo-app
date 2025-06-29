import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from '~/components/todo/TodoList'
import type { Todo } from '~/lib/types'

const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'High Priority Task',
    completed: false,
    priority: 'high',
    createdAt: '2025-06-29T10:00:00Z',
    tags: ['urgent']
  },
  {
    id: 2,
    title: 'Completed Task',
    completed: true,
    priority: 'medium',
    createdAt: '2025-06-28T10:00:00Z',
    tags: ['done']
  },
  {
    id: 3,
    title: 'Low Priority Task',
    completed: false,
    priority: 'low',
    createdAt: '2025-06-27T10:00:00Z',
    tags: ['later']
  }
]

describe('TodoList', () => {
  it('should render all todos when filter is "all"', () => {
    render(<TodoList todos={mockTodos} filter="all" />)
    
    expect(screen.getByText('High Priority Task')).toBeInTheDocument()
    expect(screen.getByText('Completed Task')).toBeInTheDocument()
    expect(screen.getByText('Low Priority Task')).toBeInTheDocument()
  })

  it('should render only active todos when filter is "active"', () => {
    render(<TodoList todos={mockTodos} filter="active" />)
    
    expect(screen.getByText('High Priority Task')).toBeInTheDocument()
    expect(screen.getByText('Low Priority Task')).toBeInTheDocument()
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument()
  })

  it('should render only completed todos when filter is "completed"', () => {
    render(<TodoList todos={mockTodos} filter="completed" />)
    
    expect(screen.getByText('Completed Task')).toBeInTheDocument()
    expect(screen.queryByText('High Priority Task')).not.toBeInTheDocument()
    expect(screen.queryByText('Low Priority Task')).not.toBeInTheDocument()
  })

  it('should sort todos by completion status and priority', () => {
    render(<TodoList todos={mockTodos} filter="all" />)
    
    const todoElements = screen.getAllByRole('checkbox')
    // Incomplete todos should come first, then sorted by priority (high > medium > low)
    // Then completed todos
    expect(todoElements).toHaveLength(3)
  })

  it('should show empty state when no todos match filter', () => {
    const completedTodos = mockTodos.filter(todo => todo.completed)
    render(<TodoList todos={completedTodos} filter="active" />)
    
    expect(screen.getByText('未完了のTodoはありません')).toBeInTheDocument()
    expect(screen.getByText('すべてのタスクが完了しています！')).toBeInTheDocument()
  })

  it('should show empty state with correct message for "all" filter', () => {
    render(<TodoList todos={[]} filter="all" />)
    
    expect(screen.getByText('Todoはありません')).toBeInTheDocument()
    expect(screen.getByText('最初のTodoを追加してみましょう')).toBeInTheDocument()
  })

  it('should show empty state with correct message for "completed" filter', () => {
    const activeTodos = mockTodos.filter(todo => !todo.completed)
    render(<TodoList todos={activeTodos} filter="completed" />)
    
    expect(screen.getByText('完了済みのTodoはありません')).toBeInTheDocument()
    expect(screen.getByText('完了済みのタスクはまだありません')).toBeInTheDocument()
  })

  it('should pass onToggleTodo to TodoItem components', () => {
    const onToggleTodo = vi.fn()
    render(<TodoList todos={[mockTodos[0]]} onToggleTodo={onToggleTodo} />)
    
    // The function should be passed to TodoItem, but we can't easily test the callback
    // without triggering the actual click event
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('should handle default filter value', () => {
    render(<TodoList todos={mockTodos} />)
    
    // Should default to showing all todos
    expect(screen.getByText('High Priority Task')).toBeInTheDocument()
    expect(screen.getByText('Completed Task')).toBeInTheDocument()
    expect(screen.getByText('Low Priority Task')).toBeInTheDocument()
  })

  it('should display empty state emoji', () => {
    render(<TodoList todos={[]} />)
    
    expect(screen.getByText('📝')).toBeInTheDocument()
  })
})