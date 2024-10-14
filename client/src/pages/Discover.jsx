/* eslint-disable comma-dangle */
// import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAllGenresQuery,
  useGetSongsByGenreQuery,
} from '../redux/services/coreAPI';
import { Error, Loader, SongCard } from '../components';
import { selectGenreListId } from '../redux/features/playerSlice';

const Discover = ({ handleFavorites }) => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying, genreListId } = useSelector(
    (state) => state.player
  );
  const { data: genres, isFetching: isFetchingGenres } = useGetAllGenresQuery();
  const { data, isFetching, error } = useGetSongsByGenreQuery(
    genreListId.toLowerCase()
  );

  // const [favorites, setFavorites] = useState([]);

  // useEffect(() => {}, [favorites]);

  // const handleFavorites = (list) => {
  //   setFavorites(list);
  // };

  if (isFetching || isFetchingGenres) {
    return <Loader title="Loading songs..." />;
  }

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">
          Discover {genreListId}
        </h2>
        <select
          onChange={(e) => {
            dispatch(selectGenreListId(e.target.value));
          }}
          value={genreListId}
          className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5"
        >
          {genres?.map((genre) => (
            <option key={genre} value={genre.toUpperCase()}>
              {genre.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            i={i}
            activeSong={activeSong}
            isPlaying={isPlaying}
            data={data}
            handleFavorites={handleFavorites}
          />
        ))}
      </div>
    </div>
  );
};

export default Discover;
