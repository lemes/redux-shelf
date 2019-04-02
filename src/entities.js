import { normalize } from 'normalizr'

import { methods } from './constants'

export const generateActionType = (operation, resourceType, resourceId) =>
  `entities/${operation}/${resourceType.toUpperCase()}${
    resourceId ? `:${resourceId}` : ''
  }`

/**
 * Returns an action that represents the addition of one or more entities on
 * state. Expects a `normalizr`'s schema as the second argument, wich will
 * be used payload on third argument normalization.
 *
 * @param {string} resourceType - Resouce type name.
 * @param {object} schema - Entity's schema.
 * @param {object|object[]} payload - Payload to be stored on state.
 */
function set(resourceType, schema, payload) {
  return {
    type: generateActionType(methods.SET, resourceType),
    meta: {
      resourceType,
      method: methods.SET,
    },
    payload: normalize(payload, schema).entities,
  }
}

function update(resourceType, resourceId, payload) {
  return {
    type: generateActionType(methods.UPDATE, resourceType, resourceId),
    meta: {
      method: methods.UPDATE,
      resourceType,
      resourceId,
    },
    payload: normalize(payload).entities,
  }
}

function remove(resourceType, resourceId) {
  return {
    type: generateActionType(methods.REMOVE),
    meta: {
      method: methods.REMOVE,
      resourceType,
      resourceId,
    },
  }
}

function reducer(state = {}, { type, meta, payload }) {
  if (!type.startsWith('entities') || !(meta && meta.resourceType)) {
    return state
  }

  switch (meta.method) {
    case methods.SET:
      return Object.keys(payload).reduce(
        (res, entity) => ({
          ...res,
          [entity]: payload[entity],
        }),
        state,
      )
    case methods.UPDATE:
    case methods.REMOVE:
    default:
      return state
  }
}

export default {
  set,
  update,
  remove,
  reducer,
}
