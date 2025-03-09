import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useLocation, useSearchParams } from 'react-router-dom'

import { ApplicationException } from '@/common/exceptions/application'
import { useErrorHandler } from '@/common/hooks/error-handler'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth/contexts'

import { USER_ENTITY_NAME } from './constants'
import {
  CreateUserHookParams,
  ListUserHookParams,
  ListUserHookResult,
  RemoveUserHookParams,
  SendUserCredentialsHookParams,
  ShowUserHookParams,
  ShowUserHookResult,
  UpdateUserHookParams,
  UpdateUserProfileHookParams,
} from './contracts/hooks'
import { RemoveUserServiceParams, ShowUserServiceParams } from './contracts/services'
import {
  createUserService,
  listUserService,
  removeUserService,
  sendUserCredentialsService,
  showUserService,
  updateUserProfileService,
  updateUserService,
} from './services'

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
    mutationKey: [USER_ENTITY_NAME, 'create'],
    mutationFn: async ({ model, onSuccess, onError }: CreateUserHookParams) => {
      try {
        const createdUser = await createUserService(model)
        onSuccess?.(createdUser)
        enqueueSnackbar(i18n().modules.user.pages.form.toast.created, {
          variant: 'success',
        })
        queryClient.setQueryData([USER_ENTITY_NAME, { id: createdUser.id }], () => createdUser)
        const locationState = location.state as {
          listParams?: ListUserHookParams['model']
        } | null
        if (locationState?.listParams) {
          const parsedListParams = {
            ...locationState.listParams,
            page: 1,
            perPage: Number(locationState.listParams.perPage),
          }
          if (queryClient.getQueryData([USER_ENTITY_NAME, parsedListParams])) {
            queryClient.setQueryData(
              [USER_ENTITY_NAME, parsedListParams],
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

  return useQuery({
    queryKey: [USER_ENTITY_NAME, model],
    queryFn: async () => {
      try {
        const listedUsers = await listUserService(model)
        onSuccess?.(listedUsers)
        return listedUsers
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
    queryKey: [USER_ENTITY_NAME, model],
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
    mutationKey: [USER_ENTITY_NAME, 'update'],
    mutationFn: async ({ model, onSuccess, onError }: UpdateUserHookParams) => {
      try {
        const updatedUser = await updateUserService(model)
        onSuccess?.(updatedUser)
        enqueueSnackbar(i18n().modules.user.pages.form.toast.updated, {
          variant: 'success',
        })
        queryClient.setQueryData([USER_ENTITY_NAME, { id: updatedUser.id }], () => updatedUser)
        const locationState = location.state as {
          listParams?: ListUserHookParams['model']
        } | null
        if (locationState?.listParams) {
          const parsedListParams = {
            ...locationState.listParams,
            page: Number(locationState.listParams.page),
            perPage: Number(locationState.listParams.perPage),
          }
          if (queryClient.getQueryData([USER_ENTITY_NAME, parsedListParams])) {
            queryClient.setQueryData(
              [USER_ENTITY_NAME, parsedListParams],
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
    mutationKey: [USER_ENTITY_NAME, 'remove'],
    mutationFn: async ({ model, onSuccess, onError }: RemoveUserHookParams) => {
      try {
        await removeUserService(model as RemoveUserServiceParams)
        onSuccess?.(model as RemoveUserServiceParams)
        enqueueSnackbar(i18n().modules.user.pages.list.toast.removed, {
          variant: 'success',
        })
        queryClient.removeQueries({ queryKey: [USER_ENTITY_NAME, model], exact: true })
        const listParams = Object.fromEntries(searchParams) as ListUserHookParams['model']
        const parsedListParams = {
          ...listParams,
          page: Number(listParams.page),
          perPage: Number(listParams.perPage),
        }
        if (queryClient.getQueryData([USER_ENTITY_NAME, parsedListParams])) {
          queryClient.setQueryData(
            [USER_ENTITY_NAME, parsedListParams],
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
    mutationKey: [USER_ENTITY_NAME, 'updateProfile'],
    mutationFn: async ({ model, onSuccess, onError }: UpdateUserProfileHookParams) => {
      try {
        const updatedUserProfile = await updateUserProfileService(model)

        onSuccess?.(updatedUserProfile)
        saveLoggedUser({ model: updatedUserProfile })
        enqueueSnackbar(i18n().modules.user.pages.profile.toast.updated, {
          variant: 'success',
        })
        queryClient.setQueryData(
          [USER_ENTITY_NAME, { id: updatedUserProfile.id }],
          () => updatedUserProfile,
        )
        const locationState = location.state as {
          listParams?: ListUserHookParams['model']
        } | null
        if (locationState?.listParams) {
          const parsedListParams = {
            ...locationState.listParams,
            page: Number(locationState.listParams.page),
            perPage: Number(locationState.listParams.perPage),
          }

          if (queryClient.getQueryData([USER_ENTITY_NAME, parsedListParams])) {
            queryClient.setQueryData(
              [USER_ENTITY_NAME, parsedListParams],
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
    mutationKey: [USER_ENTITY_NAME, 'sendUserCredentials'],
    mutationFn: async ({ model, onSuccess, onError }: SendUserCredentialsHookParams) => {
      try {
        await sendUserCredentialsService(model)
        onSuccess?.()
        enqueueSnackbar(i18n().modules.user.pages.list.toast.credentialsSent, {
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
