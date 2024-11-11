import { registerAs } from '@nestjs/config';

export default registerAs('firestore', () => {
  const firestoreConfig = {
    projectId: process.env['PROJECT_ID'],
    databaseId: process.env['DATABASE_ID'],
    expiryDuration:
      (Number(process.env['EXPIRY_DURATION_DAYS']) || 30) * 24 * 60 * 60 * 1000,
  };

  return firestoreConfig;
});
