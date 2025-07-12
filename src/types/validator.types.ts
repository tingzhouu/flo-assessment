import { ValidationSeverity } from '../constants/validator.constants';

export interface ValidationError {
  line: number;
  field?: string;
  message: string;
  severity: ValidationSeverity;
  code: string;
}
