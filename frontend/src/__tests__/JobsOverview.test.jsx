import { render, screen } from '@testing-library/react'
import JobsOverview from '../pages/JobsOverview'
import jobs from '../data/jobs.json'

test('JobsOverview renders a list of jobs', () => {
  render(<JobsOverview />)
  // ensure that at least the first job title is present
  if (jobs.length > 0) {
    expect(screen.getByText(jobs[0].job_title)).toBeTruthy()
  } else {
    expect(true).toBeTruthy()
  }
})
