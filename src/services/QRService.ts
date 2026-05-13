export const QRService = {
  formatPassNumber: (count: number) => `VP-${String(count).padStart(3, '0')}`,
  generateQrValue: (passNumber: string, visitorId: number) =>
    `NEU-PASS:${passNumber}:${visitorId}`,
};
