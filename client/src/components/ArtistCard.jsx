/* eslint-disable no-nested-ternary */
import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ artist, playlist }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"
      onClick={() => navigate(`/${artist ? 'artists' : 'playlists'}/${artist ? artist?.id : playlist?._id}`)}
    >
      <img
        alt="artist_img"
        src={artist ? artist?.images[0].url : 'https://cdn-icons-png.flaticon.com/512/636/636224.png'}
        className="w-full h-56 rounded-lg"
      />
      <p className="mt-4 font-semibold text-lg text-white truncate">
        {artist ? artist?.name : playlist?.name}
      </p>
    </div>
  );
};

export default ArtistCard;
