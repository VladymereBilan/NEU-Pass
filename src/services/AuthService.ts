import * as Crypto from 'expo-crypto';
import { getDb } from '../database/db';
import { User } from '../types/User';

export const AuthService = {
  async login(username: string, password: string): Promise<User | null> {
    const db = await getDb();
    const user = await db.getFirstAsync<{
      user_id: number;
      username: string;
      password_hash: string;
      role: 'Guard' | 'Admin';
      account_status: 'Active' | 'Blocked';
      profile_image_uri?: string | null;
    }>('SELECT * FROM users WHERE username = ?', [username]);

    if (!user || user.account_status !== 'Active') return null;

    const passwordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    if (passwordHash !== user.password_hash) return null;

    return {
      userId: user.user_id,
      username: user.username,
      role: user.role,
      accountStatus: user.account_status,
      profileImageUri: user.profile_image_uri ?? null,
    };
  },

  async signUp(username: string, password: string): Promise<User | null> {
    const db = await getDb();
    const existing = await db.getFirstAsync<{ user_id: number }>(
      'SELECT user_id FROM users WHERE username = ?'
    , [username]);

    if (existing?.user_id) return null;

    const passwordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    const result = await db.runAsync(
      'INSERT INTO users (username, password_hash, role, account_status) VALUES (?, ?, ?, ?)',
      [username, passwordHash, 'Guard', 'Active']
    );

    const userId = result.lastInsertRowId ?? 0;

    return {
      userId,
      username,
      role: 'Guard',
      accountStatus: 'Active',
      profileImageUri: null,
    };
  },

  async updateProfileImage(userId: number, uri: string | null) {
    const db = await getDb();
    await db.runAsync('UPDATE users SET profile_image_uri = ? WHERE user_id = ?', [
      uri,
      userId,
    ]);
  },

  async listGuardAccounts() {
    const db = await getDb();
    return db.getAllAsync<{
      user_id: number;
      username: string;
      role: 'Guard' | 'Admin';
      account_status: 'Active' | 'Blocked';
    }>('SELECT * FROM users WHERE role = ?', ['Guard']);
  },

  async updateAccountStatus(userId: number, status: 'Active' | 'Blocked') {
    const db = await getDb();
    await db.runAsync('UPDATE users SET account_status = ? WHERE user_id = ?', [
      status,
      userId,
    ]);
  },

  async deleteAccount(userId: number) {
    const db = await getDb();
    await db.runAsync('DELETE FROM users WHERE user_id = ?', [userId]);
  },
};
