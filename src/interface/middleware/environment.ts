import dotenv from 'dotenv';
import path from 'path';

// Load the appropriate .env file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Fallback to .env if the environment-specific file doesn't exist
if (!process.env.PORT) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

export const environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  exchangeRateApiUrl: process.env.EXCHANGE_RATE_API_URL || '',
  exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY || '',
  usdApiUrl: process.env.USD_API_URL || '',
  dbType: process.env.DB_TYPE || '',
  // Helper method to validate all required environment variables are set
  validate() {
    const required = [
      'PORT',
      'DATABASE_URL',
      'JWT_ACCESS_SECRET',
      'JWT_REFRESH_SECRET',
      'GEMINI_API_KEY',
      'DB_TYPE',
      'EXCHANGE_RATE_API_URL',
      'EXCHANGE_RATE_API_KEY',
      'USD_API_URL',
    ];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }
  },
};

// Validate environment variables when importing this file
environment.validate();
