export interface AuthResponse {
  isSuccess: boolean;
  statusCode: number;
  errors: string[] | null;
  data: {
    jwtToken: string;
    expiryAt: string;
  };
}