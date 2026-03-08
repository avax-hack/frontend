export interface IApiResponse<T> {
  data: T;
  message?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface IApiError {
  status: number;
  message: string;
}
