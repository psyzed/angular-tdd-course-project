export interface UserSignupInfo {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  id?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UserPage {
  content: User[];
  page: number;
  size: number;
  totalPages: number;
}
