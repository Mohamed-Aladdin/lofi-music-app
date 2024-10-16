import bcrypt from 'bcryptjs';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class UsersController {
  static async register(req, res) {
    try {
      const { name, username, email, password } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Missing name!' });
      }
      if (!username) {
        return res.status(400).json({ error: 'Missing username!' });
      }
      if (!email) {
        return res.status(400).json({ error: 'Missing email!' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password!' });
      }
      const foundUser = await dbClient.getUserByEmail(email);

      if (foundUser) {
        return res.status(400).json({ error: 'Already exist' });
      }
      const salt = parseInt(process.env.SALT, 10);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = { ...req.body, password: hash };

      const user = await dbClient.createUser(newUser);
      return res.status(201).json({ id: user._id, email });
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async getMe(req, res) {
    try {
      const { user } = req;
      delete user.password;
      return res.status(200).json(user);
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { user } = req;
      const checkUser = await dbClient.getUserPassword(user.email);

      if (!bcrypt.compareSync(req.body.currentPassword, checkUser.password)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const salt = parseInt(process.env.SALT, 10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      await dbClient.updateUserPass(user._id, hash);
      return res.status(200).send();
    } catch (err) {
      console.error({ error: err.stack });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const { user } = req;

      await dbClient.deleteUser(user._id);
      await redisClient.del(`auth_${req.headers['x-token']}`);
      return res.status(204).send();
    } catch (err) {
      console.error({ error: err.stack });
    }
  }
}
