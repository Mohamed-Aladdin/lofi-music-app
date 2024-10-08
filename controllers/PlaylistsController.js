import dbClient from '../utils/db';

export default class PlaylistsController {
  static async createPlaylist(req, res) {
    try {
      const { user } = req;
      const userId = user._id;
      const name = req.body.name;
      const playlist = { userId, name };

      const newPlaylist = await dbClient.createPlaylist(playlist);
      return res.status(201).json(newPlaylist);
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async getPlaylist(req, res) {
    const { user } = req;
    const playlist = await dbClient.getPlaylist(req.params.id);

    if (playlist.userId != user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json(playlist);
  }

  static async updatePlaylist(req, res) {
    try {
      const updatedPlaylist = await dbClient.updatePlaylist(
        req.params.id,
        req.body
      );
      return res.status(200).json(updatedPlaylist);
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async deletePlaylist(req, res) {
    try {
      await dbClient.deletePlaylist(req.params.id);
      return res.status(204).send();
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async addCollaborators(req, res) {
    try {
      const { user } = req;
      const playlist = await dbClient.getPlaylist(req.params.id);

      if (user._id !== playlist.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userToBeAdded = await dbClient.getUserByUsername(req.body.username);

      if (!userToBeAdded) {
        return res.status(404).json({ error: 'Not found' });
      }
      const updatedPlaylist = await dbClient.addCollaboratorsToPlaylist(
        playlist._id,
        userToBeAdded._id
      );

      return res.status(201).json(updatedPlaylist);
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async deleteCollaborators(req, res) {
    try {
      const { user } = req;
      const playlist = await dbClient.getPlaylist(req.params.id);

      if (user._id !== playlist.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userToBeRemoved = await dbClient.getUserByUsername(
        req.body.username
      );

      if (!userToBeRemoved) {
        return res.status(404).json({ error: 'Not found' });
      }
      const updatedPlaylist = await dbClient.deleteCollaboratorsFromPlaylist(
        playlist._id,
        userToBeRemoved._id
      );

      return res.status(204).json(updatedPlaylist);
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async addFavoritePlaylist(req, res) {
    try {
      const { user } = req;
      const updatedFavorites = await dbClient.addplaylistToFavorites(
        user._id,
        req.params.id
      );

      return res.status(201).json(updatedFavorites);
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async deletePlaylistFromFavorites(req, res) {
    try {
      const { user } = req;
      const updatedFavorites = await dbClient.deletePlaylistFromFavorites(
        user._id,
        req.params.id
      );

      return res.status(204).json(updatedFavorites);
    } catch (err) {
      console.error({ error: err.message });
    }
  }
}
