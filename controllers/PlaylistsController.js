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
      const { user } = req;

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
}