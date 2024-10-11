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
      const spotifyHeaders = { Authorization: req.token };

      request.get(
        `${SpotifyController.baseUrl}/tracks/${encodeURIComponent(
          req.params.id
        )}`,
        {
          headers: spotifyHeaders,
          json: true,
        },
        (spotifyError, _spotifyResponse, spotifyBody) => {
          if (spotifyError) {
            console.error({ error: spotifyError.stack });
            return res
              .status(500)
              .json({ error: 'Failed to fetch spotify data' });
          }

          request.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_track=${encodeURIComponent(
              spotifyBody.name
            )}&q_artist=${encodeURIComponent(
              spotifyBody.artists[0].name
            )}&apikey=${process.env.MusixMatch_API_KEY}`,
            { json: true },
            (mError, _mResponse, mBody) => {
              if (mError) {
                console.error({ error: mError.stack });
                return res
                  .status(500)
                  .json({ error: 'Failed to fetch initial musixmatch data' });
              }

              request.get(
                `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${encodeURIComponent(
                  mBody.message.body.track_list[0].track.track_id
                )}&apikey=${process.env.MusixMatch_API_KEY}`,
                { json: true },
                (fError, _fResponse, fBody) => {
                  if (fError) {
                    console.error({ error: fError.stack });
                    return res.status(500).json({
                      error: 'Failed to fetch musixmatch data',
                    });
                  }
                  return res.status(200).json({
                    spotify: spotifyBody,
                    lyrics: fBody.message.body.lyrics.lyrics_body.split('*')[0],
                  });
                }
              );
            }
          );
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

  static async getSongsByGenre(req, res) {
    try {
      const headers = { Authorization: req.token };

      request.get(
        `${
          SpotifyController.baseUrl
        }/recommendations?seed_genres=${encodeURIComponent(
          req.params.genre
        )}&limit=20`,
        {
          headers,
          json: true,
        },
        (error, _response, body) => {
          if (error) {
            console.error({ error: error.message });
            return res.status(500).json({ error: 'Failed to fetch data' });
          }
          return res.status(200).json(body);
        }
      );
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async getRelatedSongs(req, res) {
    try {
      const headers = { Authorization: req.token };

      request.get(
        `${
          SpotifyController.baseUrl
        }/recommendations?seed_tracks=${encodeURIComponent(
          req.params.id
        )}&limit=20`,
        {
          headers,
          json: true,
        },
        (error, _response, body) => {
          if (error) {
            console.error({ error: error.message });
            return res.status(500).json({ error: 'Failed to fetch data' });
          }
          return res.status(200).json(body);
        }
      );
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async getSongsByCountry(req, res) {
    try {
      const headers = { Authorization: req.token };

      request.get(
        `${
          SpotifyController.baseUrl
        }/browse/new-releases?country=${encodeURIComponent(
          req.params.countryCode
        )}&limit=20`,
        {
          headers,
          json: true,
        },
        (error, _response, body) => {
          if (error) {
            console.error({ error: error.message });
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
