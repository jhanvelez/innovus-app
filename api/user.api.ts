import { snakeToCamel } from "caseparser";

import { RequestMethod } from "../utils/RequestMethod"
import { api } from "./app.api";

export const userApi = api
  .enhanceEndpoints({ addTagTypes: ["user", "users"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      user: builder.query({
        query: () => ({
          url: '/users/user',
          method: RequestMethod.GET,
        }),
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
    })
  });

export const {
  useUserQuery,
} = userApi
