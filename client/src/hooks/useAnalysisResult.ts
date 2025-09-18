import { useRef } from 'react';
import { Analysis } from '../types/analysis';

let analysisResult: Analysis | null = null;

export function useAnalysisResult() {
  const resultRef = useRef<Analysis | null>(analysisResult);
  const saveResult = (data: Analysis) => {
    analysisResult = data;
    resultRef.current = data;
  };
  return { result: resultRef.current, saveResult };
}
