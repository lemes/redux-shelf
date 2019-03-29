import content from '../src/content'
import * as actions from '../src/entities'

describe('content', () => {
  let action
  let currentState
  let payload
  let state

  beforeEach(() => {
    currentState = {
      2: { name: 'Lisa Silva' },
      3: { name: 'Marcus Paiva' },
    }
    payload = {
      content: {
        1: { name: 'Joe Bars' },
        2: { name: 'Lisa Lemes' },
      },
    }
  })

  describe('when deleting a content', () => {
    let userIdDeleted

    beforeEach(() => {
      userIdDeleted = 2
      action = actions.remove('users', userIdDeleted)
      state = content(currentState, action)
    })

    it('should remove content', () => {
      const { [`${userIdDeleted}`]: omit, ...rest } = currentState
      expect(state).toEqual(rest)
    })

    describe('given a not found selector', () => {
      it('should return keep state unchanged', () => {
        expect(
          content(currentState, actions.remove('users', 'not-found-user')),
        ).toBe(currentState)
      })
    })
  })

  describe('when setting a content', () => {
    beforeEach(() => {
      action = actions.set('users', payload)
      state = content(currentState, action)
    })

    it('should replace current state', () => {
      expect(state).toBe(payload.content)
      expect(state).not.toBeUndefined()
    })
  })

  describe('when updating a content', () => {
    beforeEach(() => {
      action = actions.update('users', payload)
      state = content(currentState, action)
    })

    it('should update current state', () => {
      expect(state).toEqual({
        ...currentState,
        ...payload.content,
      })
    })

    it('should not update other content on state', () => {
      expect(state.products).toBe(currentState.products)
    })
  })

  describe('given no current state', () => {
    it('should return initial state', () => {
      expect(content(undefined, { type: '@@INIT', meta: {} })).toEqual({})
    })
  })

  describe('given an unhandled action method', () => {
    it('should keep state unchanged', () => {
      expect(
        content(currentState, {
          type: 'entities/users/NOT_HANDLED_METHOD',
          meta: { type: 'users', method: 'NOT_HANDLED' },
        }),
      ).toBe(currentState)
    })
  })
})
