import mongoose from 'mongoose';
import User from '../models/User';
import Playlist from '../models/Playlist';
import Song from '../models/Song';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'music_app';
    this.url = `mongodb://${this.host}:${this.port}/${this.database}`;
    this.connectionEstablished = false;
    this.users = User;
    this.playlists = Playlist;
    this.songs = Song;
  }

  async connect() {
    try {
      const conn = await mongoose.connect(this.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.connectionEstablished = true;

      console.log(`MongoDB client connected: ${conn.connection.host}`);
    } catch (err) {
      this.connectionEstablished = false;

      console.error(`MongoDB client failed to connect: ${err.message}`);
    }
  }

  isAlive() {
    return this.connectionEstablished;
  }

  async nbUsers() {
    return this.users.countDocuments();
  }

  async nbPlaylists() {
    return this.playlists.countDocuments();
  }

  async nbSongs() {
    return this.songs.countDocuments();
  }

  async getUserByEmail(email) {
    return this.users.findOne({ email });
  }

  async getUserById(id) {
    return this.users.findById(id);
  }

  async getUserByUsername(username) {
    return this.users.findOne({ username });
  }

  async getUserPassword(email) {
    return this.users.findOne({ email }).select('password');
  }

  async createUser(user) {
    const newUser = await this.users(user);
    return newUser.save();
  }

  async deleteUser(id) {
    return this.users.deleteOne({ _id: id });
  }

  async updateUserPass(id, newPassword) {
    return this.users.updateOne(
      { _id: id },
      { $set: { password: newPassword } }
    );
  }

  async createPlaylist(playlist) {
    const newPlaylist = await this.playlists(playlist);
    return newPlaylist.save();
  }

  async getPlaylist(id) {
    return this.playlists.findById(id);
  }

  async updatePlaylist(id, playlist) {
    return this.playlists.findByIdAndUpdate(id, playlist, {
      new: true,
      runValidators: true,
    });
  }

  async addCollaboratorsToPlaylist(playlistId, userId) {
    return this.playlists.updateOne(
      { _id: playlistId },
      { $push: { collaborators: userId } }
    );
  }

  async deleteCollaboratorsFromPlaylist(playlistId, userId) {
    return this.playlists.updateOne(
      { _id: playlistId },
      { $pop: { collaborators: userId } }
    );
  }

  async addSongsToPlaylist(playlistId, songId) {
    return this.playlists.updateOne(
      { _id: playlistId },
      { $push: { songs: songId } }
    );
  }

  async deletePlaylist(id) {
    return this.playlists.deleteOne({ _id: id });
  }

  async createSong(song) {
    const newSong = await this.songs(song);
    return newSong.save();
  }

  async getSong(id) {
    return this.songs.findById(id);
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    return this.playlists.updateOne(
      { _id: playlistId },
      { $pop: { songs: songId } }
    );
  }

  async addSongToFavorites(userId, songId) {
    const updatedFavorites = await this.users.updateOne(
      { _id: userId },
      { $push: { favoritedSongs: songId } }
    ).favoritedSongs;

    return this.songs.find({ _id: { $in: updatedFavorites } });
  }

  async deleteSongFromFavorites(userId, songId) {
    const updatedFavorites = await this.users.updateOne(
      { _id: userId },
      { $pop: { favoritedSongs: songId } }
    ).favoritedSongs;

    return this.songs.find({ _id: { $in: updatedFavorites } });
  }

  async getFavorites(userId) {
    const favorites = await this.users.findById(userId).favoritedSongs;
    return this.songs.find({ _id: { $in: favorites } });
  }

  async addplaylistToFavorites(userId, playlistId) {
    return this.users.updateOne(
      { _id: userId },
      { $push: { favoritedPlaylists: playlistId } }
    );
  }

  async deletePlaylistFromFavorites(userId, playlistId) {
    return this.users.updateOne(
      { _id: userId },
      { $pop: { favoritedPlaylists: playlistId } }
    );
  }
}

const dbClient = new DBClient();
dbClient.connect();

export default dbClient;
