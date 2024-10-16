/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import PlayPause from './PlayPause';
import { useDeleteSongFromPlaylistMutation } from '../redux/services/coreAPI';

const SongBar = ({
  song,
  i,
  artistId,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
  playlist,
  setPlaylistSongsChanged,
}) => {
  const { playlistid } = useParams();
  const [deleteSongFromPlaylist] = useDeleteSongFromPlaylistMutation();

  const handleDeleteClick = async (e) => {
    e.preventDefault();

    try {
      const songId = song.id;
      await deleteSongFromPlaylist({ playlistid, songId });
      setPlaylistSongsChanged && setPlaylistSongsChanged(true);
    } catch (err) {
      console.error({ error: err.stack });
      alert('Please try again later.');
    }
  };

  return (
    <div
      className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${
        activeSong?.name === song?.name ? 'bg-[#4c426e]' : 'bg-transparent'
      } py-2 p-4 rounded-lg cursor-pointer mb-2`}
    >
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
      <div className="flex-1 flex flex-row justify-between items-center">
        <img
          className="w-20 h-20 rounded-lg"
          src={song?.album?.images[0]?.url}
          alt={song?.name}
        />
        <div className="flex-1 flex flex-col justify-center mx-3">
          <Link to={`/songs/${song?.id}`}>
            <p className="text-xl font-bold text-white">{song?.name}</p>
          </Link>
          <Link
            to={
              song?.artists[0]?.id
                ? `/artists/${song?.artists[0]?.id}`
                : '/top-artists'
            }
          >
            <p className="text-base text-gray-300 mt-1">
              {song?.artists[0]?.name}
            </p>
          </Link>
        </div>
      </div>
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={() => handlePlayClick(song, i)}
      />
      {/* Delete Icon */}
      {playlist && (
        <AiOutlineDelete
          className="w-8 h-8 text-red-500 ml-4 cursor-pointer"
          onClick={handleDeleteClick}
        />
      )}
    </div>
  );
};

export default SongBar;
