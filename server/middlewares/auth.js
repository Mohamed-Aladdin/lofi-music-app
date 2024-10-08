import { getUserFromAuthHeaders, getUserFromTokenHeaders } from '../utils/auth';

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
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
};
