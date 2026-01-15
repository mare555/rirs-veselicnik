import { render, screen } from '@testing-library/react';
import JobCard from '../components/JobCard';

test('handles long job title', () => {
  const long = 'A'.repeat(300); // Create a long job title string
  render(<JobCard job={{ job_title: long, job_description: 'd' }} />);
  
  // Ensure that the long job title is rendered correctly
  expect(screen.getByText(long)).toBeTruthy();
});

test('apply button has accessible name', () => {
  render(<JobCard job={{ job_title: 'Dev', job_description: 'd' }} />);
  
  // Get the button by role and check if it has an accessible name
  const btn = screen.getByRole('button', { name: /apply/i });
  expect(btn).toBeTruthy();
});

test('handles missing job title gracefully', () => {
  const job = {}; // Missing job_title and job_description
  render(<JobCard job={job} />);
  expect(screen.getByText("No job title provided")).toBeTruthy();
  expect(screen.getByText("No description provided")).toBeTruthy();
});