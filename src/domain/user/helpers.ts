import { SimplePaletteColorOptions, Theme } from '@mui/material/styles'

import { UserStatus } from '@/domain/user/contracts/models'

export function getUserStatusColor(
  status: UserStatus | undefined,
  theme: Theme,
): SimplePaletteColorOptions {
  const defaultObject = { main: theme.palette.grey[400], contrastText: '#ffffff' }

  if (status) {
    const colorDict: Record<UserStatus, SimplePaletteColorOptions> = {
      active: theme.palette.success,
      inactive: defaultObject,
    }

    return colorDict[status]
  }

  return defaultObject
}
