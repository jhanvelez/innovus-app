import { camelToSnake, snakeToCamel } from "caseparser";

import { RequestMethod } from "@/utils/RequestMethod"
import { api } from "./app.api";

export const readingsApi = api
  .enhanceEndpoints({ addTagTypes: ["prooperty", "readings"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      storeReadig: builder.mutation({
        query: (formData: FormData) => ({
          url: "reading",
          method: RequestMethod.POST,
          body: formData,
          formData: true,
        }),
      }),
    }),
  });

export const {
  useStoreReadigMutation,
} = readingsApi;
