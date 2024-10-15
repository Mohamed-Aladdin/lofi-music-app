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
    getFavoritedSongs: builder.query({
      query: () => '/songs/favorites',
    }),
    getAllPlaylists: builder.query({
      query: () => '/playlists',
    }),
    getSongsFromPlaylist: builder.query({
      query: ({ playlistid }) => `/playlists/${playlistid}`,
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
    addSongToFavorites: builder.mutation({
      query: (songData) => ({
        url: '/songs/favorites',
        method: 'POST',
        headers: {
          'x-token': window.localStorage.getItem('x-token'),
        },
        body: songData,
      }),
    }),
    removeSongFromFavorites: builder.mutation({
      query: ({ songid }) => ({
        url: `/songs/favorites/${songid}`,
        method: 'DELETE',
        headers: {
          'x-token': window.localStorage.getItem('x-token'),
        },
      }),
    }),
    createPlaylist: builder.mutation({
      query: (playlistData) => ({
        url: '/playlists',
        method: 'POST',
        headers: {
          'x-token': window.localStorage.getItem('x-token'),
        },
        body: playlistData,
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
  useAddSongToFavoritesMutation,
  useRemoveSongFromFavoritesMutation,
  useGetFavoritedSongsQuery,
  useGetAllPlaylistsQuery,
  useCreatePlaylistMutation,
  useGetSongsFromPlaylistQuery,
} = coreAPI;
