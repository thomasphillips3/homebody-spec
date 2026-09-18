import type { HomeRecord } from "./homeRecord.js";

export interface HomeRecordValidationError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: Record<string, unknown>;
  message?: string;
}

export interface HomeRecordValidator {
  (data: unknown): data is HomeRecord;
  errors: HomeRecordValidationError[] | null;
}

declare const validateHomeRecord: HomeRecordValidator;
export default validateHomeRecord;
