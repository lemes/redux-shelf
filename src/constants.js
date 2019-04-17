export const methods = {
  REMOVE: 'REMOVE',
  SET: 'SET',
  UPDATE: 'UPDATE',
}

export const errorMessages = {
  invalidResourceType:
    'Resource type is a required information. It should a non empty string.',
  invalidNormalizrSchema: 'A valid normalizr schema should be provided.',
}

export default {
  methods,
  errorMessages,
}
