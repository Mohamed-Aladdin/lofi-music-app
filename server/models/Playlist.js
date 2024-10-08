import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    songs: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
      default: [],
    },
    collaborators: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    favoritedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
  },
  { timestamps: true }
);

PlaylistSchema.index({ userId: 1 });

const Playlist = mongoose.model('Playlist', PlaylistSchema);

export default Playlist;
