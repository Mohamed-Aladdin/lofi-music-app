import dbClient from '../utils/db';

export default class SongsController {
  static async addSongToPlaylists(req, res) {
    try {
      const { user } = req;
      const playlist = await dbClient.getPlaylist(req.params.id);

      if (
        user._id.toString() !== playlist.userId.toString() &&
        !playlist.collaborators.includes(user._id)
      ) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const foundSong = await dbClient.getSong(req.body._id);

      if (!foundSong) {
        await dbClient.createSong(req.body);
      }
      await dbClient.addSongToPlaylists(req.params.id, req.body._id);

      return res.status(201).send();
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async deleteSongFromPlaylist(req, res) {
    try {
      const { user } = req;
      const playlist = await dbClient.getPlaylist(req.params.id);

      if (
        user._id.toString() !== playlist.userId.toString() &&
        !playlist.collaborators.includes(user._id)
      ) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const updatedPlaylist = await dbClient.deleteSongFromPlaylist(
        playlist._id,
        req.body.songId
      );
      return res.status(204).json(updatedPlaylist);
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async addSongToFavorites(req, res) {
    try {
      const { user } = req;

      if (user.favoritedSongs.includes(req.body._id)) {
        return res.status(400).json({ error: 'Already exist' });
      }
      const foundSong = await dbClient.getSong(req.body._id);

      if (!foundSong) {
        await dbClient.createSong(req.body);
      }

      const updatedFavorites = await dbClient.addSongToFavorites(
        user._id,
        req.body._id
      );

      return res.status(200).json(updatedFavorites);
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async removeSongFromFavorites(req, res) {
    try {
      const { user } = req;
      const updatedFavorites = await dbClient.deleteSongFromFavorites(
        user._id,
        req.params.id
      );

      return res.status(200).json(updatedFavorites);
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async getFavoriteSongs(req, res) {
    try {
      const { user } = req;
      const favorites = await dbClient.getFavorites(user._id);

      if (!favorites) {
        return res.status(404).json({ error: 'Not found' });
      }

      const songsList = favorites.songs.map((song) => ({
        id: song._id,
        name: song.title,
        artists: [{ name: song.artist, id: song.artistId }],
        album: { name: song.album, images: [{ url: song.thumbnail }] },
        duration_ms: song.duration,
        preview_url: song.preview_url,
      }));
      const favoriteSongs = {
        songs: songsList,
        ids: favorites.ids,
      };
      return res.status(200).json(favoriteSongs);
    } catch (err) {
      console.error({ error: err.stack });
    }
  }
}
