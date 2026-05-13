import { getDb } from '../database/db';
import { QRService } from './QRService';
import { getNowIso, getTodayDate } from '../utils/date';

export interface RegisterVisitorInput {
  fullName: string;
  address: string;
  idType: string;
  idNumber: string;
  idImageUri?: string | null;
  purposeOfVisit: string;
  checkinFaceUri?: string | null;
}

export const VisitorService = {
  async getNextPassNumber() {
    const db = await getDb();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM visitor_passes'
    );
    return QRService.formatPassNumber((result?.count ?? 0) + 1);
  },

  async registerVisitor(input: RegisterVisitorInput) {
    const db = await getDb();
    const createdAt = getNowIso();

    const visitorResult = await db.runAsync(
      'INSERT INTO visitors (full_name, address, id_type, id_number, id_image_uri, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [
        input.fullName,
        input.address,
        input.idType,
        input.idNumber,
        input.idImageUri ?? null,
        createdAt,
      ]
    );

    const visitorId = visitorResult.lastInsertRowId ?? 0;
    const timeIn = getNowIso();
    const logDate = getTodayDate();

    const logResult = await db.runAsync(
      'INSERT INTO visitor_logs (visitor_id, purpose_of_visit, log_date, time_in, log_status, surrendered_id_status) VALUES (?, ?, ?, ?, ?, ?)',
      [visitorId, input.purposeOfVisit, logDate, timeIn, 'Active', 'Surrendered']
    );

    const logId = logResult.lastInsertRowId ?? 0;

    await db.runAsync(
      'INSERT INTO visitor_images (visitor_id, checkin_face_uri, checkout_face_uri) VALUES (?, ?, ?)',
      [visitorId, input.checkinFaceUri ?? null, null]
    );

    const passNumber = await this.getNextPassNumber();
    const qrValue = QRService.generateQrValue(passNumber, visitorId);

    await db.runAsync(
      'INSERT INTO visitor_passes (visitor_id, visitor_pass_number, visitor_pass_qr_value, pass_return_status) VALUES (?, ?, ?, ?)',
      [visitorId, passNumber, qrValue, 'Not Returned']
    );

    await db.runAsync(
      'INSERT INTO face_verifications (visitor_id, log_id, face_verification_status, verification_notes, verified_at) VALUES (?, ?, ?, ?, ?)',
      [visitorId, logId, 'Pending', 'Check-in only', null]
    );

    return { visitorId, logId, passNumber, qrValue, timeIn };
  },

  async listActiveLogs() {
    const db = await getDb();
    return db.getAllAsync(
      `SELECT l.log_id as logId, v.visitor_id as visitorId, v.full_name as fullName,
        v.address as address, v.id_number as idNumber, l.purpose_of_visit as purposeOfVisit,
        l.time_in as timeIn, l.log_status as logStatus, l.surrendered_id_status as surrenderedIdStatus,
        p.visitor_pass_number as passNumber
      FROM visitor_logs l
      JOIN visitors v ON v.visitor_id = l.visitor_id
      LEFT JOIN visitor_passes p ON p.visitor_id = v.visitor_id
      WHERE l.log_status = 'Active'
      ORDER BY l.time_in DESC`
    );
  },

  async listCompletedLogs() {
    const db = await getDb();
    return db.getAllAsync(
      `SELECT l.log_id as logId, v.visitor_id as visitorId, v.full_name as fullName,
        l.purpose_of_visit as purposeOfVisit, l.time_in as timeIn, l.time_out as timeOut,
        l.log_status as logStatus, l.surrendered_id_status as surrenderedIdStatus,
        p.visitor_pass_number as passNumber
      FROM visitor_logs l
      JOIN visitors v ON v.visitor_id = l.visitor_id
      LEFT JOIN visitor_passes p ON p.visitor_id = v.visitor_id
      WHERE l.log_status = 'Completed'
      ORDER BY l.time_out DESC`
    );
  },

  async searchActiveByName(query: string) {
    const db = await getDb();
    return db.getAllAsync(
      `SELECT l.log_id as logId, v.visitor_id as visitorId, v.full_name as fullName,
        v.address as address, v.id_number as idNumber, l.purpose_of_visit as purposeOfVisit,
        l.time_in as timeIn, l.log_status as logStatus, l.surrendered_id_status as surrenderedIdStatus,
        p.visitor_pass_number as passNumber
      FROM visitor_logs l
      JOIN visitors v ON v.visitor_id = l.visitor_id
      LEFT JOIN visitor_passes p ON p.visitor_id = v.visitor_id
      WHERE l.log_status = 'Active' AND v.full_name LIKE ?
      ORDER BY l.time_in DESC`,
      [`%${query}%`]
    );
  },

  async getActiveByQrValue(qrValue: string) {
    const db = await getDb();
    return db.getFirstAsync(
      `SELECT l.log_id as logId, v.visitor_id as visitorId, v.full_name as fullName,
        v.address as address, v.id_type as idType, v.id_number as idNumber,
        l.purpose_of_visit as purposeOfVisit, l.time_in as timeIn,
        p.visitor_pass_number as passNumber, p.visitor_pass_qr_value as qrValue,
        i.checkin_face_uri as checkinFaceUri
      FROM visitor_logs l
      JOIN visitors v ON v.visitor_id = l.visitor_id
      LEFT JOIN visitor_passes p ON p.visitor_id = v.visitor_id
      LEFT JOIN visitor_images i ON i.visitor_id = v.visitor_id
      WHERE l.log_status = 'Active' AND p.visitor_pass_qr_value = ?`,
      [qrValue]
    );
  },

  async getLogDetails(logId: number) {
    const db = await getDb();
    return db.getFirstAsync(
      `SELECT l.log_id as logId, v.visitor_id as visitorId, v.full_name as fullName,
        v.address as address, v.id_type as idType, v.id_number as idNumber,
        v.id_image_uri as idImageUri, l.purpose_of_visit as purposeOfVisit,
        l.time_in as timeIn, l.time_out as timeOut, l.log_status as logStatus,
        l.surrendered_id_status as surrenderedIdStatus, p.visitor_pass_number as passNumber,
        p.visitor_pass_qr_value as qrValue, p.pass_return_status as passReturnStatus,
        i.checkin_face_uri as checkinFaceUri, i.checkout_face_uri as checkoutFaceUri,
        f.face_verification_status as faceVerificationStatus
      FROM visitor_logs l
      JOIN visitors v ON v.visitor_id = l.visitor_id
      LEFT JOIN visitor_passes p ON p.visitor_id = v.visitor_id
      LEFT JOIN visitor_images i ON i.visitor_id = v.visitor_id
      LEFT JOIN face_verifications f ON f.log_id = l.log_id
      WHERE l.log_id = ?`,
      [logId]
    );
  },

  async completeCheckout(params: {
    logId: number;
    visitorId: number;
    checkoutFaceUri?: string | null;
    faceVerificationStatus: string;
    checkoutMethod: string;
    verificationNotes?: string | null;
  }) {
    const db = await getDb();
    const timeOut = getNowIso();

    await db.runAsync(
      'UPDATE visitor_logs SET time_out = ?, log_status = ?, surrendered_id_status = ?, checkout_method = ? WHERE log_id = ?',
      [timeOut, 'Completed', 'Returned', params.checkoutMethod, params.logId]
    );

    await db.runAsync(
      'UPDATE visitor_passes SET pass_return_status = ? WHERE visitor_id = ?',
      ['Returned', params.visitorId]
    );

    await db.runAsync(
      'UPDATE visitor_images SET checkout_face_uri = ? WHERE visitor_id = ?',
      [params.checkoutFaceUri ?? null, params.visitorId]
    );

    await db.runAsync(
      'UPDATE face_verifications SET face_verification_status = ?, verification_notes = ?, verified_at = ? WHERE log_id = ?',
      [params.faceVerificationStatus, params.verificationNotes ?? null, timeOut, params.logId]
    );

    return timeOut;
  },
};
