import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from './authSlice'

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    console.log('sending refresh token')

    const refreshResult = await baseQuery('/refresh', api, extraOptions)
    console.log(refreshResult)
    if (refreshResult?.data) {
      const user = api.getState().auth.user
      api.dispatch(setCredentials({ ...refreshResult.data, user }))
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }
  }
  return result
}
