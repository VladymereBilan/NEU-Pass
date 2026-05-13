export type FaceVerificationStatus = 'Matched' | 'Not Matched' | 'Manual Review' | 'Pending';

export const FaceVerificationService = {
  async compareFaces(
    _checkinUri: string,
    _checkoutUri: string,
    manualStatus: FaceVerificationStatus
  ) {
    // Capstone 2: integrate real facial recognition comparison.
    return {
      status: manualStatus,
      notes: 'Prototype manual verification used.',
    };
  },
};
