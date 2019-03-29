import { entities } from '../src'

describe('entities', () => {
  let action
  let currentState
  let payload
  let state

  beforeEach(() => {
    currentState = {
      products: { ids: [1], content: { 1: { name: 'Milk' } } },
      users: {
        ids: [2, 3],
        content: {
          2: { name: 'Lisa Silva' },
          3: { name: 'Marcus Paiva' },
        },
      },
    }
    payload = {
      ids: [1, 2],
      content: {
        1: { name: 'Joe Bars' },
        2: { name: 'Lisa Lemes' },
      },
    }
  })

  describe('when deleting an entity', () => {
    let userIdDeleted

    beforeEach(() => {
      userIdDeleted = 2
      action = entities.remove('users', userIdDeleted)
    })

    describe('action', () => {
      it('should return action type `entities/users/REMOVE`', () => {
        expect(action.type).toBe('entities/users/REMOVE')
      })

      it('should return meta selector', () => {
        expect(action.meta.selector).toBe(userIdDeleted)
      })

      it('should return meta method REMOVE', () => {
        expect(action.meta.method).toBe('REMOVE')
      })

      it('should return meta type users', () => {
        expect(action.meta.type).toBe('users')
      })
    })
  })

  describe('when setting an entity', () => {
    beforeEach(() => {
      action = entities.set('users', payload)
    })

    describe('action', () => {
      it('should return action type `entities/users/SET`', () => {
        expect(action.type).toBe('entities/users/SET')
      })

      it('should return given value as payload', () => {
        expect(action.payload).toBe(payload)
      })

      it('should return meta method SET', () => {
        expect(action.meta.method).toBe('SET')
      })

      it('should return meta type users', () => {
        expect(action.meta.type).toBe('users')
      })
    })
  })

  describe('when updating an entity', () => {
    beforeEach(() => {
      action = entities.update('users', payload)
    })

    describe('action', () => {
      it('should return action type `entities/users/UPDATE`', () => {
        expect(action.type).toBe('entities/users/UPDATE')
      })

      it('should return given value as payload', () => {
        expect(action.payload).toBe(payload)
      })

      it('should return meta method UPDATE', () => {
        expect(action.meta.method).toBe('UPDATE')
      })

      it('should return meta type users', () => {
        expect(action.meta.type).toBe('users')
      })
    })
  })

  describe('on initializing store', () => {
    let initialState

    describe('given init action with state provided', () => {
      beforeEach(() => {
        initialState = entities(currentState, { type: '@@INIT' })
      })

      it('should return `of` function on initial state', () => {
        expect(initialState.of).toBeInstanceOf(Function)
      })

      it('should return `idsOf` function on initial state', () => {
        expect(initialState.idsOf).toBeInstanceOf(Function)
      })

      it('should return `contentOf` function on initial state', () => {
        expect(initialState.contentOf).toBeInstanceOf(Function)
      })
    })

    describe('given init action with empty state', () => {
      beforeEach(() => {
        initialState = entities(undefined, { type: '@@INIT' })
      })

      it('should return `of` function on initial state', () => {
        expect(initialState.of).toBeInstanceOf(Function)
      })

      it('should return `idsOf` function on initial state', () => {
        expect(initialState.idsOf).toBeInstanceOf(Function)
      })

      it('should return `contentOf` function on initial state', () => {
        expect(initialState.contentOf).toBeInstanceOf(Function)
      })
    })
  })

  describe('given an unhandled action', () => {
    it('should keep state unchanged', () => {
      expect(
        entities(currentState, {
          type: 'NOT_HANDLED',
          meta: { type: 'users', method: 'UPDATE' },
        }),
      ).toBe(currentState)
    })
  })

  describe('given an unhandled action without meta', () => {
    it('should keep state unchanged', () => {
      expect(entities(currentState, { type: 'entities/users/UPDATE' })).toBe(
        currentState,
      )
    })
  })

  describe('given an unhandled action without meta type', () => {
    it('should keep state unchanged', () => {
      expect(
        entities(currentState, { type: 'entities/users/UPDATE', meta: {} }),
      ).toBe(currentState)
    })
  })

  describe('given an unhandled action method', () => {
    it('should keep state unchanged', () => {
      expect(
        entities(currentState, {
          type: 'entities/users/NOT_HANDLED_METHOD',
          meta: {
            method: 'NOT_HANDLED',
            type: 'users',
          },
        }),
      ).toBe(currentState)
    })
  })

  describe('given an action that changes state', () => {
    beforeEach(() => {
      action = entities.set('users', payload)
      state = entities(undefined, action)
    })

    it('should update state', () => {
      expect(state.users).toEqual({
        ...payload,
      })
    })

    it('should have entity type', () => {
      expect(state).toHaveProperty('users')
    })
  })

  describe('given another entity type action', () => {
    beforeEach(() => {
      payload = { ids: [2], content: { 2: { name: 'Sugar' } } }
      action = entities.update('products', payload)
      state = entities(currentState, action)
    })

    it('should keep other entities unchanged', () => {
      expect(state.users).toBe(currentState.users)
    })

    it('should update entity content with the payload provided', () => {
      expect(state.products.content).toEqual({
        ...currentState.products.content,
        ...payload.content,
      })
    })

    it('should update entity ids with the payload provided', () => {
      expect(state.products.ids).toEqual([1, 2])
    })
  })
})

