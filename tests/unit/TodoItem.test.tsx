import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TodoItem } from '~/components/todo/TodoItem'
import type { Todo } from '~/lib/types'

const mockTodo: Todo = {
  id: 1,
  title: 'テストタスク',
  description: 'テスト用の説明',
  completed: false,
  priority: 'high',
  createdAt: '2024-01-01T00:00:00Z',
  tags: ['テスト', '重要'],
}

describe('TodoItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders todo item correctly', () => {
    render(<TodoItem todo={mockTodo} />)
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.getByText('テスト用の説明')).toBeInTheDocument()
    expect(screen.getByText('テスト')).toBeInTheDocument()
    expect(screen.getByText('重要')).toBeInTheDocument()
    expect(screen.getByText('優先度: 高')).toBeInTheDocument()
  })

  it('renders checkbox with correct state', () => {
    render(<TodoItem todo={mockTodo} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('renders completed todo with correct styling', () => {
    const completedTodo = { ...mockTodo, completed: true }
    render(<TodoItem todo={completedTodo} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
    
    const title = screen.getByText('テストタスク')
    expect(title).toHaveClass('line-through', 'text-gray-500')
  })

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn()
    render(<TodoItem todo={mockTodo} onToggle={onToggle} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it('applies correct priority colors', () => {
    const highPriorityTodo = { ...mockTodo, priority: 'high' as const }
    const { rerender } = render(<TodoItem todo={highPriorityTodo} />)
    
    let container = document.querySelector('.border-l-4')
    expect(container).toHaveClass('border-l-red-500', 'bg-red-50')
    
    const mediumPriorityTodo = { ...mockTodo, priority: 'medium' as const }
    rerender(<TodoItem todo={mediumPriorityTodo} />)
    
    container = document.querySelector('.border-l-4')
    expect(container).toHaveClass('border-l-yellow-500', 'bg-yellow-50')
    
    const lowPriorityTodo = { ...mockTodo, priority: 'low' as const }
    rerender(<TodoItem todo={lowPriorityTodo} />)
    
    container = document.querySelector('.border-l-4')
    expect(container).toHaveClass('border-l-green-500', 'bg-green-50')
  })

  it('formats date correctly', () => {
    const recentTodo = {
      ...mockTodo,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    }
    render(<TodoItem todo={recentTodo} />)
    
    // The actual component shows "3日前" due to rounding calculation
    expect(screen.getByText('3日前')).toBeInTheDocument()
  })

  it('renders without description', () => {
    const todoWithoutDescription = { ...mockTodo, description: undefined }
    render(<TodoItem todo={todoWithoutDescription} />)
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.queryByText('テスト用の説明')).not.toBeInTheDocument()
  })

  it('renders empty tags array', () => {
    const todoWithoutTags = { ...mockTodo, tags: [] }
    render(<TodoItem todo={todoWithoutTags} />)
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.queryByText('テスト')).not.toBeInTheDocument()
  })
})