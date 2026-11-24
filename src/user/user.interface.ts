//used in auth module

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export interface UserInterface {
  id: string;
  email: string;
  emailVerified: boolean;
  role: Role;
}
