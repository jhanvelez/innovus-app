import { camelToSnake, snakeToCamel } from "caseparser";

import { RequestMethod } from "@/utils/RequestMethod"
import { api } from "./app.api";

export const readingsApi = api
  .enhanceEndpoints({ addTagTypes: ["reading-session", "reading-sessions"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      activeReadigSession: builder.query({
        query: () => ({
          url: `/reading-sessions/active`,
          method: RequestMethod.GET,
          params: camelToSnake({}),
        }),
        providesTags: ["reading-sessions"],
        transformResponse: (response: any) => snakeToCamel(response),
      }),
      storeReadigSession: builder.mutation({
        query: () => ({
          url: "reading-sessions",
          method: RequestMethod.POST,
        }),
      }),
    }),
  });

export const {
  useActiveReadigSessionQuery,
  useStoreReadigSessionMutation,
} = readingsApi;
