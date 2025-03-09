export interface TokenApi {
  access_token: string
  refresh_token: string
}

export interface SessionUserApi {
  id_usuario: number
  nome_de_usuario: string
  nome: string
}

export interface CreateSessionApiParams {
  username: string
  password: string
}

export interface CreateSessionApiResult {
  usuario: SessionUserApi
  token: TokenApi
}

export interface ShowSessionApiResult {
  usuario: SessionUserApi
}

export interface RefreshTokenApiParams {
  refresh_token: string
}
