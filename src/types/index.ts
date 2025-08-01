export * from './auth';
export * from './product';

export interface ApiError {
  message: string;
  status?: number;
}