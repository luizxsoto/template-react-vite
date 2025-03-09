import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Image } from '@/common/components/image'
import { Table } from '@/common/components/table'
import { ActionFunction, ColumnInfo, FilterByOption } from '@/common/components/table/types'
import { ALL_PERMISSION_KEYS } from '@/common/constants/permission-keys'
import { changePageTitle } from '@/common/helpers/window'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth/contexts'
import { UserWithoutPasswordFormatted } from '@/domain/user/contracts/models'
import { getUserStatusColor } from '@/domain/user/helpers'
import { useListUser, useRemoveUser, useSendUserCredentials } from '@/domain/user/hooks'

const columnInfos: ColumnInfo[] = [
  {
    key: 'name',
    label: i18n().modules.user.pages.list.tableColumn.name,
  },
  {
    key: 'email',
    label: i18n().modules.user.pages.list.tableColumn.email,
  },
  {
    key: 'documentFormatted',
    label: i18n().modules.user.pages.list.tableColumn.document,
  },
  {
    key: 'roleFormatted',
    label: i18n().modules.user.pages.list.tableColumn.role,
  },
  {
    key: 'statusFormatted',
    label: i18n().modules.user.pages.list.tableColumn.status,
  },
]

const filterByOptions: FilterByOption[] = [
  {
    key: 'search',
    label: i18n().modules.user.pages.list.search,
    format: 'string',
  },
]

export function UserList(): JSX.Element {
  changePageTitle(i18n().modules.user.pages.list.pageTitle)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { hasPermission } = useAuth()
  const removeUser = useRemoveUser()
  const sendUserCredentials = useSendUserCredentials()

  function addFunction(): void {
    void navigate('/user/form', {
      state: { listParams: Object.fromEntries(searchParams) },
    })
  }

  const actionFunctions = useMemo<Array<ActionFunction<UserWithoutPasswordFormatted>>>((): Array<
    ActionFunction<UserWithoutPasswordFormatted>
  > => {
    const filteredActions = []

    if (hasPermission({ permissionKey: ALL_PERMISSION_KEYS.user.show })) {
      filteredActions.push({
        key: 'show',
        label: i18n().modules.user.pages.list.action.show,
        handle: (model: { id: string }) => {
          void navigate(`/user/form/${model.id}?method=show`)
        },
      })
    }

    if (hasPermission({ permissionKey: ALL_PERMISSION_KEYS.user.update })) {
      filteredActions.push({
        key: 'update',
        label: i18n().modules.user.pages.list.action.update,
        handle: (model: { id: string }) => {
          void navigate(`/user/form/${model.id}?method=update`, {
            state: { listParams: Object.fromEntries(searchParams) },
          })
        },
      })
    }

    if (hasPermission({ permissionKey: ALL_PERMISSION_KEYS.user.update })) {
      filteredActions.push({
        key: 'email',
        label: i18n().modules.user.pages.list.action.email,
        handle: (model: { id: string }) => {
          sendUserCredentials.mutate({ model: { id: model.id } })
        },
        confirmMessage: i18n().modules.user.pages.list.helperTexts.sendCredentials,
      })
    }

    if (hasPermission({ permissionKey: ALL_PERMISSION_KEYS.user.remove })) {
      filteredActions.push({
        key: 'remove',
        label: i18n().modules.user.pages.list.action.remove,
        handle: (model: { id: string }) => {
          removeUser.mutate({ model: { id: model.id } })
        },
        confirmMessage: i18n().modules.user.pages.list.action.confirmRemove,
      })
    }

    return filteredActions
  }, [hasPermission, navigate, removeUser, searchParams, sendUserCredentials])

  function rowSanitizer(model: UserWithoutPasswordFormatted): Record<string, unknown> {
    return {
      ...model,
      name: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image
            alt={i18n().common.components.drawer.userImage}
            src={model.image}
            sx={{ width: '30px', height: '30px', borderRadius: '25px', objectFit: 'cover' }}
          />
          {model.name}
        </Box>
      ),
      statusFormatted: (
        <Chip
          size="small"
          label={i18n().modules.user.status[model.status]}
          sx={(theme) => {
            const userStatusColor = getUserStatusColor(model.status, theme)
            return {
              backgroundColor: userStatusColor.main,
              color: userStatusColor.contrastText,
              width: '100%',
            }
          }}
        />
      ),
    }
  }

  return (
    <Container
      disableGutters
      sx={{
        flex: 1,
        padding: '1rem',
        gap: '1rem',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Table
        title={i18n().modules.user.pages.list.pageTitle}
        listModelKey="id"
        columnInfos={columnInfos}
        listHook={useListUser}
        filterByOptions={filterByOptions}
        defaultFilterParams={{ orderBy: 'createdAt' }}
        addFunction={
          hasPermission({ permissionKey: ALL_PERMISSION_KEYS.user.create })
            ? addFunction
            : undefined
        }
        actionFunctions={actionFunctions}
        loading={removeUser.isPending}
        rowSanitizer={rowSanitizer}
      />
    </Container>
  )
}
