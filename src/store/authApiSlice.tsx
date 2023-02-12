import { ILoginData, IRegisterData } from '../types/types'
import { apiSlice } from './api/apiSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    verifyLogin: build.mutation({
      query: (loginInfo: ILoginData) => ({
        url: 'token/',
        method: 'POST',
        body: {
          email: loginInfo.email,
          password: loginInfo.password,
        },
        include: 'credentials',
      }),
    }),

    registerUser: build.mutation({
      query: (registerInfo: IRegisterData) => ({
        url: 'register/',
        method: 'POST',
        body: registerInfo,
        include: 'credentials',
      }),
    }),

    logoutUser: build.mutation<void, void>({
      query: () => ({
        url: 'logout/',
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useVerifyLoginMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = authApiSlice