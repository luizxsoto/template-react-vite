import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Image } from '@/common/components'
import { ActionFunction, ColumnInfo, Table } from '@/common/components/Table'
import { FilterByOption } from '@/common/components/Table/Header'
import { ALL_PERMISSION_KEYS } from '@/common/constants'
import { changePageTitle } from '@/common/helpers'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth'
import {
  getUserStatusColor,
  useListUser,
  useRemoveUser,
  useSendUserCredentials,
} from '@/domain/user'
import { UserWithoutPasswordFormatted } from '@/domain/user/contracts'

const columnInfos: ColumnInfo[] = [
  {
    key: 'name',
    label: i18n().modules.users.pages.list.tableColumn.name,
  },
  {
    key: 'email',
    label: i18n().modules.users.pages.list.tableColumn.email,
  },
  {
    key: 'documentFormatted',
    label: i18n().modules.users.pages.list.tableColumn.document,
  },
  {
    key: 'roleFormatted',
    label: i18n().modules.users.pages.list.tableColumn.role,
  },
  {
    key: 'statusFormatted',
    label: i18n().modules.users.pages.list.tableColumn.status,
  },
]

const filterByOptions: FilterByOption[] = [
  {
    key: 'search',
    label: i18n().modules.users.pages.list.search,
    format: 'string',
  },
]

export function UsersList(): JSX.Element {
  changePageTitle(i18n().modules.users.pages.list.pageTitle)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { hasPermission } = useAuth()
  const removeUser = useRemoveUser()
  const sendUserCredentials = useSendUserCredentials()

  function addFunction(): void {
    void navigate('/users/form', {
      state: { listParams: Object.fromEntries(searchParams) },
    })
  }

  const actionFunctions = useMemo<Array<ActionFunction<UserWithoutPasswordFormatted>>>((): Array<
    ActionFunction<UserWithoutPasswordFormatted>
  > => {
    const filteredActions = []

    if (hasPermission({ permissionKey: ALL_PERMISSION_KEYS.users.show })) {
      filteredActions.push({
        key: 'show',
        label: i18n().modules.users.pages.list.action.show,
        handle: (model: { id: string }) => {
          void navigate(`/users/form/${model.id}?method=show`)
        },
      })
    }

    if (hasPermission({ permissionKey: ALL_PERMISSION_KEYS.users.update })) {
      filteredActions.push({
        key: 'update',
        label: i18n().modules.users.pages.list.action.update,
        handle: (model: { id: string }) => {
          void navigate(`/users/form/${model.id}?method=update`, {
            state: { listParams: Object.fromEntries(searchParams) },
          })
        },
      })
    }

    if (hasPermission({ permissionKey: ALL_PERMISSION_KEYS.users.update })) {
      filteredActions.push({
        key: 'email',
        label: i18n().modules.users.pages.list.action.email,
        handle: (model: { id: string }) => {
          sendUserCredentials.mutate({ model: { id: model.id } })
        },
        confirmMessage: i18n().modules.users.pages.list.helperTexts.sendCredentials,
      })
    }

    if (hasPermission({ permissionKey: ALL_PERMISSION_KEYS.users.remove })) {
      filteredActions.push({
        key: 'remove',
        label: i18n().modules.users.pages.list.action.remove,
        handle: (model: { id: string }) => {
          removeUser.mutate({ model: { id: model.id } })
        },
        confirmMessage: i18n().modules.users.pages.list.action.confirmRemove,
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
          label={i18n().modules.users.status[model.status]}
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
        padding: '1rem',
        gap: '1rem',
        height: 'calc(100vh - 4rem)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Table
        title={i18n().modules.users.pages.list.pageTitle}
        listModelKey="id"
        columnInfos={columnInfos}
        listHook={useListUser}
        filterByOptions={filterByOptions}
        defaultFilterParams={{ orderBy: 'createdAt' }}
        addFunction={
          hasPermission({ permissionKey: ALL_PERMISSION_KEYS.users.create })
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
