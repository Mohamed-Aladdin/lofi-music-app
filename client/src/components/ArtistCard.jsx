/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-nested-ternary */
import { useNavigate } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDeletePlaylistMutation } from '../redux/services/coreAPI';

const ArtistCard = ({ artist, playlist, setPlaylistsChanged }) => {
  const navigate = useNavigate();
  const [deletePlaylist] = useDeletePlaylistMutation();

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await deletePlaylist(playlist._id);
      setPlaylistsChanged(true);
    } catch (err) {
      console.error({ error: err.stack });
      alert('Please try again later.');
    }
  };

  return (
    <div
      className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"
      onClick={() =>
        navigate(
          `/${artist ? 'artists' : 'playlists'}/${
            artist ? artist?.id : playlist?._id
          }`
        )
      }
    >
      <img
        alt="artist_img"
        src={
          artist
            ? artist?.images[0].url
            : 'https://cdn-icons-png.flaticon.com/512/636/636224.png'
        }
        className="w-full h-56 rounded-lg"
      />
      <div className="flex items-center justify-between">
        <p className="mt-4 font-semibold text-lg text-white truncate">
          {artist ? artist?.name : playlist?.name}
        </p>
        {playlist && (
          <AiOutlineDelete
            className="w-8 h-8 text-red-500 ml-4 z-10"
            onClick={handleDeleteClick}
          />
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
