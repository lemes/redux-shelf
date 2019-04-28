import { normalize, schema } from 'normalizr'
import has from 'lodash.has'
import pick from 'lodash.pick'
import isString from 'lodash.isstring'

import { methods, errorMessages } from './constants'

/**
 *
 * @param {string} operation - Operation that the action describes (SET, UPDATE or REMOVE).
 * @param {string} resourceType - Resource type name. Requires a non empty string.
 * @param {string} resourceId  - Resource identifier. Should be provided when the opertion
 * is under an specific entity.
 */
export const generateActionType = (operation, resourceType, resourceId) => {
  if (!isString(resourceType) || resourceType === '') {
    throw new Error(errorMessages.invalidResourceType)
  }

  return `entities/${operation}/${resourceType.toUpperCase()}${
    resourceId ? `:${resourceId}` : ''
  }`
}

/**
 * Returns an action that represents the addition of one or more entities on
 * state. Expects a `normalizr`'s schema as the second argument, wich will
 * be used payload on third argument normalization.
 *
 * @param {string} resourceType - Resouce type name.
 * @param {object} schm - Entity's schema. Should be a normalizr entity schema object.
 * @param {object|object[]} payload - Payload to be stored on state.
 */
function set(resourceType, schm, payload) {
  // validate provided schema
  if (!(schm instanceof schema.Entity)) {
    throw new Error(errorMessages.invalidNormalizrSchema)
  }

  return {
    type: generateActionType(methods.SET, resourceType),
    meta: {
      resourceType,
      method: methods.SET,
    },
    payload: normalize(payload, schm).entities,
  }
}

/**
 * Returns an action that represents the updating of one specific entity.
 *
 * @param {string} resourceType - Resouce type name.
 * @param {string} resourceId - Resource identifier.
 * @param {object|object[]} payload - Data to be used on update operation.
 */
function update(resourceType, resourceId, payload) {
  return {
    type: generateActionType(methods.UPDATE, resourceType, resourceId),
    meta: {
      method: methods.UPDATE,
      resourceType,
      resourceId,
    },
    payload,
  }
}

/**
 * Returns an action that represents the updating of one specific entity.
 *
 * @param {string} resourceType - Resouce type name.
 * @param {string} resourceId - Resource identifier.
 * @param {object|object[]} payload - Data to be used on update operation.
 */
function remove(resourceType, resourceId) {
  return {
    type: generateActionType(methods.REMOVE, resourceType, resourceId),
    meta: {
      method: methods.REMOVE,
      resourceType,
      resourceId,
    },
  }
}

/**
 * Entity reducer. Implements handlers logic for entities operations: set, update
 * and remove.
 *
 * @param {string} state - Current application state.
 * @param {object} action - Action that informs wich operation should be realized.
 */
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
      return has(state, `${meta.resourceType}.${meta.resourceId}`)
        ? {
            ...state,
            [meta.resourceType]: {
              ...state[meta.resourceType],
              [meta.resourceId]: payload,
            },
          }
        : state
    case methods.REMOVE:
      if (has(state, `${meta.resourceType}.${meta.resourceId}`)) {
        // should remove all resourceType node from state
        if (Object.keys(state[meta.resourceType]).length === 1) {
          return pick(
            state,
            Object.keys(state).filter(
              (resourceType) => resourceType !== meta.resourceType,
            ),
          )
        }

        return {
          ...state,
          [meta.resourceType]: pick(
            state[meta.resourceType],
            Object.keys(state[meta.resourceType]).filter(
              (resourceId) => resourceId !== meta.resourceId,
            ),
          ),
        }
      }

      return state
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
