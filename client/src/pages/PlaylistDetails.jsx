/* eslint-disable indent */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable no-console */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Error, Loader, RelatedSongs } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import {
  useAddCollaboratorsToPlaylistMutation,
  useDeleteCollaboratorFromPlaylistMutation,
  useGetSongsFromPlaylistQuery,
} from '../redux/services/coreAPI';

const PlaylistDetails = () => {
  const dispatch = useDispatch();
  const { playlistid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error, refetch } = useGetSongsFromPlaylistQuery({
    playlistid,
  });
  const [deleteCollaboratorFromPlaylist] =
    useDeleteCollaboratorFromPlaylistMutation();
  const [addCollaboratorsToPlaylist] = useAddCollaboratorsToPlaylistMutation();
  const [playlistSongsChanged, setPlaylistSongsChanged] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [collaboratorsToAdd, setCollaboratorsToAdd] = useState('');

  useEffect(() => {
    refetch();
    setPlaylistSongsChanged(false);
  }, [playlistSongsChanged]);

  const handleAddCollaborators = async (e) => {
    e.preventDefault();

    const collaborators = collaboratorsToAdd
      .split(',')
      .map((user) => user.trim());

    try {
      await addCollaboratorsToPlaylist({ playlistid, collaborators });
      setPlaylistSongsChanged(true);
      setCollaboratorsToAdd('');
      setShowCollaboratorModal(false);
    } catch (err) {
      console.error({ error: err.stack });
      alert('Please try again later.');
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    try {
      await deleteCollaboratorFromPlaylist({
        playlistid,
        collaboratorId,
      });
      setPlaylistSongsChanged(true);
    } catch (err) {
      console.error({ error: err.stack });
      alert('Please try again later.');
    }
  };

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
              {data?.playlist?.collaborators.length > 0 &&
                data?.playlist?.userId ===
                  window.localStorage.getItem('userId') && (
                  <>
                    <p className="text-base text-gray-700 mt-2 font-bold">
                      Collaborators
                    </p>
                    <p className="text-base text-gray-400 mt-2">
                      {data?.collaborators?.map((collaborator) => (
                        <span
                          key={collaborator._id}
                          className="flex items-center"
                        >
                          {collaborator.username}
                          <button
                            type="submit"
                            onClick={() =>
                              handleRemoveCollaborator(collaborator._id)
                            }
                            className="ml-2 text-red-500"
                          >
                            Remove
                          </button>
                        </span>
                      ))}
                    </p>
                  </>
                )}
              {data?.playlist?.userId ===
                window.localStorage.getItem('userId') && (
                <button
                  type="button"
                  className="mt-2 p-2 bg-blue-500 text-white rounded"
                  onClick={() => setShowCollaboratorModal(true)}
                >
                  Manage Collaborators
                </button>
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
      {showCollaboratorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Manage Collaborators</h2>
            <div className="mb-4">
              <label className="block text-gray-700">
                Add Collaborators (comma-separated)
              </label>
              <input
                type="text"
                value={collaboratorsToAdd}
                onChange={(e) => setCollaboratorsToAdd(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              onClick={handleAddCollaborators}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCollaboratorModal(false)}
              className="ml-2 bg-red-500 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetails;
