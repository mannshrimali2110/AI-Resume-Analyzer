import { render, screen, fireEvent } from '@testing-library/react';
import Analyzer from '../pages/Analyzer';

describe('Analyzer Page', () => {
  it('renders input fields and analyze button', () => {
    render(<Analyzer />);
    expect(screen.getByText(/Resume & Job Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Paste Resume/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Resume/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyze/i)).toBeInTheDocument();
  });

  it('disables analyze button for short input', () => {
    render(<Analyzer />);
    const button = screen.getByText(/Analyze/i);
    expect(button).toBeDisabled();
  });
});
