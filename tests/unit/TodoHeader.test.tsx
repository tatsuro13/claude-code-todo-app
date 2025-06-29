import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoHeader } from '~/components/todo/TodoHeader'

describe('TodoHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders header title', () => {
    render(<TodoHeader totalCount={5} completedCount={2} />)
    
    expect(screen.getByText('Todo リスト')).toBeInTheDocument()
  })

  it('displays correct counts', () => {
    render(<TodoHeader totalCount={5} completedCount={2} />)
    
    expect(screen.getByText('2 / 5')).toBeInTheDocument()
    expect(screen.getByText('完了済み')).toBeInTheDocument()
  })

  it('calculates and displays correct percentage', () => {
    render(<TodoHeader totalCount={5} completedCount={2} />)
    
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  it('displays 0% when totalCount is 0', () => {
    render(<TodoHeader totalCount={0} completedCount={0} />)
    
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('0 / 0')).toBeInTheDocument()
  })

  it('displays 100% when all todos are completed', () => {
    render(<TodoHeader totalCount={5} completedCount={5} />)
    
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('5 / 5')).toBeInTheDocument()
  })

  it('displays correct remaining and completed counts', () => {
    render(<TodoHeader totalCount={10} completedCount={3} />)
    
    expect(screen.getByText('残り: 7件')).toBeInTheDocument()
    expect(screen.getByText('完了: 3件')).toBeInTheDocument()
  })

  it('renders progress bar with correct width', () => {
    render(<TodoHeader totalCount={10} completedCount={4} />)
    
    const progressBar = document.querySelector('.bg-blue-600')
    expect(progressBar).toHaveAttribute('style', 'width: 40%;')
  })

  it('renders progress bar with 0% width when no todos completed', () => {
    render(<TodoHeader totalCount={5} completedCount={0} />)
    
    const progressBar = document.querySelector('.bg-blue-600')
    expect(progressBar).toHaveAttribute('style', 'width: 0%;')
  })

  it('renders progress bar with 100% width when all todos completed', () => {
    render(<TodoHeader totalCount={3} completedCount={3} />)
    
    const progressBar = document.querySelector('.bg-blue-600')
    expect(progressBar).toHaveAttribute('style', 'width: 100%;')
  })

  it('rounds percentage correctly', () => {
    render(<TodoHeader totalCount={3} completedCount={1} />)
    
    // 1/3 = 33.333... should round to 33%
    expect(screen.getByText('33%')).toBeInTheDocument()
  })

  it('has proper progress bar styling classes', () => {
    render(<TodoHeader totalCount={5} completedCount={2} />)
    
    const progressBar = document.querySelector('.bg-blue-600')
    expect(progressBar).toHaveClass('bg-blue-600', 'h-3', 'rounded-full', 'transition-all', 'duration-300', 'ease-in-out')
  })

  it('displays progress status text', () => {
    render(<TodoHeader totalCount={8} completedCount={3} />)
    
    expect(screen.getByText('進捗状況')).toBeInTheDocument()
  })
})