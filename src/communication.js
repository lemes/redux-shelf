function generateActionByStatus(status) {
  return (type, selector) => {
    const action = {
      type: `communication/${type}/${status}`,
      meta: { type, status },
    };

    if (selector) {
      action.meta.selector = selector;
    }

    return action;
  };
}

export const cancel = generateActionByStatus('CANCEL');

export const done = generateActionByStatus('DONE');

export function fail(type, ...args) {
  let selector;
  let error;

  if (args.length > 1) {
    [selector, error] = args;
  } else {
    [error] = args;
  }

  const action = generateActionByStatus('FAIL')(type, selector);

  if (error) {
    action.payload = error;
    action.error = true;
  }

  return action;
}

export const starting = generateActionByStatus('STARTING');

export default function communication(state = {}, action) {
  if (!action.type.startsWith('communication')) {
    return state;
  }

  const selector = [action.meta.type];
  if (action.meta.selector) {
    selector.push(action.meta.selector);
  }

  const newState = {
    status: action.meta.status,
  };

  if (action.error) {
    newState.error = action.payload;
  }

  return {
    ...state,
    [selector.join(':')]: newState,
  };
}
