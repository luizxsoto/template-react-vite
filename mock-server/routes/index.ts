import { authRoutes } from './auth'
import { userRoutes } from './user'

export const routes = [...authRoutes, ...userRoutes]
