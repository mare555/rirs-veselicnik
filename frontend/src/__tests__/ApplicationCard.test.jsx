import { render, screen } from '@testing-library/react';
import ApplicationCard from '../components/ApplicationCard';  // Make sure this path is correct

describe('ApplicationCard component', () => {
  test('shows submitted date when present', () => {
    const submitted_at = new Date().toISOString();
    const formattedDate = new Date(submitted_at).toLocaleDateString('en-GB'); // Format as DD/MM/YYYY

    render(<ApplicationCard application={{ first_name: 'Alice', last_name: 'Johnson', email: 'a@a.com', submitted_at }} />);

    // Log the entire DOM for debugging
    screen.debug();

    // Query for the text that contains "Submitted:" and the formatted date
    const submittedText = screen.getByText((content, element) => {
      console.log(content);  // Log content to check what is being returned
      return content.includes('Submitted:') && content.includes(formattedDate);
    });

    console.log(submittedText);  // Check what `submittedText` contains
    expect(submittedText).toBeInTheDocument();  // This will fail if `submittedText` is null or undefined
  });
});
