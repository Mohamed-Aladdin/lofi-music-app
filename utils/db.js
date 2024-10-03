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
        console.log(`MongoDB connected: ${conn.connection.host}`);
      } catch (err) {
        console.log(`MongoDB failed to connect: ${err.toString()}`);
      }
    };
  }

  isAlive() {
    return this.connectionEstablished;
  }

  async nbUsers() {
    return User.countDocuments();
  }

  async nbPlaylists() {
    return Playlist.countDocuments();
  }

  async nbSongs() {
    return Song.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
