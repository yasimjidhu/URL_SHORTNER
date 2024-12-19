import { createClient, RedisClientType } from 'redis';
import { ICacheService } from "../../application/interfaces/ICacheService";

export class RedisCache implements ICacheService {
    private client: RedisClientType;

    constructor() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        this.client = createClient({ url: redisUrl });
        
        this.client.connect().then(() => console.log('Redis client connected'));
    }

    async get(key: string): Promise<string | null> {
        const value = await this.client.get(key);
        return value;
    }

    async set(key: string, value: string, ttl: number): Promise<void> {
        await this.client.setEx(key, ttl, value);
    }
}
