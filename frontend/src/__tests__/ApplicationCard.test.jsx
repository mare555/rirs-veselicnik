import { render, screen } from '@testing-library/react'
import ApplicationCard from '../components/ApplicationCard'

describe('ApplicationCard component', () => {
  test('renders applicant name and email', () => {
    render(<ApplicationCard application={{ first_name: 'Alice', last_name: 'Johnson', email: 'a@a.com' }} />)
    expect(screen.getByText(/Alice/)).toBeTruthy()
    expect(screen.getByText(/a@a.com/)).toBeTruthy()
  })

  test('shows submitted date when present', () => {
    const submitted_at = new Date().toISOString()
    render(<ApplicationCard application={{ first_name: 'Alice', last_name: 'Johnson', email: 'a@a.com', submitted_at }} />)
    expect(screen.getByText(/Submitted/)).toBeTruthy()
  })
})
