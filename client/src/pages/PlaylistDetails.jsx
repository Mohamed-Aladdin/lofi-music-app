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
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  if (isFetching) {
    return <Loader title="Loading your songs..." />;
  }

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <RelatedSongs
        data={data}
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
