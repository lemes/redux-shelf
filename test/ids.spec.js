import ids from '../src/ids'
import * as actions from '../src/entities'

describe('ids', () => {
  let currentState
  let state

  beforeEach(() => {
    currentState = [1, 2]
  })

  describe('when deleting an id', () => {
    beforeEach(() => {
      state = ids(currentState, actions.remove('users', 1))
    })

    it('should remove id from array', () => {
      expect(state).not.toEqual(expect.arrayContaining([1]))
    })

    describe('given a not found selector', () => {
      beforeEach(() => {
        state = ids(currentState, actions.remove('users', 3))
      })

      it('should keep state unchanged', () => {
        expect(state).toBe(currentState)
      })
    })
  })

  describe('when updating ids', () => {
    beforeEach(() => {
      state = ids(
        currentState,
        actions.update('users', {
          ids: [2, 3],
        }),
      )
    })

    it('should merge dispatched ids into state without duplications', () => {
      expect(state).toEqual([1, 2, 3])
    })

    describe('given a not found selector', () => {
      beforeEach(() => {
        state = ids(currentState, actions.update('users', { ids: [1, 2] }))
      })

      it('should keep state unchanged', () => {
        expect(state).toBe(currentState)
      })
    })
  })

  describe('when setting ids', () => {
    beforeEach(() => {
      state = ids(
        currentState,
        actions.set('users', {
          ids: [2, 3],
        }),
      )
    })

    it('should replace current ids with dispatched ids', () => {
      expect(state).toEqual([2, 3])
    })
  })

  describe('given no current state', () => {
    it('should return initial state', () => {
      expect(ids(undefined, { type: '@@INIT', meta: {} })).toEqual([])
    })
  })

  describe('given an unhandled action method', () => {
    it('should keep state unchanged', () => {
      expect(
        ids(currentState, {
          type: 'entities/users/NOT_HANDLED_METHOD',
          meta: { type: 'users', method: 'NOT_HANDLED' },
        }),
      ).toBe(currentState)
    })
  })
})
