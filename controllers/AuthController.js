import { v4 } from 'uuid';
import redisClient from '../utils/redis';

export default class AuthController {
  static async login(req, res) {
    try {
      const { user } = req;
      const token = v4();

      await redisClient.set(`auth_${token}`, user._id.toString(), 60 * 60 * 24);
      return res.status(200).json({ token });
    } catch (err) {
      console.error({ error: err });
    }
  }

  static async logout(req, res) {
    try {
      const token = req.headers['x-token'];
      await redisClient.del(`auth_${token}`);
      return res.status(204).send();
    } catch (err) {}
  }
}