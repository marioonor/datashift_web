export interface RegistrationPayload {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface UserResponse {
  id: number; 
  name: string;
  token: string;
  expiresAt?: number; 
  tokenType?: string;
  email?: string;     
  role?: string; 
}