export interface Visitor {
  visitorId: number;
  fullName: string;
  address: string;
  idType: string;
  idNumber: string;
  idImageUri?: string | null;
  createdAt: string;
}
