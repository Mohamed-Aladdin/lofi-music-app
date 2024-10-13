import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ song }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"
      onClick={() => navigate(`/artists/${song?.track?.artists[0]?.id}`)}
    >
      <img
        alt="song_img"
        src={song?.track?.images[0].url}
        className="w-full h-56 rounded-lg"
      />
      <p className="mt-4 font-semibold text-lg text-white truncate">
        {song?.ar}
      </p>
    </div>
  );
};

export default ArtistCard;
