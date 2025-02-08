import 'dotenv/config';

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DATABASE_FILE } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DATABASE_FILE) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DATABASE_FILE,
};