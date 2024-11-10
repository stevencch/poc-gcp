import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';



export default registerAs('deadLetter', () => {
  const deadLetterConfig = {
    deadLetterTopic: process.env['DEAD_LETTER_TOPIC']??"",
  };

  return deadLetterConfig;
});
