import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from './app.api'
import { User } from '../types/auth'

export const userApi = api
  .enhanceEndpoints({ addTagTypes: ["user"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      login: builder.mutation<{ token: string; user: User }, { email: string; password: string }>({
        query: (credentials) => ({
          url: '/auth/login',
          method: 'POST',
          body: credentials,
        }),
        transformResponse: (response: any) => snakeToCamel(response),
      }),
      getProfile: builder.query<User, void>({
        query: () => '/auth/profile',
        providesTags: ["user"],
      }),
    }),
  })

export const { useLoginMutation, useGetProfileQuery } = userApi
