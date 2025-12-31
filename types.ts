
export interface AnalysisCheck {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'danger';
  message: string;
  impact: number;
}

export interface AnalysisResult {
  id: string;
  url: string;
  score: number;
  checks: AnalysisCheck[];
  timestamp: number;
  aiInsights?: string;
}

export type RiskLevel = 'low' | 'medium' | 'high';
