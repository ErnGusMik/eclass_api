import { Pool } from 'pg';

const pool = new Pool({
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export default pool;