export interface OcrResult {
  fullName: string;
  address: string;
  idType: string;
  idNumber: string;
  mode: 'prototype' | 'real';
}

const sampleProfiles = [
  {
    fullName: 'Juan Dela Cruz',
    address: 'Quezon City, Metro Manila',
    idType: 'Driver License',
    idNumber: 'N01-23-456789',
  },
  {
    fullName: 'Maria Santos',
    address: 'Caloocan City',
    idType: 'Postal ID',
    idNumber: 'P-2025-00931',
  },
];

export const OCRService = {
  async realOCRMode(_idImageUri: string): Promise<OcrResult> {
    // Capstone 2: integrate real OCR provider or on-device SDK.
    return {
      fullName: '',
      address: '',
      idType: '',
      idNumber: '',
      mode: 'real',
    };
  },

  async prototypeOCRMode(_idImageUri: string): Promise<OcrResult> {
    const sample = sampleProfiles[Math.floor(Math.random() * sampleProfiles.length)];
    return {
      ...sample,
      mode: 'prototype',
    };
  },

  async extract(idImageUri: string, useReal = false): Promise<OcrResult> {
    if (useReal) {
      return this.realOCRMode(idImageUri);
    }
    return this.prototypeOCRMode(idImageUri);
  },
};
