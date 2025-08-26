import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage'

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.innovusingenieria.com:3001/"
    : "http://192.168.1.19:3001/";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers: Headers) => {
      const token = await AsyncStorage.getItem('auth_token')
      headers.set("Accept", "application/json");

      headers.set("Accept-Language", "es");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});