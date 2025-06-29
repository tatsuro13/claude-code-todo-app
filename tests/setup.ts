import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock React Router dependencies
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}))

// Simple CSS class mocking for tests
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
})