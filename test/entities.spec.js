import { schema, normalize } from 'normalizr'

import { entities } from '../src'

const userSchema = new schema.Entity('users')
const articleSchema = new schema.Entity('articles', {
  author: userSchema,
})

describe('entities', () => {
  let action
  let currentState
  let payload
  let state

  beforeEach(() => {
    currentState = {
      articles: {
        abc123: {
          id: 'abc123',
          title: 'First article',
          author: 2,
        },
      },
      users: {
        2: { name: 'Lisa Silva' },
        3: { name: 'Marcus Paiva' },
      },
    }
    payload = {
      id: 'abc123',
      title: 'First article',
      author: {
        id: 2,
        name: 'Lisa Silva',
      },
    }
  })

  describe.skip('when deleting an entity', () => {
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
      action = entities.set('articles', articleSchema, payload)
    })

    describe('action', () => {
      it('should return action type `entities/SET/ARTICLES`', () => {
        expect(action.type).toBe('entities/SET/ARTICLES')
      })

      it('should return a normalized version of provided payload', () => {
        expect(action.payload).toEqual(
          normalize(payload, articleSchema).entities,
        )
      })

      it('should return meta method SET', () => {
        expect(action.meta.method).toBe('SET')
      })

      it('should return meta type users', () => {
        expect(action.meta.resourceType).toBe('articles')
      })
    })
  })

  describe.skip('when updating an entity', () => {
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

  describe('given an unhandled action', () => {
    it('should keep state unchanged', () => {
      expect(
        entities.reducer(currentState, {
          type: 'NOT_HANDLED',
          meta: { type: 'users', method: 'UPDATE' },
        }),
      ).toBe(currentState)
    })
  })

  describe('given an unhandled action without meta', () => {
    it('should keep state unchanged', () => {
      expect(
        entities.reducer(currentState, { type: 'entities/users/UPDATE' }),
      ).toBe(currentState)
    })
  })

  describe('given an unhandled action without meta type', () => {
    it('should keep state unchanged', () => {
      expect(
        entities.reducer(currentState, {
          type: 'entities/users/UPDATE',
          meta: {},
        }),
      ).toBe(currentState)
    })
  })

  describe('given an unhandled action method', () => {
    it('should keep state unchanged', () => {
      expect(
        entities.reducer(currentState, {
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
      action = entities.set('articles', articleSchema, payload)
      state = entities.reducer(undefined, action)
    })

    it('should update state', () => {
      expect(state).toEqual({
        ...normalize(payload, articleSchema).entities,
      })
    })
  })
})
