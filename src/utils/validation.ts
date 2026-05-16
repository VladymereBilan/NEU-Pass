export const isRequiredFilled = (value: string | null | undefined) => {
  return !!value && value.trim().length > 0;
};

export const validateVisitorForm = (fields: {
  fullName: string;
  address: string;
  idType: string;
  idNumber: string;
  purposeOfVisit: string;
}) => {
  const missing: string[] = [];
  if (!isRequiredFilled(fields.fullName)) missing.push('Full name');
  if (!isRequiredFilled(fields.address)) missing.push('Address');
  if (!isRequiredFilled(fields.idType)) missing.push('ID type');
  if (!isRequiredFilled(fields.idNumber)) missing.push('ID number');
  if (!isRequiredFilled(fields.purposeOfVisit)) missing.push('Purpose of visit');
  return missing;
};

export const validateSignUp = (fields: {
  username: string;
  password: string;
  confirmPassword: string;
}) => {
  const missing: string[] = [];
  if (!isRequiredFilled(fields.username)) missing.push('Username');
  if (!isRequiredFilled(fields.password)) missing.push('Password');
  if (!isRequiredFilled(fields.confirmPassword)) missing.push('Confirm password');
  if (fields.password && fields.confirmPassword && fields.password !== fields.confirmPassword) {
    missing.push('Password mismatch');
  }
  return missing;
};
