import request from 'request';
// import dbClient from '../utils/db';

export default class SpotifyController {
  static baseUrl = 'https://api.spotify.com/v1';

  static async getTopCharts(req, res) {
    try {
      const headers = { Authorization: req.token };

      request.get(
        `${SpotifyController.baseUrl}/playlists/37i9dQZF1DXcBWIGoYBM5M`,
        {
          headers,
          json: true,
        },
        (error, _response, body) => {
          if (error) {
            console.error({ error: error.stack });
            return res.status(500).json({ error: 'Failed to fetch data' });
          }
          return res.status(200).json(body.tracks.items);
        }
      );
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async getArtist(req, res) {
    try {
      const headers = { Authorization: req.token };

      request.get(
        `${SpotifyController.baseUrl}/artists/${req.params.id}`,
        {
          headers,
          json: true,
        },
        (error, _response, body) => {
          if (error) {
            console.error({ error: error.stack });
            return res.status(500).json({ error: 'Failed to fetch data' });
          }
          return res.status(200).json(body);
        }
      );
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async getSong(req, res) {
    try {
      const headers = { Authorization: req.token };

      request.get(
        `${SpotifyController.baseUrl}/tracks/${req.params.id}`,
        {
          headers,
          json: true,
        },
        (error, _response, body) => {
          if (error) {
            console.error({ error: error.stack });
            return res.status(500).json({ error: 'Failed to fetch data' });
          }
          return res.status(200).json(body);
        }
      );
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async searchSongs(req, res) {
    try {
      const headers = { Authorization: req.token };

      request.get(
        `${SpotifyController.baseUrl}/search?q=${encodeURIComponent(
          req.body.searchTerm
        )}&type=track,artist`,
        {
          headers,
          json: true,
        },
        (error, _response, body) => {
          if (error) {
            console.error({ error: error.stack });
            return res.status(500).json({ error: 'Failed to fetch data' });
          }
          return res.status(200).json(body);
        }
      );
    } catch (err) {
      console.error({ error: err.stack });
    }
  }
}
