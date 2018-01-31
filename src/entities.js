import { methods } from './constants';
import ids from './ids';
import content from './content';

function generateActionType(type, method) {
  return `entities/${type}/${method}`;
}

function generateActionByMethod(method) {
  return (type, payload) => ({
    type: generateActionType(type, method),
    meta: { method, type },
    payload,
  });
}

export function remove(type, selector) {
  return {
    type: generateActionType(type, methods.REMOVE),
    meta: {
      method: methods.REMOVE,
      selector,
      type,
    },
  };
}

export const set = generateActionByMethod(methods.SET);

export const update = generateActionByMethod(methods.UPDATE);

export default function entities(state = {}, action) {
  if (
    !action.type.startsWith('entities') ||
    !(action.meta && action.meta.type)
  ) {
    return state;
  }

  const entity = state[action.meta.type] || {};
  const newIds = ids(entity.ids, action);
  const newContent = content(entity.content, action);

  if (entity.content === newContent) {
    return state;
  }

  return {
    ...state,
    [action.meta.type]: {
      ids: newIds,
      content: newContent,
    },
  };
}
