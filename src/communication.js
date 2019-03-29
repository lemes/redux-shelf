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

export const cancel = generateActionByStatus('CANCEL')

export const done = generateActionByStatus('DONE')

export function fail(type, ...args) {
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

export const starting = generateActionByStatus('STARTING')

function of(type, selector) {
  const identifier = [type]
  if (selector) {
    identifier.push(selector)
  }

  const state = this[identifier.join(':')] || {}

  return {
    loading: state.status === 'STARTING',
    error: state.error,
  }
}

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

export default function communication(state, action) {
  const newState = reducer(state, action)
  newState.of = of

  return newState
}

communication.cancel = cancel
communication.done = done
communication.fail = fail
communication.starting = starting
