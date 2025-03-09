import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useLocation, useSearchParams } from 'react-router-dom'

import { ApplicationException, ValidationException } from '@/common/exceptions'
import { useErrorHandler } from '@/common/hooks'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth'

import {
  CreateUserHookParams,
  ListUserHookParams,
  ListUserHookResult,
  RemoveUserHookParams,
  RemoveUserServiceParams,
  SendUserCredentialsHookParams,
  ShowUserHookParams,
  ShowUserHookResult,
  ShowUserServiceParams,
  UpdateUserHookParams,
  UpdateUserProfileHookParams,
} from './contracts'
import {
  createUserService,
  listUserService,
  removeUserService,
  sendUserCredentialsService,
  showUserService,
  updateUserProfileService,
  updateUserService,
} from './services'

const hookKey = 'users'

export function useCreateUser(): UseMutationResult<
  void,
  ApplicationException,
  CreateUserHookParams
> {
  const { handleError } = useErrorHandler()
  const queryClient = useQueryClient()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()

  return useMutation({
    mutationKey: [hookKey, 'create'],
    mutationFn: async ({ model, onSuccess, onError }: CreateUserHookParams) => {
      try {
        const createdUser = await createUserService(model)
        onSuccess?.(createdUser)
        enqueueSnackbar(i18n().modules.users.pages.form.toast.created, {
          variant: 'success',
        })
        queryClient.setQueryData([hookKey, { id: createdUser.id }], () => createdUser)
        const locationState = location.state as {
          listParams?: ListUserHookParams['model']
        } | null
        if (locationState?.listParams) {
          const parsedListParams = {
            ...locationState.listParams,
            page: 1,
            perPage: Number(locationState.listParams.perPage),
          }
          if (queryClient.getQueryData([hookKey, parsedListParams])) {
            queryClient.setQueryData(
              [hookKey, parsedListParams],
              (oldData: ListUserHookResult | undefined) =>
                oldData && {
                  ...oldData,
                  total: oldData.total + 1,
                  registers: [createdUser, ...oldData.registers],
                },
            )
          }
        }
      } catch (error) {
        const parsedError = error as ApplicationException
        handleError({
          error: parsedError,
          setValidations: (validations) => onError?.({ error: parsedError, validations }),
        })
      }
    },
  })
}

export function useListUser({
  model,
  queryOptions,
  onSuccess,
  onError,
}: ListUserHookParams): UseQueryResult<ListUserHookResult, ApplicationException> {
  const { handleError } = useErrorHandler()
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: [hookKey, model],
    queryFn: async () => {
      try {
        const usersList = await listUserService(model)
        onSuccess?.(usersList)
        return usersList
      } catch (error) {
        const parsedError = error as ApplicationException
        handleError({ error: parsedError })
        onError?.({ error: parsedError })
        throw error
      }
    },
    ...queryOptions,
  })
}

export function useShowUser({
  model,
  queryOptions,
  onSuccess,
  onError,
}: ShowUserHookParams): UseQueryResult<ShowUserHookResult, ApplicationException> {
  const { handleError } = useErrorHandler()

  return useQuery({
    queryKey: [hookKey, model],
    enabled: Boolean(model.id),
    queryFn: async () => {
      try {
        const userShown = await showUserService(model as ShowUserServiceParams)
        onSuccess?.(userShown)
        return userShown
      } catch (error) {
        const parsedError = error as ApplicationException
        handleError({ error: parsedError })
        onError?.({ error: parsedError })
        throw error
      }
    },
    ...queryOptions,
  })
}

export function useUpdateUser(): UseMutationResult<
  void,
  ApplicationException,
  UpdateUserHookParams
> {
  const { handleError } = useErrorHandler()
  const queryClient = useQueryClient()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()

  return useMutation({
    mutationKey: [hookKey, 'update'],
    mutationFn: async ({ model, onSuccess, onError }: UpdateUserHookParams) => {
      try {
        const updatedUser = await updateUserService(model)
        onSuccess?.(updatedUser)
        enqueueSnackbar(i18n().modules.users.pages.form.toast.updated, {
          variant: 'success',
        })
        queryClient.setQueryData([hookKey, { id: updatedUser.id }], () => updatedUser)
        const locationState = location.state as {
          listParams?: ListUserHookParams['model']
        } | null
        if (locationState?.listParams) {
          const parsedListParams = {
            ...locationState.listParams,
            page: Number(locationState.listParams.page),
            perPage: Number(locationState.listParams.perPage),
          }
          if (queryClient.getQueryData([hookKey, parsedListParams])) {
            queryClient.setQueryData(
              [hookKey, parsedListParams],
              (oldData: ListUserHookResult | undefined) =>
                oldData && {
                  ...oldData,
                  registers: oldData.registers.map((oldItem) =>
                    oldItem.id === updatedUser.id ? updatedUser : oldItem,
                  ),
                },
            )
          }
        }
      } catch (error) {
        const parsedError = error as ApplicationException
        handleError({
          error: parsedError,
          setValidations: (validations) => onError?.({ error: parsedError, validations }),
        })
      }
    },
  })
}

