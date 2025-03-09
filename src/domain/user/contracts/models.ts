export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  NORMAL = 'normal',
}

export interface User {
  id: string
  createdAt: string
  updatedAt: string | null
  name: string
  email: string | null
  document: string
  password: string
  phone: string | null
  status: UserStatus
  role: UserRole
  image: string | null
}

export interface UserWithoutPassword extends Omit<User, 'password'> {
  password?: string
}

export interface UserFormatProps {
  documentFormatted: string
  phoneFormatted: string | null
  statusFormatted: string
  roleFormatted: string
  createdAtFormatted: string
}

export interface UserWithoutPasswordFormatted extends UserWithoutPassword, UserFormatProps {}
