import SongBar from './SongBar';

const RelatedSongs = ({
  data,
  songs,
  artistId,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
}) => (
  <div className="flex flex-col">
    {!songs && (
      <h1 className="font-bold text-3xl text-white">
        {artistId ? 'Top Songs:' : 'Related Songs:'}
      </h1>
    )}
    {songs && <h1 className="font-bold text-3xl text-white">Your Songs</h1>}
    <div className="mt-6 w-full flex flex-col">
      {data?.map((song, i) => (
        <SongBar
          key={`${artistId}-${song?.id}-${i}`}
          song={song}
          i={i}
          artistId={artistId}
          isPlaying={isPlaying}
          activeSong={activeSong}
          handlePauseClick={handlePauseClick}
          handlePlayClick={handlePlayClick}
        />
      ))}
    </div>
  </div>
);

export default RelatedSongs;
