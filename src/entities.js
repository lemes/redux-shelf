import { entries } from './utils';

const methods = {
  REMOVE: 'REMOVE',
  SET: 'SET',
  UPDATE: 'UPDATE',
};

function generateActionType(type, method) {
  return `entities/${type}/${method}`;
}

function generateActionByMethod(method) {
  return (type, payload) => ({
    type: generateActionType(type, method),
    meta: { method },
    payload,
  });
}

export function remove(type, selector) {
  return {
    type: generateActionType(type, methods.REMOVE),
    meta: {
      selector: `${selector}`,
      method: methods.REMOVE,
      type,
    },
  };
}

export const set = generateActionByMethod(methods.SET);

export const update = generateActionByMethod(methods.UPDATE);

export default function entities(state = {}, action) {
  if (!action.type.startsWith('entities')) {
    return state;
  }

  switch (action.meta.method) {
    case methods.REMOVE: {
      const entity = state[action.meta.type];

      if (!entity[action.meta.selector]) {
        return state;
      }

      const { [action.meta.selector]: omit, ...rest } = entity;
      return {
        ...state,
        [action.meta.type]: rest,
      };
    }

    case methods.SET:
      return {
        ...state,
        ...action.payload,
      };

    case methods.UPDATE:
      return entries(action.payload).reduce(
        (acc, [key, entity]) => ({
          ...acc,
          [key]: {
            ...acc[key],
            ...entity,
          },
        }),
        state,
      );

    default:
      return state;
  }
}
