import bcrypt from 'bcryptjs';
import { request } from 'express';
import dbClient from './db';
import redisClient from './redis';

export const getUserFromAuthHeaders = async (req) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return null;
    }
    const authParts = authorization.split(' ');

    if (authParts.length !== 2 || authParts[0] !== 'Basic') {
      return null;
    }
    const token = Buffer.from(authParts[1], 'base64').toString();
    const [email, password] = token.split(':', 2);
    const foundUser = await dbClient.getUserPassword(email);

    if (!bcrypt.compareSync(password, foundUser.password)) {
      return null;
    }
    const user = await dbClient.getUserByEmail(email);
    return user;
  } catch (err) {
    console.error({ error: err.stack });
  }
};

export const getUserFromTokenHeaders = async (req) => {
  const token = req.headers['x-token'];

  if (!token) {
    return null;
  }
  const userId = await redisClient.get(`auth_${token}`);

  if (!userId) {
    return null;
  }
  const user = await dbClient.getUserById(userId);

  return user || null;
};

export const getSpotifyToken = async () => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        new Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
    },
    json: true,
  };

  await request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      return access_token;
    }
    return null;
  });
};
