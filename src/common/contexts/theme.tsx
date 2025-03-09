import { ThemeProvider as MaterialThemeProvider, createTheme } from '@mui/material/styles'
import { createContext, useCallback, useContext, useState } from 'react'

interface ThemeStateProps {
  mode: 'dark' | 'light'
}
type ThemeContextProps = ThemeStateProps & {
  setTheme: (newData: ThemeStateProps) => void
}

const INITIAL_STATE: ThemeStateProps = {
  mode: 'light',
}
const ThemeContext = createContext<ThemeContextProps>(INITIAL_STATE as ThemeContextProps)

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, setState] = useState<ThemeStateProps>(INITIAL_STATE)

  const setTheme = useCallback(
    (newData: ThemeStateProps) => {
      setState((oldData) => ({ ...oldData, ...newData }))
    },
    [setState],
  )

  return (
    <ThemeContext.Provider value={{ ...state, setTheme }}>
      <MaterialThemeProvider theme={createTheme({ palette: { mode: state.mode } })}>
        {children}
      </MaterialThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextProps {
  return useContext(ThemeContext)
}
