import { UserRole } from '@prisma/client';

export interface TokenPayload {
  userId: number;
  role: UserRole;
  tokenType: 'access' | 'refresh';
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
}
