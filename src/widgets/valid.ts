import * as jsonschema from 'jsonschema';
import { Schema } from 'jsonschema';

export interface ValidResult {
  result: boolean;
  msg: string;
}

export const jsonschemaValid = <T>(
  instance: T,
  schema: Schema
): ValidResult => {
  const validatorResult = jsonschema.validate(instance, schema);
  const validatorResultErr = validatorResult.errors;
  let result = {
    result: true,
    msg: ''
  };

  if (validatorResultErr.length) {
    result = {
      result: false,
      msg: `\n${  validatorResultErr.map((item) => item.stack).join('\n')}`
    };
  }

  return result;
};

export const optionsSchema: Schema = {
  type: 'object',
  properties: {
    host: {
      type: 'string'
    },
    port: {
      type: 'integer'
    },
    user: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    files: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    destRootPath: {
      type: 'string'
    },
    rootPath: {
      type: 'string'
    }
  },
  required: ['host', 'port', 'user', 'password', 'files', 'destRootPath']
};
