import express from 'express';
import SpotifyController from '../controllers/SpotifyController';
import { verifyUserFromToken, verifySpotifyToken } from '../middlewares/auth';

const router = express.Router();

router.get(
  '/top-charts',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getTopCharts
);

router.get(
  '/artists/:id',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getArtist
);
router.get(
  '/top-artists/',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getTopArtists
);

router.get(
  '/tracks/:id',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getSong
);

router.get(
  '/track/search/:searchTerm',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.searchSongs
);

router.get(
  '/tracks/genres/:genre',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getSongsByGenre
);

router.get(
  '/tracks/related/:id',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getRelatedSongs
);

router.get(
  '/track/country',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getSongsByCountry
);

router.get(
  '/genres',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getGenres
);

export { router as spotifyRouter };
