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
        async (error, _response, body) => {
          if (error) {
            console.error({ error: error.stack });
            return res.status(500).json({ error: 'Failed to fetch data' });
          }
          const artistsList = body.tracks.items.slice(0, 5).map((item) => {
            return new Promise((resolve, reject) => {
              request.get(
                `${SpotifyController.baseUrl}/artists/${encodeURIComponent(
                  item.track.artists[0].id
                )}`,
                {
                  headers,
                  json: true,
                },
                (aError, _aResponse, aBody) => {
                  if (aError) {
                    console.error({ error: aError.stack });
                    reject('Failed to fetch data');
                  } else {
                    resolve(aBody.images[0].url);
                  }
                }
              );
            });
          });

          const artistsImages = await Promise.all(artistsList);
          // const items = Array.from({ length: 50 }, (_, index) => ({
          //   id: index + 1,
          //   name: `Item ${index + 1}`,
          // }));

          // Insert each image URL into the first 5 items of the items list
          for (let i = 0; i < artistsImages.length; i++) {
            body.tracks.items[i].track.artists[0].image = artistsImages[i]; // Assign image URL to the item
          }

          return res.status(200).json(body.tracks.items);
        }
      );
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async getTopArtists(req, res) {
    try {
      const headers = { Authorization: req.token };

      request.get(
        `${SpotifyController.baseUrl}/playlists/37i9dQZF1DXcBWIGoYBM5M`,
        {
          headers,
          json: true,
        },
        async (error, _response, body) => {
          if (error) {
            console.error({ error: error.stack });
            return res.status(500).json({ error: 'Failed to fetch data' });
          }

          const artistsIds = body.tracks.items.map(
            (item) => item.track.artists[0].id
          );
          const uniqueIds = [...new Set(artistsIds)];

          request.get(
            `${SpotifyController.baseUrl}/artists?ids=${encodeURIComponent(
              uniqueIds.join(',')
            )}`,
            {
              headers,
              json: true,
            },
            (cError, _cResponse, cBody) => {
              if (cError) {
                console.error({ error: cError.stack });
                return res.status(500).json({ error: 'Failed to fetch data' });
              }

              return res.status(200).json(cBody.artists);
            }
          );
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
        `${SpotifyController.baseUrl}/artists/${encodeURIComponent(
          req.params.id
        )}`,
        {
          headers,
          json: true,
        },
        (error, _response, body) => {
          if (error) {
            console.error({ error: error.stack });
            return res.status(500).json({ error: 'Failed to fetch data' });
          }

          request.get(
            `${SpotifyController.baseUrl}/artists/${encodeURIComponent(
              req.params.id
            )}/top-tracks`,
            {
              headers,
              json: true,
            },
            (tError, _tResponse, tBody) => {
              if (tError) {
                console.error({ error: error.stack });
                return res.status(500).json({ error: 'Failed to fetch data' });
              }

              body['tracks'] = tBody.tracks;
              return res.status(200).json(body);
            }
          );
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
        `${SpotifyController.baseUrl}/tracks/${encodeURIComponent(
          req.params.id
        )}`,
        {
          headers,
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
            `${SpotifyController.baseUrl}/artists/${encodeURIComponent(
              spotifyBody.artists[0].id
            )}`,
            {
              headers,
              json: true,
            },
            (aError, _aResponse, aBody) => {
              if (aError) {
                console.error({ error: aError.stack });
                return res.status(500).json({ error: 'Failed to fetch data' });
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
                    return res.status(500).json({
                      error: 'Failed to fetch initial musixmatch data',
                    });
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
                        genres: aBody.genres,
                        lyrics:
                          fBody.message.body.lyrics.lyrics_body.split('*')[0],
                      });
                    }
                  );
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
        `https://api.geoapify.com/v1/ipinfo?apiKey=${encodeURIComponent(
          process.env.GEOAPIFY_API_KEY
        )}`,
        { json: true },
        (gError, _gResponse, gBody) => {
          if (gError) {
            console.error({ error: gError.message });
            return res.status(500).json({ error: 'Failed to fetch location' });
          }

          request.get(
            `${
              SpotifyController.baseUrl
            }/browse/featured-playlists?locale=${encodeURIComponent(
              gBody.country.iso_code
            )}&limit=10`,
            {
              headers,
              json: true,
            },
            (sError, _sResponse, sBody) => {
              if (sError) {
                console.error({ error: sError.message });
                return res
                  .status(500)
                  .json({ error: 'Failed to fetch playlist' });
              }

              const idx = Math.floor(
                Math.random() * sBody.playlists.items.length
              );

              request.get(
                `${SpotifyController.baseUrl}/playlists/${encodeURIComponent(
                  sBody.playlists.items[idx].id
                )}`,
                {
                  headers,
                  json: true,
                },
                (error, _response, body) => {
                  if (error) {
                    console.error({ error: error.message });
                    return res
                      .status(500)
                      .json({ error: 'Failed to fetch data' });
                  }
                  return res.status(200).json(body.tracks.items);
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
}
