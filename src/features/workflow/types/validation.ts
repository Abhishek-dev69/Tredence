export type ValidationSeverity = 'error' | 'warning';
export type ValidationScope = 'workflow' | 'node' | 'edge';

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  scope: ValidationScope;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  nodeIssueCount: Record<string, number>;
}
