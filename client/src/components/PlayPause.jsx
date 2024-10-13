import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';

const PlayPause = ({ song, activeSong, isPlaying, handlePause, handlePlay }) => (isPlaying && activeSong?.name === song?.name ? (
  <FaPauseCircle size={35} className="text-gray-300" onClick={handlePause} />
) : (
  <FaPlayCircle size={35} className="text-gray-300" onClick={handlePlay} />
));

export default PlayPause;
