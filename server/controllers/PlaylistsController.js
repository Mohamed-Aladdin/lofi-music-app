import dbClient from '../utils/db';

export default class PlaylistsController {
  static async createPlaylist(req, res) {
    try {
      const { user } = req;
      const userId = user._id;
      const name = req.body.name;
      if (req.body.collaborators) {
        const collaboratorsList = req.body.collaborators.split(',');
        const users = await dbClient.getUsers(collaboratorsList);
        const collaborators = users.map((user) => user._id);
        const uniqueIds = [...new Set(collaborators)];
        const playlist = { userId, name, uniqueIds };
        const newPlaylist = await dbClient.createPlaylist(playlist);
        users.map(async (user) => {
          await dbClient.addCollaboratorsToPlaylist(newPlaylist._id, user._id);
        });
        await dbClient.updateUserPlaylists(newPlaylist._id, user._id);
        return res.status(201).json(newPlaylist);
      } else {
        const playlist = { userId, name };
        const newPlaylist = await dbClient.createPlaylist(playlist);
        await dbClient.updateUserPlaylists(newPlaylist._id, user._id);
        return res.status(201).json(newPlaylist);
      }
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async getAllUserPlaylists(req, res) {
    try {
      const { user } = req;
      const playlists = await dbClient.getAllUserPlaylists(user._id);

      return res.status(200).json(playlists);
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async getPlaylistSongs(req, res) {
    const { user } = req;
    const playlist = await dbClient.getPlaylist(req.params.id);

    if (
      playlist.userId.toString() !== user._id.toString() &&
      !playlist.collaborators.includes(user._id)
    ) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const songs = await dbClient.getSongsFromPlaylist(req.params.id);
    const songsList = songs.map((song) => ({
      id: song._id,
      name: song.title,
      artists: [{ name: song.artist, id: song.artistId }],
      album: { name: song.album, images: [{ url: song.thumbnail }] },
      duration_ms: song.duration,
      preview_url: song.preview_url,
    }));
    return res.status(200).json(songsList);
  }

  static async updatePlaylist(req, res) {
    try {
      const updatedPlaylist = await dbClient.updatePlaylist(
        req.params.id,
        req.body
      );
      return res.status(200).json(updatedPlaylist);
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async deletePlaylist(req, res) {
    try {
      await dbClient.deletePlaylist(req.params.id);
      return res.status(204).send();
    } catch (err) {
      console.error({ error: err.stack });
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
      console.error({ error: err.stack });
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
      console.error({ error: err.stack });
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
      console.error({ error: err.stack });
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
      console.error({ error: err.stack });
    }
  }
}
