import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    duration: { type: Number, required: true },
    thumbnail: {
      type: String,
      required: true,
    },
    preview_url: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['Spotify', 'YouTube', 'AppleMusic'],
      default: 'Spotify',
    },
  },
  { timestamps: true }
);

SongSchema.index({ title: 1, artist: 1 });

const Song = mongoose.model('Song', SongSchema);

export default Song;
