/* eslint-disable no-unused-expressions */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Error, Loader, SongCard } from '../components';
import { useGetFavoritedSongsQuery } from '../redux/services/coreAPI';

const FavoriteSongs = ({ handleFavorites, favorites }) => {
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error, refetch } = useGetFavoritedSongsQuery();

  useEffect(() => {
    refetch();
  }, [favorites, refetch]);

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
            handleFavorites={handleFavorites}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteSongs;
