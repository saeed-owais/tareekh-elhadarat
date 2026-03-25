export interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  errors: string[] | null;
  data: T;
}
