import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: {
      type: String,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // A simple 10-digit validation
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    country: { type: String, trim: true },
    password: { type: String, required: true, select: false },
    playlists: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
      default: [],
    },
    favoritedSongs: {
      type: [{ type: String, ref: 'Song' }],
      default: [],
    },
    favoritedPlaylists: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
      default: [],
    },
    sharedPlaylists: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1, username: 1, phone: 1 }, { unique: true });

const User = mongoose.model('User', UserSchema);

export default User;
