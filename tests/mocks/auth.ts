import { makeToken } from '@mock-server/helpers/token'
import { sessionUser01Seed } from '@mock-server/seeds/auth'

const storageTokenKey = '@template-react-vite/auth:token'
const user01Token = makeToken({ uid: sessionUser01Seed.usuario.id_usuario })

export const user01TokenMock = {
  key: storageTokenKey,
  value: {
    accessToken: user01Token,
    refreshToken: user01Token,
  },
}
