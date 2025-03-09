import { SxProps, Theme, styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'

import NoImage from '@/common/assets/images/no-image.svg'

const MuiImage = styled('img')({})

interface ImageProps {
  alt: string
  src?: string | null
  sx?: SxProps<Theme>
  FallbackImage?: () => React.ReactElement
}

export function Image({ src, FallbackImage, ...restProps }: ImageProps): JSX.Element {
  const [hasError, setHasError] = useState(false)

  const ParsedFallbackImage = FallbackImage ? (
    <FallbackImage />
  ) : (
    <MuiImage src={NoImage} {...restProps} />
  )

  function handleOnError(): void {
    setHasError(true)
  }

  useEffect(() => {
    setHasError(false)
  }, [src])

  return hasError || !src ? (
    ParsedFallbackImage
  ) : (
    <MuiImage src={src} {...restProps} onError={handleOnError} />
  )
}
