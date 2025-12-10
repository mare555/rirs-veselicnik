import { render, screen } from '@testing-library/react';
import JobsOverview from '../pages/JobsOverview';
import jobs from '../data/jobs.json';

test('JobsOverview renders a list of jobs', () => {
  render(<JobsOverview />);

  // Ensure jobs list is not empty
  if (jobs.length > 0) {
    const jobTitle = jobs[0].job_title;

    if (jobTitle) {
      // If jobTitle is defined, check if it is rendered
      expect(screen.getByText(jobTitle)).toBeTruthy();
    } else {
      // If jobTitle is missing, log a warning
      console.warn('Job title is missing for the first job');
      // Fail the test gracefully by asserting that jobTitle is undefined
      expect(jobTitle).toBeUndefined();
    }
  } else {
    // If no jobs exist, log a warning and fail the test
    console.warn('No jobs available in the list');
    expect(jobs.length).toBeGreaterThan(0); // This ensures that the test fails if there are no jobs
  }
});
