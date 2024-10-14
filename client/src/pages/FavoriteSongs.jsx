import { useSelector } from 'react-redux';
import { Error, Loader, SongCard } from '../components';
import { useGetFavoritedSongsQuery } from '../redux/services/coreAPI';

const FavoriteSongs = () => {
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetFavoritedSongsQuery();

  if (isFetching) return <Loader title="Loading your songs..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Favorite Songs
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.songs?.map((song, i) => (
          <SongCard
            key={song?.id}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data.songs}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteSongs;
