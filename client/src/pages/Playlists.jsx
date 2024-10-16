/* eslint-disable no-console */
/* eslint-disable no-alert */
import { useEffect, useState } from 'react';
import { Error, Loader, ArtistCard } from '../components';
import {
  useCreatePlaylistMutation,
  useGetAllPlaylistsQuery,
} from '../redux/services/coreAPI';

const Playlists = () => {
  const [showModal, setShowModal] = useState(false);
  const [playlistsChanged, setPlaylistsChanged] = useState(false);
  const [playlistInfo, setPlaylistInfo] = useState({
    name: undefined,
    collaborators: undefined,
  });
  const { data, isFetching, error, refetch } = useGetAllPlaylistsQuery();
  const [createPlaylist] = useCreatePlaylistMutation();

  useEffect(() => {
    refetch();
  }, [playlistsChanged]);

  const handleChange = (e) => {
    setPlaylistInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();

    try {
      await createPlaylist(playlistInfo);
      setShowModal(false);
      refetch();
    } catch (err) {
      console.error({ error: err.stack });
      alert('Please try again later.');
    }
  };

  if (isFetching) return <Loader title="Loading artists..." />;
  if (error) return <Error />;

  return (
    <>
      <div className="flex flex-col mb-10">
        {/* Create Playlist Button */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white font-bold py-2 px-4 mt-4 mb-4 rounded sm:w-[48%] w-full"
        >
          Create a Playlist
        </button>

        {/* Modal for Creating Playlist */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Create a New Playlist</h3>
              <span className="text-red-600 text-xl">*</span>
              <input
                type="text"
                placeholder="Playlist Name"
                id="name"
                value={playlistInfo.name}
                onChange={handleChange}
                className="border p-2 w-full mb-4"
              />
              <input
                type="text"
                placeholder="Collaborators (comma separated)"
                id="collaborators"
                value={playlistInfo.collaborators}
                onChange={handleChange}
                className="border p-2 w-full mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleCreatePlaylist}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
          Your Playlists
        </h2>

        <div className="flex flex-wrap sm:justify-start justify-center gap-8">
          {data?.ownedPlaylists?.map((playlist) => (
            <ArtistCard
              key={playlist._id}
              playlist={playlist}
              setPlaylistsChanged={setPlaylistsChanged}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
          Playlists to Contribute to
        </h2>

        <div className="flex flex-wrap sm:justify-start justify-center gap-8">
          {data?.sharedPlaylists?.map((playlist) => (
            <ArtistCard
              key={playlist._id}
              playlist={playlist}
              setPlaylistsChanged={setPlaylistsChanged}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Playlists;
