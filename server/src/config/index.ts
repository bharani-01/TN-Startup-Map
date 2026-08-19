import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'tn_startup_map_enterprise_jwt_secret_key_2026_super_secure',
  jwtExpiresIn: '7d',
  bcryptRounds: 10,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tnstartupmap',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 1000, // requests per window
  },
};
