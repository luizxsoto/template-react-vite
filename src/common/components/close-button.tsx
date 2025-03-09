import CloseIcon from '@mui/icons-material/Close'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

export function CloseButton(props: IconButtonProps): JSX.Element {
  return (
    <IconButton size="small" {...props}>
      <CloseIcon fontSize="small" />
    </IconButton>
  )
}
