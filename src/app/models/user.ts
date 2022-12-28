import { UserRole } from './userRole';

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userRole: UserRole;
}
