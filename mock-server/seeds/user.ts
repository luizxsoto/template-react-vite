import { User, UserRole, UserStatus } from '@/domain/user/contracts/models'

export const adminUserSeed: User = {
  id: '00000000-0000-4000-8000-000000000001',
  createdAt: new Date('2000-01-03').toISOString(),
  updatedAt: null,
  name: 'Usuário Admin',
  email: 'admin@email.com',
  document: '11790500000190',
  password: 'Password@123',
  phone: '27999999999',
  status: UserStatus.ACTIVE,
  role: UserRole.ADMIN,
  image:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcwkyucbMKaWQ_JgqKzVvXD6UGaEO8JACeWkYYc2mr7KKhdZUu7sZoKJICAp9LHkvfjOU&usqp=CAU',
}

export const managerUserSeed: User = {
  ...adminUserSeed,
  id: '00000000-0000-4000-8000-000000000002',
  createdAt: new Date('2000-01-02').toISOString(),
  name: 'Usuário Manager',
  email: 'manager@email.com',
  document: '11790500000271',
  role: UserRole.MANAGER,
  image: null,
}

export const normalUserSeed: User = {
  ...adminUserSeed,
  id: '00000000-0000-4000-8000-000000000003',
  createdAt: new Date('2000-01-01').toISOString(),
  name: 'Usuário Drawee',
  email: 'drawee@email.com',
  document: '00000000191',
  phone: '2733333333',
  role: UserRole.NORMAL,
  image: null,
}

export const userSeeds: User[] = [adminUserSeed, managerUserSeed, normalUserSeed]
