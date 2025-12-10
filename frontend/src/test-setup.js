import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/' }),
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ element }) => element,
  Link: ({ children, to }) => ({ children, to }),
}))

// Mock API calls
vi.mock('./api.js', () => ({
  API: {
    getJobs: vi.fn().mockResolvedValue([
      { id: 1, job_title: 'Junior Software Engineer', job_description: 'Build stuff' },
    ]),
    getApplications: vi.fn().mockResolvedValue([]),
    login: vi.fn().mockResolvedValue({ success: true, token: 'test', role: 'applicant' }),
  },
  API_BASE: 'http://localhost:3000',
}))
