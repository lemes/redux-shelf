import { methods } from './constants'

export default function content(state = {}, action) {
  switch (action.meta.method) {
    case methods.REMOVE: {
      if (!state[action.meta.selector]) {
        return state
      }

      const { [`${action.meta.selector}`]: omit, ...newState } = state
      return newState
    }

    case methods.SET:
      return action.payload.content

    case methods.UPDATE:
      return {
        ...state,
        ...action.payload.content,
      }

    default:
      return state
  }
}
