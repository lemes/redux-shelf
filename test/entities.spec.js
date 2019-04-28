import { schema, normalize } from 'normalizr'

import { errorMessages } from '../src/constants'
import entities, { generateActionType } from '../src/entities'

describe('Generating an action type, given operation, resourceType and resourceId information', () => {
  describe('When resourceType is not provided or is invalid (non empty string)', () => {
    // For error assertions it's required that code that will throw the error be wrapper
    // by a function
    it('should throw an error informing that', () => {
      expect(() => generateActionType('SET', undefined)).toThrowError(
        errorMessages.invalidResourceType,
      )
      expect(() => generateActionType('SET', '')).toThrowError(
        errorMessages.invalidResourceType,
      )
    })
  })

  describe('When operation that action represents is about a entity set', () => {
    it('it should return the action name following the format: `entities/<operation>/<RESOURCE_TYPE>`', () => {
      const action = generateActionType('SET', 'users')
      expect(action).toBe('entities/SET/USERS')
    })
  })

  describe('When operation that action represents is about an specific entity', () => {
    it('it should return the action name following the format: `entities/<operation>/<RESOURCE_TYPE>:<resourceiId>`', () => {
      const action = generateActionType('SET', 'users', 'abc123')
      expect(action).toBe('entities/SET/USERS:abc123')
    })
  })
})

