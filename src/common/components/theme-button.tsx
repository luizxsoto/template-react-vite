import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import IconButton from '@mui/material/IconButton'

import { useTheme } from '@/common/contexts/theme'

export function ThemeButton(): JSX.Element {
  const { mode, setTheme } = useTheme()

  function handleSwitchTheme(): void {
    setTheme({ mode: mode === 'light' ? 'dark' : 'light' })
  }

  return (
    <IconButton
      sx={{ width: '51px', height: '51px', color: '#f2f2f2', marginRight: '1rem' }}
      onClick={handleSwitchTheme}
    >
      {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  )
}
