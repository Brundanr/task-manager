export enum UserRole {
  MEMBER = 'ROLE_MEMBER',
  ADMIN = 'ROLE_ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
