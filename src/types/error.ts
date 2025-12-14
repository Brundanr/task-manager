export interface ErrorLog {
  id: string;
  message: string;
  statusCode: number;
  userId: string;
  stack?: string;
  timestamp?: string;
}

export interface ErrorScreenParams {
  error: string;
  statusCode: number;
}
