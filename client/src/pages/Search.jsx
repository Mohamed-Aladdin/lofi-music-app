import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Error, Loader, SongCard } from '../components';
import { useSearchSongsQuery } from '../redux/services/coreAPI';

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useSearchSongsQuery(searchTerm);

  if (isFetching) return <Loader title="Loading results..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Showing results for: <span className="font-black">{searchTerm}</span>
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.tracks?.items.map((song, i) => (
          <SongCard
            key={song?.id}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data.tracks.items}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
