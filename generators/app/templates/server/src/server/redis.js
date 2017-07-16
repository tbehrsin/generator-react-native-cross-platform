
import { createClient } from 'redis';

export const redis = () => createClient(process.env.REDIS_URI);
