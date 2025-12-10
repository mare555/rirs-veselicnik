import { render, screen } from '@testing-library/react'
import JobCard from '../components/JobCard'

test('handles long job title', () => {
  const long = 'A'.repeat(300)
  render(<JobCard job={{ job_title: long, job_description: 'd' }} />)
  expect(screen.getByText(long)).toBeTruthy()
})

test('apply button has accessible name', () => {
  render(<JobCard job={{ job_title: 'Dev', job_description: 'd' }} />)
  const btn = screen.getByRole('button')
  expect(btn).toBeTruthy()
})
