import { methods } from './constants';
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
      selector: `${selector}`,
      method: methods.REMOVE,
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

  const currentCotent = state[action.meta.type];
  const newContent = content(currentCotent, action);

  if (currentCotent === newContent) {
    return state;
  }

  return {
    ...state,
    [action.meta.type]: {
      content: newContent,
    },
  };
}
