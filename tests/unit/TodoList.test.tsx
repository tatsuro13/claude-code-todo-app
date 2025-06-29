import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from '~/components/todo/TodoList'
import type { Todo } from '~/lib/types'

const mockTodos: Todo[] = [
  {
    id: 1,
    title: '高優先度タスク',
    completed: false,
    priority: 'high',
    createdAt: '2024-01-03T00:00:00Z',
    tags: ['重要'],
  },
  {
    id: 2,
    title: '完了済みタスク',
    completed: true,
    priority: 'medium',
    createdAt: '2024-01-02T00:00:00Z',
    tags: ['完了'],
  },
  {
    id: 3,
    title: '低優先度タスク',
    completed: false,
    priority: 'low',
    createdAt: '2024-01-01T00:00:00Z',
    tags: ['後回し'],
  },
]

describe('TodoList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders all todos when filter is "all"', () => {
    render(<TodoList todos={mockTodos} filter="all" />)
    
    expect(screen.getByText('高優先度タスク')).toBeInTheDocument()
    expect(screen.getByText('完了済みタスク')).toBeInTheDocument()
    expect(screen.getByText('低優先度タスク')).toBeInTheDocument()
  })

  it('renders only active todos when filter is "active"', () => {
    render(<TodoList todos={mockTodos} filter="active" />)
    
    expect(screen.getByText('高優先度タスク')).toBeInTheDocument()
    expect(screen.queryByText('完了済みタスク')).not.toBeInTheDocument()
    expect(screen.getByText('低優先度タスク')).toBeInTheDocument()
  })

  it('renders only completed todos when filter is "completed"', () => {
    render(<TodoList todos={mockTodos} filter="completed" />)
    
    expect(screen.queryByText('高優先度タスク')).not.toBeInTheDocument()
    expect(screen.getByText('完了済みタスク')).toBeInTheDocument()
    expect(screen.queryByText('低優先度タスク')).not.toBeInTheDocument()
  })

  it('sorts todos correctly (incomplete first, then by priority, then by date)', () => {
    render(<TodoList todos={mockTodos} filter="all" />)
    
    const todoItems = screen.getAllByRole('checkbox')
    // First should be high priority incomplete task
    // Second should be low priority incomplete task  
    // Third should be completed task
    expect(todoItems).toHaveLength(3)
    expect(todoItems[0]).not.toBeChecked() // high priority
    expect(todoItems[1]).not.toBeChecked() // low priority
    expect(todoItems[2]).toBeChecked() // completed
  })

  it('displays empty state for no todos', () => {
    render(<TodoList todos={[]} filter="all" />)
    
    expect(screen.getByText('Todoはありません')).toBeInTheDocument()
    expect(screen.getByText('最初のTodoを追加してみましょう')).toBeInTheDocument()
    expect(screen.getByText('📝')).toBeInTheDocument()
  })

  it('displays empty state for no active todos', () => {
    const completedTodos = mockTodos.map(todo => ({ ...todo, completed: true }))
    render(<TodoList todos={completedTodos} filter="active" />)
    
    expect(screen.getByText('未完了のTodoはありません')).toBeInTheDocument()
    expect(screen.getByText('すべてのタスクが完了しています！')).toBeInTheDocument()
  })

  it('displays empty state for no completed todos', () => {
    const activeTodos = mockTodos.map(todo => ({ ...todo, completed: false }))
    render(<TodoList todos={activeTodos} filter="completed" />)
    
    expect(screen.getByText('完了済みのTodoはありません')).toBeInTheDocument()
    expect(screen.getByText('完了済みのタスクはまだありません')).toBeInTheDocument()
  })

  it('calls onToggleTodo when checkbox is clicked', () => {
    const onToggleTodo = vi.fn()
    render(<TodoList todos={mockTodos} onToggleTodo={onToggleTodo} />)
    
    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    firstCheckbox.click()
    
    expect(onToggleTodo).toHaveBeenCalledWith(expect.any(Number))
  })

  it('renders correct number of todo items', () => {
    render(<TodoList todos={mockTodos} filter="all" />)
    
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
  })

  it('defaults to "all" filter when no filter provided', () => {
    render(<TodoList todos={mockTodos} />)
    
    expect(screen.getByText('高優先度タスク')).toBeInTheDocument()
    expect(screen.getByText('完了済みタスク')).toBeInTheDocument()
    expect(screen.getByText('低優先度タスク')).toBeInTheDocument()
  })
})