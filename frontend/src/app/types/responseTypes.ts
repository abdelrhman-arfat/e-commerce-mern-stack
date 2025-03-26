export type TResponse<T> = {
  results?: T[];
  totalPages?: number;
  currentPage?: number;
  totalData?: number;
  code: number;
  message: string;
  error?: string;
};
