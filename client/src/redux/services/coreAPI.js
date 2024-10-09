import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coreAPI = createApi({
  reducerPath: 'coreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    prepareHeaders: (headers) => {
      headers.set('x-token', '79c1cc3d-9e6b-4c1d-a07d-c7bdb64488b4');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => '/stats/topCharts' }),
    getArtist: builder.query({
      query: (artistId) => `/stats/artist/${artistId}`,
    }),
    getSong: builder.query({
      query: (songId) => `/stats/track/${songId}`,
    }),
    searchSongs: builder.query({
      query: (searchTerm) => `/stats/search/${searchTerm}`,
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetArtistQuery,
  useGetSongQuery,
  useSearchSongsQuery,
} = coreAPI;
