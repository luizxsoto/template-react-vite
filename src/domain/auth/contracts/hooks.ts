import { HookHandlers } from '@/common/contracts/hooks'

import {
  CreateSessionServiceParams,
  CreateSessionServiceResult,
  ShowSessionServiceResult,
} from './services'

export interface CreateSessionHookParams
  extends Omit<HookHandlers<CreateSessionHookResult>, 'queryOptions'> {
  params: CreateSessionServiceParams
}

export interface CreateSessionHookResult extends CreateSessionServiceResult {}

export interface ShowSessionHookParams
  extends Omit<HookHandlers<ShowSessionHookResult>, 'queryOptions'> {}

export interface ShowSessionHookResult extends ShowSessionServiceResult {}
