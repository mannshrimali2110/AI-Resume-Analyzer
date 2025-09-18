export type Analysis = {
  matchScore: number;
  missingKeywords: { term: string; importance: 1|2|3; reason?: string }[];
  sectionFeedback: {
    experience: { summary: string; items: { issue: string; fix: string; priority: 'low'|'med'|'high' }[] };
    skills: { summary: string; items: { issue: string; fix: string; priority: 'low'|'med'|'high' }[] };
    education: { summary: string; items: { issue: string; fix: string; priority: 'low'|'med'|'high' }[] };
    certifications: { summary: string; items: { issue: string; fix: string; priority: 'low'|'med'|'high' }[] };
  };
  improvementSuggestions: { action: string; example: string; impact: 'low'|'med'|'high' }[];
  keywordCoverage: { [term: string]: { present: boolean; occurrences: number } };
  atsHints: string[];
};
