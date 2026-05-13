import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';

const demoUsers = [
  {
    username: 'guard01',
    password: 'guard123',
    role: 'Guard',
  },
  {
    username: 'admin01',
    password: 'admin123',
    role: 'Admin',
  },
];

const hashPassword = async (password: string) => {
  // Demo-only hash. Replace with stronger auth in Capstone 2.
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
};

export const seedDemoUsers = async (db: SQLite.SQLiteDatabase) => {
  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users'
  );
  if (existing?.count && existing.count > 0) return;

  for (const user of demoUsers) {
    const passwordHash = await hashPassword(user.password);
    await db.runAsync(
      'INSERT INTO users (username, password_hash, role, account_status) VALUES (?, ?, ?, ?)',
      [user.username, passwordHash, user.role, 'Active']
    );
  }
};
