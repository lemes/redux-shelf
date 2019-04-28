import communication from '../src/communication'

describe('communication', () => {
  describe('Action creators', () => {
    describe('starting', () => {
      describe('When only `type` is provided', () => {
        it(
          'should return an action that represents initialization ' +
            'of an asynchronous operation related with a entity group',
          () => {
            expect(communication.starting('users')).toEqual({
              type: 'communication/users/STARTING',
              meta: { type: 'users', status: 'STARTING' },
            })
          },
        )
      })

      describe('When `type` and `selector` are provided', () => {
        it(
          'should return an action that represents initialization ' +
            'of an asynchronous operation related with a specific entity',
          () => {
            expect(communication.starting('users', 'abc123')).toEqual({
              type: 'communication/users/STARTING',
              meta: {
                type: 'users',
                status: 'STARTING',
                selector: 'abc123',
              },
            })
          },
        )
      })
    })

    describe('cancel', () => {
      describe('When only `type` is provided', () => {
        it(
          'should return an action that represents cancelation ' +
            'of an asynchronous operation related with a entity group',
          () => {
            expect(communication.cancel('users')).toEqual({
              type: 'communication/users/CANCEL',
              meta: { type: 'users', status: 'CANCEL' },
            })
          },
        )
      })

      describe('When `type` and `selector` are provided', () => {
        it(
          'should return an action that represents cancelation ' +
            'of an asynchronous operation related with a specific entity',
          () => {
            expect(communication.cancel('users', 'abc123')).toEqual({
              type: 'communication/users/CANCEL',
              meta: {
                type: 'users',
                status: 'CANCEL',
                selector: 'abc123',
              },
            })
          },
        )
      })
    })

    describe('fail', () => {
      describe('When only `type` is provided', () => {
        it(
          'should return an action that represents that some error occurred ' +
            'during an asynchronous operation execution related with an entity group',
          () => {
            expect(communication.fail('users')).toEqual({
              type: 'communication/users/FAIL',
              meta: { type: 'users', status: 'FAIL' },
            })
          },
        )
      })

      describe('When `type` and `error` are provided', () => {
        it(
          'should return an action that represents that some error occurred ' +
            'during an asynchronous operation execution related with an entity group ' +
            'with the error as its payload',
          () => {
            const error = new Error('Something went wrong!')
            expect(communication.fail('users', error)).toEqual({
              type: 'communication/users/FAIL',
              payload: error,
              error: true,
              meta: { type: 'users', status: 'FAIL' },
            })
          },
        )
      })

      describe('When `type`, `selector`, and `error` are provided', () => {
        it(
          'should return an action that represents that some error occurred ' +
            'during an asynchronous operation execution related with an entity item ' +
            'with the error as its payload',
          () => {
            const error = new Error('Something went wrong!')
            expect(communication.fail('users', 'abc123', error)).toEqual({
              type: 'communication/users/FAIL',
              payload: error,
              error: true,
              meta: {
                type: 'users',
                selector: 'abc123',
                status: 'FAIL',
              },
            })
          },
        )
      })
    })

    describe('done', () => {
      describe('When only `type` is provided', () => {
        it(
          'should return an action that represents the end ' +
            'of an asynchronous operation related with a entity group',
          () => {
            expect(communication.done('users')).toEqual({
              type: 'communication/users/DONE',
              meta: { type: 'users', status: 'DONE' },
            })
          },
        )
      })

      describe('When `type` and `selector` are provided', () => {
        it(
          'should return an action that represents the end ' +
            'of an asynchronous operation related with a specific entity',
          () => {
            expect(communication.done('users', 'abc123')).toEqual({
              type: 'communication/users/DONE',
              meta: {
                type: 'users',
                status: 'DONE',
                selector: 'abc123',
              },
            })
          },
        )
      })
    })
  })

  describe('Reducer', () => {
    describe('On state initialization', () => {
      it('should initialize state as empty object', () => {
        const state = communication.reducer(undefined, { type: '@@INIT' })
        expect(state).toEqual({})
      })
    })

    describe('When action provided does not represent communication tasks', () => {
      it('should return current state', () => {
        const currentState = {
          users: { status: 'STARTING' },
        }
        const newState = communication.reducer(currentState, {
          type: 'SOME_ACTION_TYPE',
        })
        expect(newState).toBe(currentState)
      })
    })

    describe('When entity action provided is not associated with a status', () => {
      it('should return current state', () => {
        const currentState = {
          users: { status: 'STARTING' },
        }
        const newState = communication.reducer(currentState, {
          type: 'communication/users/STARTING',
          meta: {},
        })
        expect(newState).toBe(currentState)
      })
    })

    describe('When action provided represents communication tasks and it is associated with a status', () => {
      describe('On starting an asynchronous operation', () => {
        describe('When asynchronous operation is related with an entity group', () => {
          it('should set communication state properly', () => {
            const action = communication.starting('users')
            const newState = communication.reducer({}, action)
            expect(newState).toEqual({
              users: { status: 'STARTING' },
            })
          })
        })

        describe('When asynchronous operation is related with an entity item', () => {
          it('should set communication state properly', () => {
            const action = communication.starting('users', 'abc123')
            const newState = communication.reducer({}, action)
            expect(newState).toEqual({
              'users:abc123': { status: 'STARTING' },
            })
          })
        })
      })

      describe('On canceling an asynchronous operation', () => {
        describe('When asynchronous operation is related with an entity group', () => {
          it('should set communication state properly', () => {
            const currentState = {
              users: { status: 'STARTING' },
            }
            const action = communication.cancel('users')
            const newState = communication.reducer(currentState, action)
            expect(newState).toEqual({})
          })
        })

        describe('When asynchronous operation is related with an entity item', () => {
          it('should set communication state properly', () => {
            const currentState = {
              'users:abc123': { status: 'STARTING' },
            }
            const action = communication.cancel('users', 'abc123')
            const newState = communication.reducer(currentState, action)
            expect(newState).toEqual({})
          })
        })
      })

      describe('On completing an asynchronous operation', () => {
        describe('When asynchronous operation is related with an entity group', () => {
          it('should set communication state properly', () => {
            const currentState = {
              users: { status: 'STARTING' },
            }
            const action = communication.done('users')
            const newState = communication.reducer(currentState, action)
            expect(newState).toEqual({})
          })
        })

        describe('When asynchronous operation is related with an entity item', () => {
          it('should set communication state properly', () => {
            const currentState = {
              'users:abc123': { status: 'STARTING' },
            }
            const action = communication.done('users', 'abc123')
            const newState = communication.reducer(currentState, action)
            expect(newState).toEqual({})
          })
        })
      })

      describe('On failing an asynchronous operation', () => {
        describe('When asynchronous operation is related with an entity group', () => {
          it('should set communication state properly', () => {
            const currentState = {
              users: { status: 'STARTING' },
            }
            const error = new Error('Something went wrong!')
            const action = communication.fail('users', error)
            const newState = communication.reducer(currentState, action)
            expect(newState).toEqual({
              users: {
                status: 'FAIL',
                error,
              },
            })
          })
        })

        describe('When asynchronous operation is related with an entity item', () => {
          it('should set communication state properly', () => {
            const currentState = {
              'users:abc123': { status: 'STARTING' },
            }
            const error = new Error('Something went wrong!')
            const action = communication.fail('users', 'abc123', error)
            const newState = communication.reducer(currentState, action)
            expect(newState).toEqual({
              'users:abc123': {
                status: 'FAIL',
                error,
              },
            })
          })
        })
      })
    })

    describe('When an unknown communication action is provided', () => {
      it('should return current state', () => {
        const currentState = {}
        const action = {
          type: 'communication/UNKNOWN_ACTION_TYPE',
          meta: {
            type: 'UNKNOWN_ACTION_TYPE',
            status: 'UNKNOWN',
          },
        }
        const newState = communication.reducer(currentState, action)
        expect(newState).toBe(currentState)
      })
    })
  })
})
