export type LogStatus = 'Active' | 'Completed';
export type SurrenderedIdStatus = 'Surrendered' | 'Returned';

export interface VisitorLog {
  logId: number;
  visitorId: number;
  fullName: string;
  purposeOfVisit: string;
  logDate: string;
  timeIn: string;
  timeOut?: string | null;
  logStatus: LogStatus;
  surrenderedIdStatus: SurrenderedIdStatus;
  passNumber?: string | null;
}
