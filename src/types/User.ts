export type UserRole = 'Guard' | 'Admin';

export type AccountStatus = 'Active' | 'Blocked';

export interface User {
  userId: number;
  username: string;
  role: UserRole;
  accountStatus: AccountStatus;
  profileImageUri?: string | null;
}
