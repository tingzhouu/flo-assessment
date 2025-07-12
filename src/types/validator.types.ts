import { ValidationSeverity } from '../constants/nem12-validator.constants';

export interface ValidationError {
  line: number;
  field?: string;
  message: string;
  severity: ValidationSeverity;
  code: string;
}
