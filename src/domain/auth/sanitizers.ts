import { ShowSessionApiResult, TokenApi } from './contracts/apis'
import { CreateSessionForm } from './contracts/forms'
import { Session, Token } from './contracts/models'

export function createSessionFormSanitizer(params: CreateSessionForm): CreateSessionForm {
  return {
    username: params.username,
    password: params.password,
  }
}

export function apiSessionSanitizer(apiSession: ShowSessionApiResult): Session {
  return {
    user: {
      idUser: apiSession.usuario.id_usuario,
      username: apiSession.usuario.nome_de_usuario,
      name: apiSession.usuario.nome,
    },
  }
}

export function apiTokenSanitizer(apiToken: TokenApi): Token {
  return {
    accessToken: apiToken.access_token,
    refreshToken: apiToken.refresh_token,
  }
}
