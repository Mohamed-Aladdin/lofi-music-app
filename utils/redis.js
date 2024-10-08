import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient({ db: 1 });
    this.connectionEstablished = true;
    this.client.on('error', (err) => {
      this.connectionEstablished = false;
      console.log(`Redis client failed to connect: ${err.message}`);
    });
    this.client.on('connect', () => {
      this.connectionEstablished = true;
    });
  }

  isAlive() {
    return this.connectionEstablished;
  }

  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  async set(key, value, duration) {
    return promisify(this.client.SET).bind(this.client)(
      key,
      value,
      'EX',
      duration
    );
  }

  async del(key) {
    return promisify(this.client.DEL).bind(this.client)(key);
  }

  async getAllKeyValues(value) {
    const asyncClientScan = promisify(this.client.scan).bind(this.client);
    const asyncClientGet = promisify(this.client.get).bind(this.client);
    const asyncClientType = promisify(this.client.type).bind(this.client);

    try {
      let cursor = '0';
      do {
        const reply = await asyncClientScan(cursor);
        cursor = reply[0];
        const keys = reply[1];

        for (const token of keys) {
          const type = await asyncClientType(token);

          if (type === 'string') {
            const userId = await asyncClientGet(token);

            if (userId === value) {
              return { id: userId, token: token.substring(5) };
            }
          } else {
            console.log(`${token}: [non-string value of type ${type}]`);
          }
        }
        return null;
      } while (cursor !== '0');
    } catch (err) {
      console.error({ error: err.stack });
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;
