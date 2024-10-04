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
    this.client = async () => {
      try {
        const conn = await mongoose.connect(this.url).then(() => {
          this.connectionEstablished = true;
        });
        console.log(`MongoDB client connected: ${conn.connection.host}`);
      } catch (err) {
        console.log(`MongoDB client failed to connect: ${err.toString()}`);
      }
    };
    this.users = User;
    this.playlists = Playlist;
    this.songs = Song;
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

  async createUser(user) {
    return this.users.insertOne(user);
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
}

const dbClient = new DBClient();

export default dbClient;
