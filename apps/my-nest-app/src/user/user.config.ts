import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';

type UserConfig = {
  topicName: string;
  projectId: string;
  locationId: string;
  taskQueueName: string;
  serviceAccountEmail: string;
};

export default registerAs('user', () => {
  const userConfig = {
    topicName: process.env['PAYMENT_NOTIFICATION_TOPIC'],
    projectId: process.env['PROJECT_ID'],
    locationId: process.env['LOCATION_ID'],
    taskQueueName: process.env['TASK_QUEUE_NAME'],
    serviceAccountEmail: process.env['SERVICE_ACCOUNT_EMAIL'],
  };

  return userConfig;
});
