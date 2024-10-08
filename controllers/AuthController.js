import { v4 } from 'uuid';
import redisClient from '../utils/redis';

export default class AuthController {
  static async login(req, res) {
    try {
      const { user } = req;
      const userLoggedIn = await redisClient.getAllKeyValues(user._id.toString());
      
      if (userLoggedIn) {
        return res.status(200).json(userLoggedIn);
      }
      const token = v4();

      await redisClient.set(`auth_${token}`, user._id.toString(), 60 * 60 * 24);
      console.log(await redisClient.get(`auth_${token}`));
      
      return res.status(200).json({ id: user._id, token });
    } catch (err) {
      console.error({ error: err.message });
    }
  }

  static async logout(req, res) {
    try {
      const token = req.headers['x-token'];
      await redisClient.del(`auth_${token}`);
      return res.status(204).send();
    } catch (err) {
      console.error({ error: err.message });
    }
  }
}
