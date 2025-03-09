import { Token } from './contracts/models'

const tokenKey = '@template-react-vite/auth:token'

export function saveTokenRepository(token: Token): void {
  localStorage.setItem(tokenKey, JSON.stringify(token))
}

export function getTokenRepository(): Token | null {
  const token = localStorage.getItem(tokenKey)
  if (token !== null) {
    return JSON.parse(token) as Token
  }
  return null
}

export function removeTokenRepository(): void {
  localStorage.removeItem(tokenKey)
}
