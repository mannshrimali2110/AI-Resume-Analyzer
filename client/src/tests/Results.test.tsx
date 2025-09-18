import { render, screen } from '@testing-library/react';
import Results from '../pages/Results';
import { Analysis } from '../types/analysis';
import * as useAnalysisResult from '../hooks/useAnalysisResult';

describe('Results Page', () => {
  it('shows no result message if no analysis', () => {
    jest.spyOn(useAnalysisResult, 'useAnalysisResult').mockReturnValue({ result: null, saveResult: jest.fn() });
    render(<Results />);
    expect(screen.getByText(/No analysis result found/i)).toBeInTheDocument();
  });

  it('renders analysis data', () => {
    const mockAnalysis: Analysis = {
      matchScore: 90,
      missingKeywords: [{ term: 'React', importance: 1 }],
      sectionFeedback: {
        experience: { summary: 'Good', items: [] },
        skills: { summary: 'Needs improvement', items: [] },
        education: { summary: 'OK', items: [] },
        certifications: { summary: 'None', items: [] },
      },
      improvementSuggestions: [{ action: 'Add React', example: 'Mention React in skills', impact: 'high' }],
      keywordCoverage: { React: { present: false, occurrences: 0 } },
      atsHints: ['Use more keywords'],
    };
    jest.spyOn(useAnalysisResult, 'useAnalysisResult').mockReturnValue({ result: mockAnalysis, saveResult: jest.fn() });
    render(<Results />);
    expect(screen.getByText(/Analysis Results/i)).toBeInTheDocument();
    expect(screen.getByText(/Match Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Keywords & Skills/i)).toBeInTheDocument();
    expect(screen.getByText(/Improvement Suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/Copy Feedback/i)).toBeInTheDocument();
  });
});
