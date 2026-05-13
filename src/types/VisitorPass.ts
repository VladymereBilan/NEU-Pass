export type PassReturnStatus = 'Not Returned' | 'Returned';

export interface VisitorPass {
  passId: number;
  visitorId: number;
  visitorPassNumber: string;
  visitorPassQrValue: string;
  passReturnStatus: PassReturnStatus;
}
