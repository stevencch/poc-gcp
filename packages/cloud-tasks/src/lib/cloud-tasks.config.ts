import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';

export default registerAs('cloudTasks', () => {
  const config = {
    projectId: process.env['PROJECT_ID']??"",
    locationId: process.env['LOCATION_ID']??"",
    serviceAccountEmail: process.env['SERVICE_ACCOUNT_EMAIL']??"",
  };



  return config;
});
