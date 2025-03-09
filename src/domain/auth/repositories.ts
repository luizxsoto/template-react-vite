import { safetyJSONParse } from '@/common/helpers/json'
import { Token } from '@/domain/auth/contracts/models'

const storageTokenKey = '@template-react-vite/auth:token'

export function getTokenRepository(): Token | null {
  const token = localStorage.getItem(storageTokenKey)
  return safetyJSONParse<Token>(token) ?? null
}

export function saveTokenRepository(token: Token): void {
  localStorage.setItem(storageTokenKey, JSON.stringify(token))
}

export function removeTokenRepository(): void {
  localStorage.removeItem(storageTokenKey)
}
