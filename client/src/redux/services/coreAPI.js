import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coreAPI = createApi({
  reducerPath: 'coreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    prepareHeaders: (headers) => {
      headers.set('x-token', '010d50c2-937e-4848-bf8a-e54b36cb4a74');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => '/stats/top-charts' }),
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
