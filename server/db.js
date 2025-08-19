// server/db.js
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// server/middlewares/fakeAuth.js
export function fakeAuth(req, res, next) {
  // 나중에 JWT로 바꾸면 여기만 고치면 됩니다.
  req.user = { id: 1 };
  next();
}

//  default export
export default pool;
