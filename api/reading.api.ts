import { camelToSnake, snakeToCamel } from "caseparser";

import { RequestMethod } from "@/utils/RequestMethod"
import { api } from "./app.api";

export const readingsApi = api
  .enhanceEndpoints({ addTagTypes: ["prooperty", "readings"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      storeReadig: builder.mutation({
        query: (readingData) => ({
          url: "reading",
          method: RequestMethod.POST,
          body: readingData,
        }),
      }),
    }),
  });

export const {
  useStoreReadigMutation,
} = readingsApi;
