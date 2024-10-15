/* eslint-disable no-unused-expressions */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import {
  useAddSongToFavoritesMutation,
  useRemoveSongFromFavoritesMutation,
  useGetFavoritedSongsQuery,
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
  const [isFavorited, setIsFavorited] = useState(false);

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
              song?.artists
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
    </div>
  );
};

export default SongCard;
