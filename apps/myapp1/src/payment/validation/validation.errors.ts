import { ErrorObject } from 'ajv';

export class AjvValidationError extends Error {
  constructor(errors: ErrorObject[]) {
    const errorMessages: string[] = [];
    const requiredProperties: string[] = [];

    errors.forEach((err) => {
      switch (err.keyword) {
        case 'required':
          requiredProperties.push(err.params['missingProperty']);
          break;
        case 'type':
          errorMessages.push(
            `- Incorrect type for field ${err.instancePath}. Expected ${err.params['type']}, found ${typeof err.data}`,
          );
          break;
        case 'format':
          errorMessages.push(
            `- Incorrect format for field ${err.instancePath}. Expected ${
              err.params['format']
            }, found ${typeof err.data}`,
          );
          break;
        case 'const':
          if (err.instancePath === '/version') {
            errorMessages.push(
              `- Expected version default value of ${err.params['allowedValue']}, but found ${err.data}`,
            );
          }
          break;
        case 'enum':
          if (err.instancePath === '/type') {
            errorMessages.push(`- Unsupported message type: ${err.data}`);
          }
          break;
        default:
          errorMessages.push(`- Validation error on field ${err.instancePath}: ${err.message}`);
      }
    });

    if (requiredProperties.length > 0) {
      errorMessages.push(
        `- The following required fields were not present in the request: ${requiredProperties.join(', ')}`,
      );
    }

    const errorMessage = `Ajv validation failed with ${errors.length} error(s):\n${errorMessages.join('\n')}`;
    super(errorMessage);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, AjvValidationError.prototype);
  }
}

export class MissingValidationSchemaError extends Error {
  constructor(message: string) {
    // Call the superclass (Error) constructor
    super(message);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, MissingValidationSchemaError.prototype);
  }
}
