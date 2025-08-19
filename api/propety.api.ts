import { camelToSnake, snakeToCamel } from "caseparser";

import { RequestMethod } from "@/utils/RequestMethod"
import { api } from "./app.api";

export const propertiesApi = api
  .enhanceEndpoints({ addTagTypes: ["prooperty", "properties"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
      propertiesMeters: builder.query({
        query: () => ({
          url: `/property/with-meters`,
          method: RequestMethod.GET,
        }),
        providesTags: ["properties"],
        transformResponse: (response: any) => snakeToCamel(response),
      }),
    }),
  });

export const {
  usePropertiesMetersQuery,
} = propertiesApi;
