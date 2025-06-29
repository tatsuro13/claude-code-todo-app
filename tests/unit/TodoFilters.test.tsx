import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TodoFilters } from '~/components/todo/TodoFilters'

describe('TodoFilters', () => {
  const defaultProps = {
    currentFilter: 'all' as const,
    onFilterChange: vi.fn(),
    searchTerm: '',
    onSearchChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all filter buttons', () => {
    render(<TodoFilters {...defaultProps} />)
    
    expect(screen.getByText('すべて')).toBeInTheDocument()
    expect(screen.getByText('未完了')).toBeInTheDocument()
    expect(screen.getByText('完了済み')).toBeInTheDocument()
  })

  it('highlights current filter', () => {
    render(<TodoFilters {...defaultProps} currentFilter="active" />)
    
    const activeButton = screen.getByText('未完了')
    expect(activeButton).toHaveClass('bg-blue-600', 'text-white')
    
    const allButton = screen.getByText('すべて')
    expect(allButton).toHaveClass('bg-gray-100', 'text-gray-700')
  })

  it('calls onFilterChange when filter button is clicked', () => {
    const onFilterChange = vi.fn()
    render(<TodoFilters {...defaultProps} onFilterChange={onFilterChange} />)
    
    const activeButton = screen.getByText('未完了')
    fireEvent.click(activeButton)
    
    expect(onFilterChange).toHaveBeenCalledWith('active')
  })

  it('renders search input with correct placeholder', () => {
    render(<TodoFilters {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Todoを検索...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveValue('')
  })

  it('displays search term in input', () => {
    render(<TodoFilters {...defaultProps} searchTerm="テスト" />)
    
    const searchInput = screen.getByDisplayValue('テスト')
    expect(searchInput).toBeInTheDocument()
  })

  it('calls onSearchChange when search input changes', () => {
    const onSearchChange = vi.fn()
    render(<TodoFilters {...defaultProps} onSearchChange={onSearchChange} />)
    
    const searchInput = screen.getByPlaceholderText('Todoを検索...')
    fireEvent.change(searchInput, { target: { value: 'テスト検索' } })
    
    expect(onSearchChange).toHaveBeenCalledWith('テスト検索')
  })

  it('shows clear button when search term exists', () => {
    render(<TodoFilters {...defaultProps} searchTerm="テスト" />)
    
    const clearButtons = screen.getAllByRole('button')
    const clearButton = clearButtons.find(button => button.querySelector('svg'))
    expect(clearButton).toBeInTheDocument()
  })

  it('hides clear button when search term is empty', () => {
    render(<TodoFilters {...defaultProps} searchTerm="" />)
    
    const allButtons = screen.getAllByRole('button')
    const clearButton = allButtons.find(button => button.querySelector('svg[viewBox="0 0 24 24"]'))
    expect(clearButton).toBeUndefined()
  })

  it('clears search when clear button is clicked', () => {
    const onSearchChange = vi.fn()
    render(<TodoFilters {...defaultProps} searchTerm="テスト" onSearchChange={onSearchChange} />)
    
    const clearButtons = screen.getAllByRole('button')
    const clearButton = clearButtons.find(button => button.querySelector('svg'))
    fireEvent.click(clearButton!)
    
    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  it('applies focus styles to search input', () => {
    render(<TodoFilters {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Todoを検索...')
    
    // Focus the input
    fireEvent.focus(searchInput)
    expect(searchInput).toHaveClass('border-blue-300', 'bg-blue-50')
    
    // Blur the input
    fireEvent.blur(searchInput)
    expect(searchInput).toHaveClass('border-gray-300', 'bg-white')
  })

  it('renders filter icons correctly', () => {
    render(<TodoFilters {...defaultProps} />)
    
    expect(screen.getByText('📋')).toBeInTheDocument() // All filter icon
    expect(screen.getByText('⏳')).toBeInTheDocument() // Active filter icon
    expect(screen.getByText('✅')).toBeInTheDocument() // Completed filter icon
  })

  it('renders search icon', () => {
    render(<TodoFilters {...defaultProps} />)
    
    const searchIcon = document.querySelector('svg')
    expect(searchIcon).toBeInTheDocument()
  })
})