import {
  ILoginData,
  IRegisterData,
  IResetCode,
  IResetPasswordData,
  IVerifyEmailData,
} from "../types/types";
import { apiSlice } from "./api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    verifyLogin: build.mutation({
      query: (loginInfo: ILoginData) => ({
        url: "token/",
        method: "POST",
        body: {
          email: loginInfo.email,
          password: loginInfo.password,
        },
        include: "credentials",
      }),
    }),

    registerUser: build.mutation({
      query: (registerInfo: IRegisterData) => ({
        url: "register/",
        method: "POST",
        body: registerInfo,
        include: "credentials",
      }),
    }),

    verifyEmail: build.mutation({
      query: (emailInfo: IVerifyEmailData) => ({
        url: "forgot-password/",
        method: "POST",
        body: { email: emailInfo.email },
      }),
    }),

    verifyCode: build.mutation({
      query: (codeInfo: IResetCode) => ({
        url: "forgot-password/verify-code/",
        method: "POST",
        body: { code: codeInfo.code },
      }),
    }),

    verifyPassword: build.mutation({
      query: (passwordInfo: IResetPasswordData) => ({
        url: "forgot-password/reset-password/",
        method: "POST",
        body: {
          user_id: passwordInfo.user_id,
          password: passwordInfo.password,
          confirm_password: passwordInfo.confirm_password,
        },
      }),
    }),

    logoutUser: build.mutation<void, void>({
      query: () => ({
        url: "logout/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useVerifyLoginMutation,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useLogoutUserMutation,
  useVerifyPasswordMutation,
  useVerifyCodeMutation,
} = authApiSlice;
