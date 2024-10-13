/* eslint-disable comma-dangle */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coreAPI = createApi({
  reducerPath: 'coreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    prepareHeaders: (headers) => {
      headers.set('x-token', window.localStorage.getItem('x-token'));
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => '/stats/top-charts' }),
    getArtist: builder.query({
      query: (artistId) => `/stats/artists/${artistId}`,
    }),
    getTopArtists: builder.query({
      query: () => '/stats/top-artists',
    }),
    getSong: builder.query({
      query: ({ songid }) => `/stats/tracks/${songid}`,
    }),
    searchSongs: builder.query({
      query: (searchTerm) => `/stats/track/search/${searchTerm}`,
    }),
    getSongsByGenre: builder.query({
      query: (genre) => `/stats/tracks/genres/${genre}`,
    }),
    getRelatedSongs: builder.query({
      query: ({ songid }) => `/stats/tracks/related/${songid}`,
    }),
    getSongsByCountry: builder.query({
      query: () => '/stats/track/country',
    }),
    getAllGenres: builder.query({
      query: () => '/stats/genres',
    }),

    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
    }),
    authenticateUser: builder.mutation({
      query: (userCreds) => ({
        url: '/auth/login',
        method: 'POST',
        body: userCreds,
        headers: {
          Authorization: `Basic ${btoa(
            `${userCreds.email}:${userCreds.password}`
          )}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'DELETE',
        headers: {
          'x-token': window.localStorage.getItem('x-token'),
        },
      }),
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetArtistQuery,
  useGetTopArtistsQuery,
  useGetSongQuery,
  useSearchSongsQuery,
  useGetSongsByGenreQuery,
  useGetRelatedSongsQuery,
  useGetSongsByCountryQuery,
  useGetAllGenresQuery,
  useRegisterUserMutation,
  useAuthenticateUserMutation,
  useLogoutUserMutation,
} = coreAPI;
