import { Pool } from 'pg';

import type { NextApiRequest, NextApiResponse } from 'next';

const connectionString = process.env.POSTGRES_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const queueMetrics = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await pool.connect();
    const queryResult = await client.query('select * from queue_monitoring');
    res.status(200).json(queryResult.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export default queueMetrics;
