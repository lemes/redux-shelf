function generateActionByStatus(status) {
  return (type, selector, error) => {
    const action = {
      type: `communication/${type}/${status}`,
      meta: { type, selector, status },
    };

    if (error) {
      action.payload = error;
      action.error = true;
    }

    return action;
  };
}

export const canceled = generateActionByStatus('CANCELED');
export const failed = generateActionByStatus('FAILED');
export const starting = generateActionByStatus('STARTING');
export const success = generateActionByStatus('SUCCESS');

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
