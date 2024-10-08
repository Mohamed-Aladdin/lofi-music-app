import dbClient from '../utils/db';

export default class SongsController {
  static async addSongToPlaylist(req, res) {
    try {
      const { user } = req;
      const playlist = await dbClient.getPlaylist(req.params.id);

      if (
        user._id !== playlist.userId ||
        !playlist.collaborators.includes(user._id)
      ) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const song = await dbClient.createSong(req.body);
      const updatedPlaylist = await dbClient.updatePlaylist(
        req.params.id,
        song._id
      );

      return res.status(201).json(updatedPlaylist);
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async deleteSongFromPlaylist(req, res) {
    try {
      const { user } = req;
      const playlist = await dbClient.getPlaylist(req.params.id);

      if (
        user._id !== playlist.userId ||
        !playlist.collaborators.includes(user._id)
      ) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const updatedPlaylist = await dbClient.deleteSongFromPlaylist(
        playlist._id,
        SongId
      );
      return res.status(204).json(updatedPlaylist);
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async addSongToFavorites(req, res) {
    try {
      const { user } = req;
      const song = await dbClient.createSong(req.body);

      if (user.favoritedSongs.includes(song._id)) {
        return res.status(400).json({ error: 'Already exist' });
      }
      const updatedFavorites = await dbClient.addSongToFavorites(
        user._id,
        song._id
      );

      return res.status(200).json(updatedFavorites);
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async removeSongFromFavorites(req, res) {
    try {
      const { user } = req;
      const updatedFavorites = await dbClient.deleteSongFromFavorites(
        user._id,
        req.params.id
      );
      return res.status(204).json({ updatedFavorites });
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async getFavoriteSongs(req, res) {
    try {
      const { user } = req;
      const favorites = await dbClient.getFavorites(user._id);

      if (!favorites) {
        return res.status(404).json({ error: 'Not found' });
      }
      return res.status(200).json(favorites);
    } catch (err) {
      console.error({ error: err.message });
    }
  }
}
