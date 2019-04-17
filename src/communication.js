function generateActionByStatus(status) {
  return (type, selector) => {
    const action = {
      type: `communication/${type}/${status}`,
      meta: { type, status },
    }

    if (selector) {
      action.meta.selector = selector
    }

    return action
  }
}

const cancel = generateActionByStatus('CANCEL')

const done = generateActionByStatus('DONE')

function fail(type, ...args) {
  let selector
  let error

  if (args.length > 1) {
    ;[selector, error] = args
  } else {
    ;[error] = args
  }

  const action = generateActionByStatus('FAIL')(type, selector)

  if (error) {
    action.payload = error
    action.error = true
  }

  return action
}

const starting = generateActionByStatus('STARTING')

function reducer(state = {}, action) {
  if (
    !action.type ||
    !action.type.startsWith('communication') ||
    !(action.meta && action.meta.status)
  ) {
    return state
  }

  const identifier = [action.meta.type]
  if (action.meta.selector) {
    identifier.push(action.meta.selector)
  }

  switch (action.meta.status) {
    case 'STARTING':
      return {
        ...state,
        [identifier.join(':')]: {
          status: action.meta.status,
        },
      }

    case 'DONE':
    case 'CANCEL': {
      const { [identifier.join(':')]: omit, ...newState } = state
      return newState
    }

    case 'FAIL':
      return {
        ...state,
        [identifier.join(':')]: {
          status: action.meta.status,
          error: action.payload,
        },
      }

    default:
      return state
  }
}

export default {
  cancel,
  done,
  fail,
  starting,
  reducer,
}
