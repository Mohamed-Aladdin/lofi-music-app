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

  async getUsers(usernames) {
    const users = await this.users.find({ username: { $in: usernames } });
    return users;
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

  async getAllUserPlaylists(userId) {
    const user = await this.users.findById(userId);
    const ownedPlaylists = await this.playlists.find({
      _id: { $in: user.playlists },
    });
    const sharedPlaylists = await this.playlists.find({
      _id: { $in: user.sharedPlaylists },
    });

    return { ownedPlaylists, sharedPlaylists };
  }

  async updatePlaylist(id, playlist) {
    return this.playlists.findByIdAndUpdate(id, playlist, {
      new: true,
      runValidators: true,
    });
  }

  async addCollaboratorsToPlaylist(playlistId, userId) {
    await this.playlists.updateOne(
      { _id: playlistId },
      { $push: { collaborators: userId } }
    );
    await this.users.updateOne(
      { _id: userId },
      { $push: { sharedPlaylists: playlistId } }
    );
  }
  async updateUserPlaylists(playlistId, userId) {
    return this.users.updateOne(
      { _id: userId },
      { $push: { playlists: playlistId } }
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
      { $pull: { songs: songId } }
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
    await this.users.updateOne(
      { _id: userId },
      { $push: { favoritedSongs: songId } }
    );
    const user = await this.users.findOne({ _id: userId });

    // return this.songs.find({ _id: { $in: user.favoritedSongs } });
    return user.favoritedSongs;
  }

  async deleteSongFromFavorites(userId, songId) {
    await this.users.updateOne(
      { _id: userId },
      { $pull: { favoritedSongs: songId } }
    );
    const user = await this.users.findOne({ _id: userId });

    // return this.songs.find({ _id: { $in: user.favoritedSongs } });
    return user.favoritedSongs;
  }

  async getFavorites(userId) {
    const user = await this.users.findById(userId);
    return {
      songs: await this.songs.find({ _id: { $in: user.favoritedSongs } }),
      ids: user.favoritedSongs,
    };
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
      { $pull: { favoritedPlaylists: playlistId } }
    );
  }
}

const dbClient = new DBClient();
dbClient.connect();

export default dbClient;
