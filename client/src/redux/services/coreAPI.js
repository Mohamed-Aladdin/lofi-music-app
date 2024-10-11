import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coreAPI = createApi({
  reducerPath: 'coreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    prepareHeaders: (headers) => {
      headers.set('x-token', '58e2c56b-8cac-42eb-8f19-acb0af53ad18');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => '/stats/topCharts' }),
    getArtist: builder.query({
      query: (artistId) => `/stats/artist/${artistId}`,
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
  }),
});

export const {
  useGetTopChartsQuery,
  useGetArtistQuery,
  useGetSongQuery,
  useSearchSongsQuery,
  useGetSongsByGenreQuery,
  useGetRelatedSongsQuery,
} = coreAPI;
