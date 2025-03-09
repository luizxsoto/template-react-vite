import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import { Grid2Props } from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

import { FormGridItem } from '@/common/components/form/grid-item'

interface FormTagInputProps<Model extends FieldValues> {
  control: Control<Model>
  name: Path<Model>
  label: string
  error?: string
  helperText?: string
  required?: boolean
  gridProps?: Grid2Props
  inputProps?: TextFieldProps
  disabled?: boolean
  inputBox?: 'filled' | 'outlined' | 'standard'
  endAdornment?: JSX.Element
}

export function FormTagInput<Model extends FieldValues>({
  control,
  name,
  label,
  error,
  helperText,
  required,
  gridProps,
  inputProps,
  disabled,
  inputBox,
  endAdornment,
  ...rest
}: FormTagInputProps<Model>): JSX.Element {
  const tagBoxId = 'tag-content'

  function addWheelListener(): {
    tagContent: HTMLElement | null
    changeWheel: (event: WheelEvent) => void
  } {
    const tagContent = document.getElementById(tagBoxId)
    function changeWheel(event: WheelEvent): void {
      event.preventDefault()
      const scrollLength = 20
      tagContent?.scrollBy({
        left: event.deltaY < 0 ? -scrollLength : scrollLength,
      })
    }
    tagContent?.addEventListener('wheel', changeWheel)
    return { tagContent, changeWheel }
  }

  function goToRight(): void {
    const scrollThreshold = 50
    setTimeout(() => {
      const tagContent = document.getElementById(tagBoxId)
      tagContent?.scrollTo({ left: tagContent.scrollWidth })
    }, scrollThreshold)
  }

  function handleRemoveTag(tag: string, oldTags: string[]): string[] {
    return oldTags.filter((oldTag) => oldTag !== tag)
  }

  function textToTags(
    text: string,
    oldTags: string[],
  ): { newTags: string[]; shouldCleanInput: boolean } {
    const [tag, hasComma] = text.split(',')
    let newTags = [...oldTags]
    let shouldCleanInput = false
    if ((hasComma as string | undefined) !== undefined && tag) {
      if (oldTags.some((oldTag) => oldTag === tag)) {
        newTags = oldTags
      } else {
        newTags = [...oldTags, tag.trim()]
      }
      goToRight()
      shouldCleanInput = true
    }
    addWheelListener()
    return { newTags, shouldCleanInput }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    oldTags: string[],
  ): string[] {
    const { newTags, shouldCleanInput } = textToTags(event.target.value, oldTags)
    if (shouldCleanInput) {
      event.target.value = ''
    }
    return newTags
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    oldTags: string[],
  ): string[] {
    if (
      event.key === 'Backspace' &&
      !event.repeat &&
      !event.currentTarget.value &&
      oldTags.length
    ) {
      return oldTags.slice(0, oldTags.length - 1)
    }
    if (event.key === 'Enter' && event.currentTarget.value) {
      event.preventDefault()
      const { newTags } = textToTags(`${event.currentTarget.value},`, oldTags)
      event.currentTarget.value = ''
      return newTags
    }
    return oldTags
  }

  useEffect(() => {
    const { tagContent, changeWheel } = addWheelListener()
    tagContent?.addEventListener('wheel', changeWheel)
    return () => {
      window.removeEventListener('wheel', changeWheel)
    }
  }, [])

  return (
    <FormGridItem sx={{ marginTop: '0.2rem' }} {...gridProps}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const oldTags: string[] = field.value ?? []
          return (
            <FormControl fullWidth error={!!error} {...rest}>
              <TextField
                data-testid={`TagInput-${name}`}
                fullWidth
                size="small"
                onChange={(event) => {
                  field.onChange(handleChange(event, oldTags))
                }}
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    {label}
                    {required ? (
                      <Typography color="error" sx={{ marginLeft: '0.2rem' }}>
                        *
                      </Typography>
                    ) : (
                      ''
                    )}
                  </Box>
                }
                error={!!error}
                variant={inputBox ?? 'outlined'}
                disabled={disabled}
                helperText={error ?? helperText}
                {...inputProps}
                InputProps={{
                  onKeyDown: (event) => field.onChange(handleKeyDown(event, oldTags)),
                  startAdornment: Boolean(oldTags.length) && (
                    <InputAdornment position="start" sx={{ maxWidth: '65%', cursor: 'auto' }}>
                      <Box
                        id={tagBoxId}
                        sx={{
                          overflowY: 'hidden',
                          '::-webkit-scrollbar': {
                            height: '0.3rem',
                            width: '0.3rem',
                          },
                          '::-webkit-scrollbar-track': {
                            backgroundColor: '#f1f1f1',
                          },
                          '::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888',
                            borderRadius: '0.15rem',
                          },
                          '::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#555',
                          },
                        }}
                      >
                        {oldTags.map((tag) => (
                          <Chip
                            data-testid="TagInput-Chip"
                            key={tag}
                            label={tag}
                            variant="outlined"
                            disabled={disabled}
                            onDelete={() => {
                              field.onChange(handleRemoveTag(tag, oldTags))
                            }}
                            sx={{
                              marginRight: '0.25rem',
                              maxWidth: 'unset',
                              height: 'unset',
                            }}
                          />
                        ))}
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: endAdornment && (
                    <InputAdornment position="end">{endAdornment}</InputAdornment>
                  ),
                }}
              />
            </FormControl>
          )
        }}
      />
    </FormGridItem>
  )
}
