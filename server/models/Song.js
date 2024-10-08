import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    duration: { type: Number, required: true },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v); // Basic URL validation
        },
        message: (props) => `${props.value} is not a valid thumbnail URL!`,
      },
    },
    source: {
      type: String,
      required: true,
      enum: ['Spotify', 'YouTube', 'AppleMusic'],
    },
  },
  { timestamps: true }
);

SongSchema.index({ title: 1, artist: 1 });

const Song = mongoose.model('Song', SongSchema);

export default Song;
