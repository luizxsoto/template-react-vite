export interface Token {
  accessToken: string
  refreshToken: string
}

export interface SessionUser {
  idUser: number
  username: string
  name: string
}

export interface Session {
  user: SessionUser
}
