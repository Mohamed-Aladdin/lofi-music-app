import {
  getUserFromAuthHeaders,
  getUserFromTokenHeaders,
  getSpotifyToken,
} from '../utils/auth';

export const verifyUserFromAuth = async (req, res, next) => {
  const user = await getUserFromAuthHeaders(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
};

export const verifyUserFromToken = async (req, res, next) => {
  const user = await getUserFromTokenHeaders(req);

  if (!user) {
    return res.status(401).json({ error: 'Token Unauthorized' });
  }
  req.user = user;
  next();
};

export const verifySpotifyToken = async (req, res, next) => {
  const token = await getSpotifyToken();

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.token = `Bearer ${token}`;
  next();
};
