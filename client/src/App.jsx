/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable comma-dangle */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';

import { Searchbar, Sidebar, MusicPlayer, TopPlay } from './components';
import {
  Login,
  Register,
  ArtistDetails,
  TopArtists,
  AroundYou,
  Discover,
  Search,
  SongDetails,
  TopCharts,
  FavoriteSongs,
  Playlists,
  PlaylistDetails,
} from './pages';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!window.localStorage.getItem('x-token')
  );
  const [favorites, setFavorites] = useState([]);
  const { activeSong } = useSelector((state) => state.player);

  useEffect(() => {}, [favorites]);

  useEffect(() => {
    const token = window.localStorage.getItem('x-token');
    const expiry = window.localStorage.getItem('token-expiration');

    if (token && Date.now() < expiry) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleFavorites = (list) => {
    setFavorites(list);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />{' '}
        {/* Redirect if not authenticated */}
      </Routes>
    );
  }

  return (
    <div className="relative flex">
      <Sidebar onLogout={setIsAuthenticated} />
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286]">
        <Searchbar />

        <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">
            <Routes>
              <Route
                path="/"
                element={<Discover handleFavorites={handleFavorites} />}
              />
              <Route path="/top-artists" element={<TopArtists />} />
              <Route
                path="/top-charts"
                element={<TopCharts handleFavorites={handleFavorites} />}
              />
              <Route
                path="/around-you"
                element={<AroundYou handleFavorites={handleFavorites} />}
              />
              <Route path="/artists/:id" element={<ArtistDetails />} />
              <Route path="/songs/:songid" element={<SongDetails />} />
              <Route path="/search/:searchTerm" element={<Search />} />
              <Route
                path="/favorites"
                element={
                  <FavoriteSongs
                    handleFavorites={handleFavorites}
                    favorites={favorites}
                  />
                }
              />
              <Route path="/playlists" element={<Playlists />} />
              <Route
                path="/playlists/:playlistid"
                element={<PlaylistDetails />}
              />
            </Routes>
          </div>
          <div className="xl:sticky relative top-0 h-fit">
            <TopPlay />
          </div>
        </div>
      </div>
      {activeSong?.name && (
        <div className="absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-t-3xl z-10">
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default App;
