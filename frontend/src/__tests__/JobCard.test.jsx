// JobCard.test.jsx
import { render, screen } from '@testing-library/react';
import JobCard from '../components/JobCard';

describe('JobCard component', () => {
  test('renders title and description', () => {
    const job = { job_title: 'Dev', job_description: 'Build stuff' };
    render(<JobCard job={job} />);  // Pass job as prop
    expect(screen.getByText('Dev')).toBeTruthy();
    expect(screen.getByText('Build stuff')).toBeTruthy();
  });

  test('renders apply button', () => {
    const job = { job_title: 'Dev', job_description: 'Build stuff' };
    render(<JobCard job={job} />);  // Pass job as prop
    expect(screen.getByRole('button')).toBeTruthy();
  });
});
