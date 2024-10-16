/* eslint-disable comma-dangle */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Error, Loader, RelatedSongs } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { useGetSongsFromPlaylistQuery } from '../redux/services/coreAPI';

const PlaylistDetails = () => {
  const dispatch = useDispatch();
  const { playlistid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error, refetch } = useGetSongsFromPlaylistQuery({
    playlistid,
  });
  const [playlistSongsChanged, setPlaylistSongsChanged] = useState(false);

  useEffect(() => {
    refetch();
  }, [playlistSongsChanged]);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: data?.songs, i }));
    dispatch(playPause(true));
  };

  if (isFetching) {
    return <Loader title="Loading your songs..." />;
  }

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="relative w-full flex flex-col">
        <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28">
          <div className="absolute inset-0 flex items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/636/636224.png"
              alt="art"
              className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
            />
            <div className="ml-5 ">
              <p className="font-bold sm:text-3xl text-xl text-white">
                {data?.playlist?.name}
              </p>
              {data?.playlist?.collaborators.length > 0 && (
                <>
                  <p className="text-base text-gray-700 mt-2 font-bold">Collaborators</p>
                  <p className="text-base text-gray-400 mt-2">
                    {data?.collaborators.join(', ')}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full sm:h-44 h-24" />
      </div>

      <RelatedSongs
        data={data.songs}
        songs={playlistid}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
        playlist="yes"
        setPlaylistSongsChanged={setPlaylistSongsChanged}
      />
    </div>
  );
};

export default PlaylistDetails;
