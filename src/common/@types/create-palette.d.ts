// eslint-disable-next-line no-restricted-imports
import '@mui/material/styles/createPalette'

declare module '@mui/material/styles/createTheme' {
  interface Theme {}

  interface ThemeOptions {}
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {}

  interface PaletteOptions {}
}