describe('entities', () => {
  describe('Action creators', () => {
    describe('set', () => {
      const userSchema = new schema.Entity('users')
      const articlesSchema = new schema.Entity('articles', {
        author: userSchema,
      })
      const payload = { id: '42', name: 'Arthur' }

      describe('When schema provided is a invalid one (not a normalizr entity schema object)', () => {
        it('should throw an error informing that', () => {
          expect(() =>
            entities.set('articles', {}, { id: '1', title: 'Some article' }),
          ).toThrowError(errorMessages.invalidNormalizrSchema)
        })
      })

      describe('When payload provided is invalid for normalization', () => {
        it('should thrown an error informing that', () => {
          expect(() =>
            entities.set('articles', articlesSchema, null),
          ).toThrowError()
        })
      })

      describe('When resource type provided is invalid (not a non empty string)', () => {
        it('should thrown an error informing that', () => {
          expect(() =>
            entities.set(undefined, articlesSchema, payload),
          ).toThrowError(errorMessages.invalidResourceType)
          expect(() => entities.set('', articlesSchema, payload)).toThrowError(
            errorMessages.invalidResourceType,
          )
        })
      })

      describe('When resouceType, schema and payload provided are valid', () => {
        it('should return an action with normalized payload that represents the setting data on state operation', () => {
          expect(entities.set('articles', articlesSchema, payload)).toEqual({
            type: 'entities/SET/ARTICLES',
            meta: {
              resourceType: 'articles',
              method: 'SET',
            },
            payload: normalize(payload, articlesSchema).entities,
          })
        })
      })
    })

    describe('update', () => {
      describe('When resource type provided is invalid (not a non empty string)', () => {
        it('should thrown an error informing that', () => {
          expect(() =>
            entities.update(undefined, 42, { id: 42, name: 'Arthur' }),
          ).toThrowError(errorMessages.invalidResourceType)
          expect(() =>
            entities.update('', 42, { id: 42, name: 'Arthur' }),
          ).toThrowError(errorMessages.invalidResourceType)
        })
      })

      describe('When resourceType, resourceId and payload provided are valid information', () => {
        it('should return an action that represents updating the entity data on state operation', () => {
          expect(
            entities.update('users', '1', { id: '1', name: 'Thomas' }),
          ).toEqual({
            type: 'entities/UPDATE/USERS:1',
            meta: {
              resourceType: 'users',
              resourceId: '1',
              method: 'UPDATE',
            },
            payload: {
              id: '1',
              name: 'Thomas',
            },
          })
        })
      })
    })

    describe('remove', () => {
      describe('When resource type provided is invalid (not a non empty string)', () => {
        it('should thrown an error informing that', () => {
          expect(() => entities.remove(undefined, '42')).toThrowError(
            errorMessages.invalidResourceType,
          )
          expect(() => entities.remove('', '42')).toThrowError(
            errorMessages.invalidResourceType,
          )
        })
      })

      describe('When resourceType, resourceId provided are valid information', () => {
        it('should return an action that represents remotion of the entity data from state operation', () => {
          expect(entities.remove('users', 1)).toEqual({
            type: 'entities/REMOVE/USERS:1',
            meta: {
              resourceType: 'users',
              resourceId: 1,
              method: 'REMOVE',
            },
          })
        })
      })
    })
  })

  describe('Reducer', () => {
    const currentState = {
      articles: {
        abc123: {
          id: 'abc123',
          title: 'First article',
          author: 2,
        },
      },
      users: {
        2: { id: 2, name: 'Lisa Silva' },
        3: { id: 3, name: 'Marcus Paiva' },
      },
    }

    describe('On state initialization', () => {
      it('should initialize state as empty object', () => {
        const state = entities.reducer(undefined, { type: '@@INIT' })
        expect(state).toEqual({})
      })
    })

    describe('When action provided does not represent entities tasks', () => {
      it('should return current state', () => {
        const newState = entities.reducer(currentState, {
          type: 'SOME_ACTION_TYPE',
        })
        expect(newState).toBe(currentState)
      })
    })

    describe('When entity action provided is not associated with a resourceType', () => {
      it('should return current state', () => {
        const newState = entities.reducer(currentState, {
          type: 'entities/SET/USERS',
          meta: {},
        })
        expect(newState).toBe(currentState)
      })
    })

    describe('When action provided represents entities tasks and it is associated with a resourceType', () => {
      describe('On setting entity data on state', () => {
        it('should set entity data on state properly', () => {
          const userSchema = new schema.Entity('users')
          const payload = { id: 42, name: 'Arthur' }
          const action = entities.set('users', userSchema, payload)
          const newState = entities.reducer(currentState, action)
          expect(newState).toEqual({
            articles: {
              abc123: {
                id: 'abc123',
                title: 'First article',
                author: 2,
              },
            },
            users: {
              42: { id: 42, name: 'Arthur' },
            },
          })
        })
      })

      describe('On updating entity data on state', () => {
        describe('When entity to be updated does not exist on state', () => {
          it('should return current state', () => {
            const payload = { id: 2, name: 'Bill' }
            const action = entities.update('authors', 2, payload)
            const newState = entities.reducer(currentState, action)
            expect(newState).toBe(currentState)
          })
        })

        describe('When entity to be updated exists on state', () => {
          it('should update entity properly', () => {
            const payload = { id: 2, name: 'Mario' }
            const action = entities.update('users', 2, payload)
            const newState = entities.reducer(currentState, action)
            expect(newState).toEqual({
              articles: {
                abc123: {
                  id: 'abc123',
                  title: 'First article',
                  author: 2,
                },
              },
              users: {
                2: { id: 2, name: 'Mario' },
                3: { id: 3, name: 'Marcus Paiva' },
              },
            })
          })
        })
      })

      describe('On removing entity data from state', () => {
        describe('When entity to be removed does not exist on state', () => {
          it('should return current state', () => {
            const action = entities.remove('users', 45)
            const newState = entities.reducer(currentState, action)
            expect(newState).toBe(currentState)
          })
        })

        describe('When entity to be removed exists on state', () => {
          describe('When entity to be removed is the last one of that entity type', () => {
            it('should remove all entity type node from state', () => {
              const action = entities.remove('articles', 'abc123')
              const newState = entities.reducer(currentState, action)
              expect(newState).toEqual({
                users: {
                  2: { id: 2, name: 'Lisa Silva' },
                  3: { id: 3, name: 'Marcus Paiva' },
                },
              })
            })
          })

          describe('When entity to be remove is not the last one of that entity type', () => {
            it('should remove only the specified entity from entity type node', () => {
              const action = entities.remove('users', '2')
              const newState = entities.reducer(currentState, action)
              expect(newState).toEqual({
                articles: {
                  abc123: {
                    id: 'abc123',
                    title: 'First article',
                    author: 2,
                  },
                },
                users: {
                  3: { id: 3, name: 'Marcus Paiva' },
                },
              })
            })
          })
        })
      })

      describe('When an unknown entity action is provided', () => {
        it('should return current state', () => {
          const action = {
            type: 'entities/UNKNOWN_ACTION_TYPE',
            meta: {
              resourceType: 'users',
              method: 'UNKNOWN',
            },
          }
          const newState = entities.reducer(currentState, action)
          expect(newState).toBe(currentState)
        })
      })
    })
  })
})
