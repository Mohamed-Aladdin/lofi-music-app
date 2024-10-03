import bcrypt from 'bcryptjs';
import dbClient from './db';
import redisClient from './redis';

export const getUserFromAuthHeaders = async (req) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }
  const authParts = authorization.split(' ');

  if (authParts.length !== 2 || authParts[0] !== 'Basic') {
    return null;
  }
  const token = Buffer.from(authParts[1], 'base64').toString();
  const [email, password] = token.split(':', 1);
  const user = await dbClient.getUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return null;
  }
  return user;
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
