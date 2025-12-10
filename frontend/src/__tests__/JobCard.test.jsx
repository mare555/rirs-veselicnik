import { render, screen } from '@testing-library/react'
import JobCard from '../components/JobCard'

describe('JobCard component', () => {
  test('renders title and description', () => {
    render(<JobCard job={{ job_title: 'Dev', job_description: 'Build stuff' }} />)
    expect(screen.getByText('Dev')).toBeTruthy()
    expect(screen.getByText('Build stuff')).toBeTruthy()
  })

  test('renders apply button', () => {
    render(<JobCard job={{ job_title: 'Dev', job_description: 'Build stuff' }} />)
    expect(screen.getByRole('button')).toBeTruthy()
  })
})
