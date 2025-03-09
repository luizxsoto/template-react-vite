import { authPt } from '@/domain/auth/i18n/pt'

import { commonPt } from './pt'

const i18nDict = {
  pt: {
    common: commonPt,
    domain: {
      auth: authPt,
    },
  },
}

export function i18n(): typeof i18nDict.pt {
  const currentLanguage = 'pt'

  return i18nDict[currentLanguage]
}
