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
      console.error({ error: err.toString() });
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
      console.error({ error: err.toString() });
    }
  }

  static async deletePlaylist(req, res) {
    try {
      await dbClient.deletePlaylist(req.params.id);
      return res.status(204).send();
    } catch (err) {
      console.error({ error: err.toString() });
    }
  }

  static async addCollaborators(req, res) {
    try {
      const { user } = req;
      const playlist = dbClient.getPlaylist(req.params.id);

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
      console.error({ error: err.toString() });
    }
  }

  static async deleteSong(req, res) {
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
      console.error({ error: err.toString() });
    }
  }
}
