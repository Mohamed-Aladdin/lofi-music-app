import dbClient from '../utils/db';

export default class SongsController {
  async addSongToPlaylist(req, res) {
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
      console.error({ error: err.toString() });
    }
  }
}
