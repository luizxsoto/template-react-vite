import GlobalStyles from '@mui/material/GlobalStyles'

export function ResetStyle(): JSX.Element {
  return (
    <GlobalStyles
      styles={{
        'html, body, #root': {
          display: 'flex',
          height: '100%',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        },
        body: {
          overflowY: 'hidden',
          overflowX: 'auto',
        },
        '#root': {
          minWidth: '320px',
        },
        '*': {
          padding: 0,
          margin: 0,
          outline: 'none',
          border: 'none',
          borderSpacing: 0,
          background: 'none',
          boxSizing: 'border-box',
          WebkitFontSmoothing: 'antialiased',
          WebkitTapHighlightColor: 'transparent',

          '::-webkit-scrollbar': {
            height: '0.75rem',
            width: '0.75rem',
          },

          '::-webkit-scrollbar-track': {
            margin: '0.5rem 0',
          },

          '::-webkit-scrollbar-thumb': {
            border: '0.25rem solid rgba(0, 0, 0, 0)',
            backgroundClip: 'padding-box',
            borderRadius: '0.5rem',
            backgroundColor: '#5d66751a',
          },
        },
      }}
    />
  )
}
