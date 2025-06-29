import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from '~/components/todo/TodoItem'
import type { Todo } from '~/lib/types'

const mockTodo: Todo = {
  id: 1,
  title: 'テストタスク',
  description: 'テスト用の説明文です',
  completed: false,
  priority: 'high',
  createdAt: '2025-06-29T10:00:00Z',
  tags: ['テスト', '重要']
}

const completedTodo: Todo = {
  ...mockTodo,
  id: 2,
  title: '完了済みタスク',
  completed: true,
  priority: 'low'
}

describe('TodoItem', () => {
  it('should render todo title and description', () => {
    render(<TodoItem todo={mockTodo} />)
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.getByText('テスト用の説明文です')).toBeInTheDocument()
  })

  it('should display priority badge correctly', () => {
    render(<TodoItem todo={mockTodo} />)
    
    expect(screen.getByText('優先度: 高')).toBeInTheDocument()
  })

  it('should display tags', () => {
    render(<TodoItem todo={mockTodo} />)
    
    expect(screen.getByText('テスト')).toBeInTheDocument()
    expect(screen.getByText('重要')).toBeInTheDocument()
  })

  it('should show checkbox unchecked for incomplete todo', () => {
    render(<TodoItem todo={mockTodo} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('should show checkbox checked for completed todo', () => {
    render(<TodoItem todo={completedTodo} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('should apply strikethrough style for completed todo', () => {
    render(<TodoItem todo={completedTodo} />)
    
    const title = screen.getByText('完了済みタスク')
    expect(title).toHaveClass('line-through')
  })

  it('should call onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it('should display formatted date', () => {
    render(<TodoItem todo={mockTodo} />)
    
    // Date formatting logic should show relative time
    expect(screen.getByText(/日前|週間前/)).toBeInTheDocument()
  })

  it('should apply correct priority color classes', () => {
    const { container } = render(<TodoItem todo={mockTodo} />)
    
    const todoElement = container.firstChild as HTMLElement
    expect(todoElement).toHaveClass('border-l-red-500', 'bg-red-50')
  })

  it('should render without description when not provided', () => {
    const todoWithoutDescription = { ...mockTodo, description: undefined }
    render(<TodoItem todo={todoWithoutDescription} />)
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.queryByText('テスト用の説明文です')).not.toBeInTheDocument()
  })

  it('should handle empty tags array', () => {
    const todoWithoutTags = { ...mockTodo, tags: [] }
    render(<TodoItem todo={todoWithoutTags} />)
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.queryByText('テスト')).not.toBeInTheDocument()
  })
})