import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRouter';
import { usersRouter } from './routes/usersRouter';
import { playlistsRouter } from './routes/playlistsRouter';
import { songsRouter } from './routes/songsRouter';
import { spotifyRouter } from './routes/spotifyRouter';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '200mb' }));

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/playlists', playlistsRouter);
app.use('/songs', songsRouter);
app.use('/stats', spotifyRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`${process.env.NODE_ENV} server started on port ${PORT}.`)
);
