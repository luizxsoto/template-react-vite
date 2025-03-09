import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { SxProps, Theme } from '@mui/material/styles'
import { useEffect, useState } from 'react'

import { ZINDEX_GO_TO_TOP_BUTTON } from '@/common/constants/z-index'

interface GoToTopButtonProps extends IconButtonProps {
  elementId?: string
}

export function GoToTopButton({ elementId, sx, ...restProps }: GoToTopButtonProps): JSX.Element {
  const [visible, setVisible] = useState(false)

  function handleScrollToTop(): void {
    if (elementId) {
      document.getElementById(elementId)?.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    function setIsVisible(): void {
      if (elementId) {
        const currentElementScroll = document.getElementById(elementId)?.scrollTop ?? 0
        const scrollThreshold = 200

        if (currentElementScroll >= scrollThreshold) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }
    }

    if (elementId) {
      const elementFound = document.getElementById(elementId)
      elementFound?.addEventListener('scroll', setIsVisible)
    } else {
      window.addEventListener('scroll', setIsVisible)
    }

    return () => {
      window.removeEventListener('scroll', setIsVisible)
    }
  }, []) // eslint-disable-line

  return visible ? (
    <IconButton
      onClick={handleScrollToTop}
      sx={
        ((theme) => ({
          zIndex: ZINDEX_GO_TO_TOP_BUTTON,
          position: 'absolute',
          right: 16,
          bottom: 16,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            opacity: '80%',
          },
          ...(typeof sx === 'function' ? sx(theme) : sx),
        })) as SxProps<Theme>
      }
      {...restProps}
    >
      <ArrowUpwardIcon fontSize="small" />
    </IconButton>
  ) : (
    <></>
  )
}
