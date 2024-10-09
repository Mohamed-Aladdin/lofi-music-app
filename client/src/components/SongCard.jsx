import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const SongCard = ({ song, i, activeSong, isPlaying, data }) => {
  const handlePauseClick = () => {};

  const handlePlayClick = () => {};

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong?.title === song.title
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
          src={song.track.album.images[0]?.url}
          alt="song_img"
          className="w-full h-full rounded-lg"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <p className="semi-bold text-lg text-white truncate">
          <Link to={`/songs/${song?.track.id}`}>{song.track.name}</Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link
            to={
              song.track.artists
                ? `/artists/${song?.track.artists[0]?.id}`
                : '/top-artists'
            }
          >
            {song.track.artists.map((artist) => artist.name).join(', ')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SongCard;
