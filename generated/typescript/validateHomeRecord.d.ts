import type { ErrorObject } from "ajv";
import type { HomeRecord } from "./homeRecord.js";

export interface HomeRecordValidator {
  (data: unknown): data is HomeRecord;
  errors: ErrorObject[] | null;
}

declare const validateHomeRecord: HomeRecordValidator;
export default validateHomeRecord;