export function useRemoveUser(): UseMutationResult<
  void,
  ApplicationException,
  RemoveUserHookParams
> {
  const { handleError } = useErrorHandler()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const { enqueueSnackbar } = useSnackbar()

  return useMutation({
    mutationKey: [hookKey, 'remove'],
    mutationFn: async ({ model, onSuccess, onError }: RemoveUserHookParams) => {
      try {
        await removeUserService(model as RemoveUserServiceParams)
        onSuccess?.(model as RemoveUserServiceParams)
        enqueueSnackbar(i18n().modules.users.pages.list.toast.removed, {
          variant: 'success',
        })
        queryClient.removeQueries({ queryKey: [hookKey, model], exact: true })
        const listParams = Object.fromEntries(searchParams) as ListUserHookParams['model']
        const parsedListParams = {
          ...listParams,
          page: Number(listParams.page),
          perPage: Number(listParams.perPage),
        }
        if (queryClient.getQueryData([hookKey, parsedListParams])) {
          queryClient.setQueryData(
            [hookKey, parsedListParams],
            (oldData: ListUserHookResult | undefined) =>
              oldData && {
                ...oldData,
                total: oldData.total - 1,
                registers: oldData.registers.filter((oldItem) => oldItem.id !== model.id),
              },
          )
        }
      } catch (error) {
        const parsedError = error as ApplicationException
        handleError({ error: parsedError })
        onError?.({ error: parsedError })
      }
    },
  })
}

export function useUpdateUserProfile(): UseMutationResult<
  void,
  ApplicationException,
  UpdateUserProfileHookParams
> {
  const { handleError } = useErrorHandler()
  const queryClient = useQueryClient()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const { saveLoggedUser } = useAuth()

  return useMutation({
    mutationKey: [hookKey, 'updateProfile'],
    mutationFn: async ({ model, onSuccess, onError }: UpdateUserProfileHookParams) => {
      try {
        const updatedUserProfile = await updateUserProfileService(model)

        onSuccess?.(updatedUserProfile)
        saveLoggedUser({ model: updatedUserProfile })
        enqueueSnackbar(i18n().modules.users.pages.profile.toast.updated, {
          variant: 'success',
        })
        queryClient.setQueryData([hookKey, { id: updatedUserProfile.id }], () => updatedUserProfile)
        const locationState = location.state as {
          listParams?: ListUserHookParams['model']
        } | null
        if (locationState?.listParams) {
          const parsedListParams = {
            ...locationState.listParams,
            page: Number(locationState.listParams.page),
            perPage: Number(locationState.listParams.perPage),
          }

          if (queryClient.getQueryData([hookKey, parsedListParams])) {
            queryClient.setQueryData(
              [hookKey, parsedListParams],
              (oldData: ListUserHookResult | undefined) =>
                oldData && {
                  ...oldData,
                  registers: oldData.registers.map((oldItem) =>
                    oldItem.id === updatedUserProfile.id ? updatedUserProfile : oldItem,
                  ),
                },
            )
          }
        }
      } catch (error) {
        const parsedError = error as ApplicationException
        handleError({
          error: parsedError,
          setValidations: (validations) => onError?.({ error: parsedError, validations }),
        })
      }
    },
  })
}

export function useSendUserCredentials(): UseMutationResult<
  void,
  ApplicationException,
  SendUserCredentialsHookParams
> {
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useSnackbar()

  return useMutation({
    mutationKey: [hookKey, 'sendUserCredentials'],
    mutationFn: async ({ model, onSuccess, onError }: SendUserCredentialsHookParams) => {
      try {
        await sendUserCredentialsService(model)
        onSuccess?.()
        enqueueSnackbar(i18n().modules.users.pages.list.toast.credentialsSent, {
          variant: 'success',
        })
      } catch (error) {
        const parsedError = error as ApplicationException
        handleError({ error: parsedError })
        onError?.({ error: parsedError })
        throw error
      }
    },
  })
}
