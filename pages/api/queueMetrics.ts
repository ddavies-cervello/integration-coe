import { Pool } from "pg";

import type { NextApiRequest, NextApiResponse } from "next";

const connectionString =
  "postgres://twiybijzrhvymx:fc86e0e0d312d7d033a52f6d8fbbbca2ceab57b61044712838ab6f6cce97cd74@ec2-54-225-18-166.compute-1.amazonaws.com:5432/d2nbpuapbdkpmo";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const queueMetrics = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await pool.connect();
    const queryResult = await client.query("select * from queue_monitoring");
    res.status(200).json(queryResult.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export default queueMetrics;
