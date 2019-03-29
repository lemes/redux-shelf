import { methods } from './constants'

export default function ids(state = [], action) {
  switch (action.meta.method) {
    case methods.REMOVE:
      if (state.includes(action.meta.selector)) {
        return state.filter((id) => id !== action.meta.selector)
      }
      return state

    case methods.UPDATE:
      return action.payload.ids.reduce((acc, id) => {
        if (acc.includes(id)) {
          return acc
        }
        return [...acc, id]
      }, state)

    case methods.SET:
      return action.payload.ids

    default:
      return state
  }
}