describe('entities.of', () => {
  let action
  let payload
  let selector
  let state

  describe('when getting entity type from state', () => {
    beforeEach(() => {
      payload = {
        ids: [1, 2],
        content: {
          1: { name: 'Joe Bars' },
          2: { name: 'Lisa Lemes' },
        },
      }
      action = entities.set('users', payload)
      state = entities(undefined, action)
    })

    it('should return matched entity ids', () => {
      expect(state.of('users')).toBe(payload.ids)
    })

    it('should return empty array when not matched', () => {
      expect(state.of('products')).toHaveLength(0)
    })

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 1
      })

      it('should return matched entity by selector', () => {
        expect(state.of('users', selector)).toBe(payload.content[selector])
      })

      it('should return undefined when not matched', () => {
        expect(state.of('users', 'not-found-selector')).toBeUndefined()
      })

      it('should return undefined when entity do not exist', () => {
        expect(state.of('products', 'my-product-id')).toBeUndefined()
      })
    })
  })
})

describe('entities.idsOf', () => {
  let action
  let payload
  let state

  describe('when getting ids from an specifc entity type from state', () => {
    beforeEach(() => {
      payload = {
        ids: [1, 2],
        content: {
          1: { name: 'Joe Bars' },
          2: { name: 'Lisa Lemes' },
        },
      }
      action = entities.set('users', payload)
      state = entities(undefined, action)
    })

    it('should return matched entity ids', () => {
      expect(state.idsOf('users')).toBe(payload.ids)
    })

    it('should return empty array when not matched', () => {
      expect(state.idsOf('products')).toEqual([])
    })

    it('should return empty array when matched entity does not have ids', () => {
      // It was necessary redefine the values of payload, action and state here
      // in order to initialize the state with an entity (users) that doesn't have
      // ids
      payload = {
        content: {
          1: { name: 'Joe Bars' },
          2: { name: 'Lisa Lemes' },
        },
      }
      action = entities.set('users', payload)
      state = entities(undefined, action)
      expect(state.idsOf('users')).toEqual([])
    })
  })
})

describe('entities.contentOf', () => {
  let action
  let payload
  let state

  beforeEach(() => {
    payload = {
      ids: [1, 2],
      content: {
        1: { name: 'Joe Bars' },
        2: { name: 'Lisa Lemes' },
      },
    }
    action = entities.set('users', payload)
    state = entities(undefined, action)
  })

  describe('when getting content of an specific entity record, given a type and selector', () => {
    it('should return content of matched type/selector', () => {
      expect(state.contentOf('users', 2)).toEqual(payload.content[2])
    })

    it('should return undefined when there is no entity that matches with provided type', () => {
      expect(state.contentOf('products')).toBeUndefined()
    })

    it('should return undefined when entity matched does not have content', () => {
      // It was necessary redefine the values of payload, action and state here
      // in order to initialize the state with an entity (users) that doesn't have
      // content
      payload = {
        ids: [1, 2],
      }
      action = entities.set('users', payload)
      state = entities(undefined, action)
      expect(state.contentOf('users', 2)).toBeUndefined()
    })
  })
})
