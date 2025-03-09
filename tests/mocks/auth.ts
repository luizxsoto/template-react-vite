import { makeToken } from '@mock-server/helpers/token'
import { adminUserSeed } from '@mock-server/seeds/user'

const storageTokenKey = '@template-react-vite/auth:token'
const user01Token = makeToken({ userId: adminUserSeed.id })

export const user01TokenMock = {
  key: storageTokenKey,
  value: {
    accessToken: user01Token,
    refreshToken: user01Token,
  },
}
