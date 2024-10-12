import { Link } from 'react-router-dom';

const DetailsHeader = ({ artistId, artistData, songData }) => (
  <div className="relative w-full flex flex-col">
    <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28">
      <div className="absolute inset-0 flex items-center">
        <img
          src={
            artistId
              ? artistData?.images[0]?.url
                ?.replace('{w}', '500')
                .replace('{h}', '500')
              : songData?.spotify?.album?.images[0]?.url
          }
          alt="art"
          className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
        />
        <div className="ml-5 ">
          <p className="font-bold sm:text-3xl text-xl text-white">
            {artistId ? artistData?.name : songData?.spotify?.name}
          </p>
          {!artistId && (
            <Link to={`/artists/${songData?.spotify?.artists[0]?.id}`}>
              <p className="text-base text-gray-400 mt-2">
                {songData?.spotify?.artists[0]?.name}
              </p>
            </Link>
          )}
          <p className="text-base text-gray-400 mt-2">
            {artistId
              ? artistData?.genres?.join(' / ').toUpperCase()
              : songData?.genres?.join(' / ').toUpperCase()}
          </p>
        </div>
      </div>
    </div>
    <div className="w-full sm:h-44 h-24" />
  </div>
);

export default DetailsHeader;
