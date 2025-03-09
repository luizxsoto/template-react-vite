import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import _Get from 'lodash.get'
import { useCallback, useState } from 'react'

import { FormCancelButton } from '@/common/components/form/cancel-button'
import { FormConfirmButton } from '@/common/components/form/confirm-button'
import { FormGridContainer } from '@/common/components/form/grid-container'
import { i18n } from '@/common/i18n'

import { ActionFunction, CheckBoxProps, ColumnInfo } from './types'

interface BodyProps<Model = Record<string, unknown>> {
  listModelKey: keyof Model
  modelList: Model[]
  columnInfos: ColumnInfo[]
  actionFunctions?: Array<ActionFunction<Model>>
  checkBoxProps?: CheckBoxProps<Model>
}

interface SelectedItem<Model = Record<string, unknown>> {
  ref?: Element | (() => Element) | null
  model?: Model
}

interface DialogState<Model = Record<string, unknown>> {
  isOpen: boolean
  selectedItem: SelectedItem<Model> | null
  actionFunction: ActionFunction<Model> | null
}

export function Body<Model = Record<string, unknown>>({
  listModelKey,
  modelList,
  columnInfos,
  actionFunctions,
  checkBoxProps,
}: BodyProps<Model>): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<SelectedItem<Model> | null>(null)
  const [dialogState, setDialogState] = useState<DialogState<Model>>({
    isOpen: false,
    selectedItem: null,
    actionFunction: null,
  })

  const IconType = useCallback(({ icon }: { icon: string }): JSX.Element => {
    const iconDict: Record<string, JSX.Element> = {
      show: <VisibilityIcon />,
      update: <EditIcon />,
      remove: <DeleteIcon />,
      email: <EmailIcon />,
    }

    return iconDict[icon]
  }, [])

  function handleCloseMenu(): void {
    setSelectedItem(null)
  }

  function handleOpenMenu(newSelectedItem: SelectedItem<Model>): void {
    setSelectedItem(newSelectedItem)
  }

  function handleCloseDialog(): void {
    setDialogState({ isOpen: false, selectedItem: null, actionFunction: null })
  }

  function handleConfirmAction(): void {
    if (dialogState.selectedItem?.model) {
      dialogState.actionFunction?.handle(dialogState.selectedItem.model)
    }

    handleCloseDialog()
  }

  function handleCancelAction(): void {
    handleCloseDialog()
  }

  function handleMenuItemClick(actionFunction: ActionFunction<Model>): void {
    handleCloseMenu()

    if (actionFunction.confirmMessage) {
      setDialogState({
        isOpen: true,
        selectedItem,
        actionFunction,
      })
      return
    }

    if (selectedItem?.model) {
      actionFunction.handle(selectedItem.model)
    }
  }

  function getValueByColumnInfo(itemData: Model, columnInfoKey: string): string {
    return _Get(itemData, columnInfoKey) as string
  }

  return (
    <TableBody data-testid="Table-Body">
      <Dialog
        slotProps={{ root: { ['data-testid' as 'role']: 'RemoveDialog' } }}
        open={dialogState.isOpen}
        onClose={handleCloseDialog}
      >
        <Grid
          container
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <DialogTitle>{i18n().common.components.table.body.attention}</DialogTitle>

          <IconButton onClick={handleCloseDialog} color="primary" sx={{ marginRight: '1rem' }}>
            <CloseIcon />
          </IconButton>
        </Grid>

        <DialogContent>
          <Typography variant="h6">{dialogState.actionFunction?.confirmMessage}</Typography>

          <FormGridContainer spacing={2} sx={{ marginTop: '0.5rem' }}>
            <FormConfirmButton onClick={handleConfirmAction} gridProps={{ size: { xs: 6 } }}>
              {i18n().common.components.table.body.confirm}
            </FormConfirmButton>
            <FormCancelButton onClick={handleCancelAction} gridProps={{ size: { xs: 6 } }}>
              {i18n().common.components.table.body.cancel}
            </FormCancelButton>
          </FormGridContainer>
        </DialogContent>
      </Dialog>

      {modelList.map((itemData) => (
        <TableRow hover key={String(itemData[listModelKey])}>
          {checkBoxProps && (
            <TableCell padding="checkbox">
              <Checkbox
                data-testid="Table-Body-Checkbox"
                color="primary"
                checked={checkBoxProps.checkedRows.some(
                  (checkedRow) =>
                    checkedRow[checkBoxProps.rowKey] === itemData[checkBoxProps.rowKey],
                )}
                onChange={() => checkBoxProps.onCheck(itemData)}
              />
            </TableCell>
          )}
          {columnInfos.map((columnInfo) => (
            <TableCell key={columnInfo.key}>
              <Box
                sx={{
                  textAlign: 'left',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordWrap: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {getValueByColumnInfo(itemData, columnInfo.key)}
              </Box>
            </TableCell>
          ))}
          {actionFunctions && (
            <TableCell padding="none" align="center">
              <IconButton
                data-testid="Table-Body-ActionButton"
                color="primary"
                size="small"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  handleOpenMenu({
                    ref: event.currentTarget,
                    model: itemData,
                  })
                }}
              >
                <MenuOpenIcon />
              </IconButton>
            </TableCell>
          )}
        </TableRow>
      ))}
      {actionFunctions && (
        <Menu anchorEl={selectedItem?.ref} open={!!selectedItem?.ref} onClose={handleCloseMenu}>
          {actionFunctions.map((actionFunction) => (
            <MenuItem
              key={actionFunction.key}
              data-testid={`Table-Body-MenuItem-${actionFunction.key}`}
              onClick={() => {
                handleMenuItemClick(actionFunction)
              }}
            >
              <IconType icon={actionFunction.key} />
              <Typography sx={{ marginLeft: '0.2rem' }}>{actionFunction.label}</Typography>
            </MenuItem>
          ))}
        </Menu>
      )}
    </TableBody>
  )
}
