// import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/coreAPI';

const AroundYou = ({ handleFavorites }) => {
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsByCountryQuery();
  // const [favorites, setFavorites] = useState([]);

  // useEffect(() => {}, [favorites]);

  // const handleFavorites = (list) => {
  //   setFavorites(list);
  // };

  if (isFetching) return <Loader title="Loading songs..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Around you
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.map((song, i) => (
          <SongCard
            key={song?.track?.id}
            song={song?.track}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
            handleFavorites={handleFavorites}
          />
        ))}
      </div>
    </div>
  );
};

export default AroundYou;
