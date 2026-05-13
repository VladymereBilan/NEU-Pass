import * as SQLite from 'expo-sqlite';
import { schemaSql } from './schema';
import { seedDemoUsers } from './seed';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDb = async () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('neu_pass.db');
  }
  return dbPromise;
};

export const initDatabase = async () => {
  const db = await getDb();
  await db.execAsync(schemaSql);
  try {
    await db.execAsync('ALTER TABLE users ADD COLUMN profile_image_uri TEXT');
  } catch (error) {
    // Column may already exist in existing installs.
  }
  await seedDemoUsers(db);
};

export const resetDatabase = async () => {
  const db = await getDb();
  await db.execAsync(`
    DROP TABLE IF EXISTS face_verifications;
    DROP TABLE IF EXISTS visitor_passes;
    DROP TABLE IF EXISTS visitor_images;
    DROP TABLE IF EXISTS visitor_logs;
    DROP TABLE IF EXISTS visitors;
    DROP TABLE IF EXISTS users;
  `);
  await db.execAsync(schemaSql);
  await seedDemoUsers(db);
};
