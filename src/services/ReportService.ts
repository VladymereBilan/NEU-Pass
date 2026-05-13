import { getDb } from '../database/db';

export const ReportService = {
  async getCountsByStatus() {
    const db = await getDb();
    const rows = await db.getAllAsync<{ log_status: string; count: number }>(
      'SELECT log_status, COUNT(*) as count FROM visitor_logs GROUP BY log_status'
    );
    return rows;
  },

  async getDailyLogs(date: string) {
    const db = await getDb();
    return db.getAllAsync(
      `SELECT l.log_id as logId, v.full_name as fullName, l.purpose_of_visit as purposeOfVisit,
        l.time_in as timeIn, l.time_out as timeOut, l.log_status as logStatus
      FROM visitor_logs l
      JOIN visitors v ON v.visitor_id = l.visitor_id
      WHERE l.log_date = ?
      ORDER BY l.time_in DESC`,
      [date]
    );
  },

  async getMonthlyLogs(monthKey: string) {
    const db = await getDb();
    return db.getAllAsync(
      `SELECT l.log_id as logId, v.full_name as fullName, l.purpose_of_visit as purposeOfVisit,
        l.time_in as timeIn, l.time_out as timeOut, l.log_status as logStatus
      FROM visitor_logs l
      JOIN visitors v ON v.visitor_id = l.visitor_id
      WHERE l.log_date LIKE ?
      ORDER BY l.time_in DESC`,
      [`${monthKey}%`]
    );
  },

  async searchLogs(filters: {
    name?: string;
    status?: string;
    purpose?: string;
    date?: string;
    month?: string;
  }) {
    const db = await getDb();
    const clauses: string[] = [];
    const params: string[] = [];

    if (filters.name) {
      clauses.push('v.full_name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    if (filters.status) {
      clauses.push('l.log_status = ?');
      params.push(filters.status);
    }
    if (filters.purpose) {
      clauses.push('l.purpose_of_visit LIKE ?');
      params.push(`%${filters.purpose}%`);
    }
    if (filters.date) {
      clauses.push('l.log_date = ?');
      params.push(filters.date);
    }
    if (filters.month) {
      clauses.push('l.log_date LIKE ?');
      params.push(`${filters.month}%`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

    return db.getAllAsync(
      `SELECT l.log_id as logId, v.full_name as fullName, l.purpose_of_visit as purposeOfVisit,
        l.time_in as timeIn, l.time_out as timeOut, l.log_status as logStatus
      FROM visitor_logs l
      JOIN visitors v ON v.visitor_id = l.visitor_id
      ${where}
      ORDER BY l.time_in DESC`,
      params
    );
  },
};
