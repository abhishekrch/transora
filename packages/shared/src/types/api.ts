export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
