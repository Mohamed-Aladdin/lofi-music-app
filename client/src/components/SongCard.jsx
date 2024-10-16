/* eslint-disable function-paren-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-expressions */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AiFillHeart, AiOutlineHeart, AiOutlinePlus } from 'react-icons/ai';
import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import {
  useAddSongToFavoritesMutation,
  useRemoveSongFromFavoritesMutation,
  useGetFavoritedSongsQuery,
  useGetAllPlaylistsQuery,
  useAddSongToPlaylistsMutation,
} from '../redux/services/coreAPI';

const SongCard = ({
  song,
  i,
  activeSong,
  isPlaying,
  data,
  handleFavorites,
}) => {
  const dispatch = useDispatch();

  const [addSongToFavorites] = useAddSongToFavoritesMutation();
  const [removeSongFromFavorites] = useRemoveSongFromFavoritesMutation();
  const { data: favoritedSongsData } = useGetFavoritedSongsQuery();
  const { data: userPlaylists } = useGetAllPlaylistsQuery();
  const [addSongToPlaylists] = useAddSongToPlaylistsMutation();

  const [isFavorited, setIsFavorited] = useState(false);
  const [showPlaylistChecklist, setShowPlaylistChecklist] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  useEffect(() => {
    setIsFavorited(favoritedSongsData?.ids?.includes(song?.id));
  }, [song.id]);

  const handleFavoriteClick = async () => {
    if (!isFavorited) {
      try {
        const songData = {
          _id: song?.id,
          title: song?.name,
          artist: song?.artists[0]?.name,
          artistId: song?.artists[0]?.id,
          album: song?.album?.name,
          duration: song?.duration_ms,
          thumbnail: song?.album?.images[0]?.url,
          preview_url: song?.preview_url,
        };

        const updatedFavorites = await addSongToFavorites(songData).unwrap();

        setIsFavorited(true);
        handleFavorites(updatedFavorites);
      } catch (err) {
        console.error({ error: err.stack });
        alert('Please try again later.');
      }
    } else {
      const songid = song?.id;
      try {
        const updatedFavorites = await removeSongFromFavorites({
          songid,
        }).unwrap();

        setIsFavorited(false);
        handleFavorites(updatedFavorites);
      } catch (err) {
        console.error({ error: err.stack });
        alert('Please try again later.');
      }
    }
  };

  const handlePlusClick = () => {
    setShowPlaylistChecklist((prev) => !prev);
  };

  const handlePlaylistChange = (playlistId) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };
  const handleAddToPlaylist = async (e) => {
    e.preventDefault();

    try {
      const songData = {
        _id: song?.id,
        title: song?.name,
        artist: song?.artists[0]?.name,
        artistId: song?.artists[0]?.id,
        album: song?.album?.name,
        duration: song?.duration_ms,
        thumbnail: song?.album?.images[0]?.url,
        preview_url: song?.preview_url,
      };
      await Promise.all(
        selectedPlaylists.map(async (playlistId) => {
          await addSongToPlaylists({ playlistId, songData }).unwrap();
        })
      );
      setShowPlaylistChecklist(false);
    } catch (err) {
      console.error({ error: err.stack });
      alert('Please try again later.');
    }
  };

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <AiOutlinePlus
          className="w-8 h-8 text-gray-600 absolute right-2 top-2 bg-slate-200 z-10"
          onClick={handlePlusClick}
        />
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong?.name === song?.name
              ? 'flex bg-black bg-opacity-70'
              : 'hidden'
          }`}
        >
          <PlayPause
            song={song}
            activeSong={activeSong}
            isPlaying={isPlaying}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img
          src={song?.album?.images[0]?.url}
          alt="song_img"
          className="w-full h-full rounded-lg"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <p className="semi-bold text-lg text-white truncate">
          <Link to={`/songs/${song?.id}`}>{song?.name}</Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link
            to={
              song?.artists[0]?.id
                ? `/artists/${song?.artists[0]?.id}`
                : '/top-artists'
            }
          >
            {song?.artists?.map((artist) => artist.name).join(', ')}
          </Link>
        </p>
      </div>
      {/* Favorite Icon */}
      <div className="absolute bottom-4 right-4">
        {isFavorited ? (
          <AiFillHeart
            className="w-6 h-6 text-red-500"
            onClick={handleFavoriteClick}
          />
        ) : (
          <AiOutlineHeart
            className="w-6 h-6 text-white"
            onClick={handleFavoriteClick}
          />
        )}
      </div>
      {/* Show Playlist Checklist */}
      {showPlaylistChecklist && (
        <div className="mt-4 bg-gray-800 p-4 rounded-md absolute">
          <h3 className="text-white mb-2">Add to Playlist</h3>
          <div className="flex flex-col gap-2">
            <span className="text-gray-400">Your Playlists:</span>
            {userPlaylists?.ownedPlaylists?.map((playlist) => (
              <label key={playlist._id} className="flex items-center">
                <input
                  type="checkbox"
                  value={playlist._id}
                  onChange={() => handlePlaylistChange(playlist._id)}
                />
                <span className="ml-2 text-white">{playlist.name}</span>
              </label>
            ))}
            <span className="text-gray-400">Shared with you:</span>
            {userPlaylists?.sharedPlaylists?.map((playlist) => (
              <label key={playlist._id} className="flex items-center">
                <input
                  type="checkbox"
                  value={playlist._id}
                  onChange={() => handlePlaylistChange(playlist._id)}
                />
                <span className="ml-2 text-white">{playlist.name}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded"
              onClick={handleAddToPlaylist}
            >
              Add
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-3 py-2 rounded"
              onClick={() => setShowPlaylistChecklist(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongCard;
