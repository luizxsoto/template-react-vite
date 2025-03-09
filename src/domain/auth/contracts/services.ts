import { CreateSessionApiParams } from './apis'
import { Session } from './models'

export interface CreateSessionServiceParams extends CreateSessionApiParams {}

export interface CreateSessionServiceResult extends Session {}

export interface ShowSessionServiceResult extends Session {}
