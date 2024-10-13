import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coreAPI = createApi({
  reducerPath: 'coreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    prepareHeaders: (headers) => {
      headers.set('x-token', 'caba7808-6603-40a3-8aa3-7aa666177e78');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => '/stats/top-charts' }),
    getArtist: builder.query({
      query: (artistId) => `/stats/artists/${artistId}`,
    }),
    getSong: builder.query({
      query: ({ songid }) => `/stats/tracks/${songid}`,
    }),
    searchSongs: builder.query({
      query: () => '/stats/search/',
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
  }),
});

export const {
  useGetTopChartsQuery,
  useGetArtistQuery,
  useGetSongQuery,
  useSearchSongsQuery,
  useGetSongsByGenreQuery,
  useGetRelatedSongsQuery,
  useGetSongsByCountryQuery,
} = coreAPI;
