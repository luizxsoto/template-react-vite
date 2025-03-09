import { ShowSessionApiResult } from '@/domain/auth/contracts/apis'

export interface SessionSeed extends ShowSessionApiResult {}

export const sessionUser01Seed: ShowSessionApiResult = {
  usuario: {
    id_usuario: 1,
    nome_de_usuario: 'user_01',
    nome: 'User 01',
  },
}

export const sessionSeeds: SessionSeed[] = Array.from({ length: 100 }).map((_, index) => {
  const parsedIndex = index + 1
  const paddedIndex = `${parsedIndex}`.padStart(3, '0')

  return {
    usuario: {
      id_usuario: parsedIndex,
      nome_de_usuario: `user_${paddedIndex}`,
      nome: `User ${paddedIndex}`,
    },
  }
})
