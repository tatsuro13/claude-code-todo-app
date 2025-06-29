import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoFilters } from '~/components/todo/TodoFilters'

describe('TodoFilters', () => {
  const defaultProps = {
    currentFilter: 'all' as const,
    onFilterChange: vi.fn(),
    searchTerm: '',
    onSearchChange: vi.fn()
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render all filter buttons', () => {
    render(<TodoFilters {...defaultProps} />)
    
    expect(screen.getByText('すべて')).toBeInTheDocument()
    expect(screen.getByText('未完了')).toBeInTheDocument()
    expect(screen.getByText('完了済み')).toBeInTheDocument()
  })

  it('should highlight active filter button', () => {
    render(<TodoFilters {...defaultProps} currentFilter="active" />)
    
    const activeButton = screen.getByText('未完了').closest('button')
    const allButton = screen.getByText('すべて').closest('button')
    
    expect(activeButton).toHaveClass('bg-blue-600', 'text-white')
    expect(allButton).toHaveClass('bg-gray-100', 'text-gray-700')
  })

  it('should call onFilterChange when filter button is clicked', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    
    render(<TodoFilters {...defaultProps} onFilterChange={onFilterChange} />)
    
    await user.click(screen.getByText('未完了'))
    expect(onFilterChange).toHaveBeenCalledWith('active')
    
    await user.click(screen.getByText('完了済み'))
    expect(onFilterChange).toHaveBeenCalledWith('completed')
  })

  it('should render search input with placeholder', () => {
    render(<TodoFilters {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Todoを検索...')
    expect(searchInput).toBeInTheDocument()
  })

  it('should display current search term in input', () => {
    render(<TodoFilters {...defaultProps} searchTerm="テスト" />)
    
    const searchInput = screen.getByDisplayValue('テスト')
    expect(searchInput).toBeInTheDocument()
  })

  it('should call onSearchChange when typing in search input', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()
    
    render(<TodoFilters {...defaultProps} onSearchChange={onSearchChange} />)
    
    const searchInput = screen.getByPlaceholderText('Todoを検索...')
    await user.type(searchInput, 'test')
    
    expect(onSearchChange).toHaveBeenCalledTimes(4) // 't', 'e', 's', 't'
  })

  it('should show clear button when search term exists', () => {
    render(<TodoFilters {...defaultProps} searchTerm="テスト" />)
    
    const clearButton = screen.getByRole('button', { name: '検索キーワードをクリア' })
    expect(clearButton).toBeInTheDocument()
  })

  it('should not show clear button when search term is empty', () => {
    render(<TodoFilters {...defaultProps} searchTerm="" />)
    
    // Clear button should not be present when search term is empty
    const buttons = screen.getAllByRole('button')
    const clearButton = buttons.find(button => 
      button.querySelector('svg path[d*="M6 18L18 6M6 6l12 12"]')
    )
    expect(clearButton).toBeUndefined()
  })

  it('should call onSearchChange with empty string when clear button is clicked', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()
    
    render(<TodoFilters {...defaultProps} searchTerm="テスト" onSearchChange={onSearchChange} />)
    
    const clearButton = screen.getByRole('button', { name: '検索キーワードをクリア' })
    await user.click(clearButton)
    
    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  it('should display filter icons', () => {
    render(<TodoFilters {...defaultProps} />)
    
    expect(screen.getByText('📋')).toBeInTheDocument() // すべて
    expect(screen.getByText('⏳')).toBeInTheDocument() // 未完了
    expect(screen.getByText('✅')).toBeInTheDocument() // 完了済み
  })

  it('should apply focus styles to search input', async () => {
    const user = userEvent.setup()
    render(<TodoFilters {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Todoを検索...')
    
    await user.click(searchInput)
    expect(searchInput).toHaveClass('border-blue-300', 'bg-blue-50')
  })

  it('should render search icon', () => {
    render(<TodoFilters {...defaultProps} />)
    
    const searchIcon = document.querySelector('svg path[d*="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"]')
    expect(searchIcon).toBeInTheDocument()
  })
})