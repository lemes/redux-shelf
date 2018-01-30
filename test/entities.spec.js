import entities, * as actions from '../src/entities';

describe('entities', () => {
  let action;
  let currentState;
  let payload;
  let state;

  beforeEach(() => {
    currentState = {
      products: { 1: { name: 'Milk' } },
      users: {
        2: { name: 'Lisa Silva' },
        3: { name: 'Marcus Paiva' },
      },
    };
    payload = {
      users: {
        1: { name: 'Joe Bars' },
        2: { name: 'Lisa Lemes' },
      },
    };
  });

  describe('when deleting an entity', () => {
    let userIdDeleted;

    beforeEach(() => {
      userIdDeleted = 2;
      action = actions.remove('users', userIdDeleted);
    });

    describe('action', () => {
      it('should return action type `entities/users/REMOVE`', () => {
        expect(action.type).toBe('entities/users/REMOVE');
      });

      it('should return meta selector', () => {
        expect(action.meta.selector).toBe(`${userIdDeleted}`);
      });

      it('should return meta selector as string', () => {
        expect(typeof action.meta.selector).toBe('string');
      });

      it('should return meta method REMOVE', () => {
        expect(action.meta.method).toBe('REMOVE');
      });

      it('should return meta type users', () => {
        expect(action.meta.type).toBe('users');
      });
    });

    describe('reducer', () => {
      beforeEach(() => {
        state = entities(currentState, action);
      });

      it('should remove entity', () => {
        const { [`${userIdDeleted}`]: omit, ...rest } = currentState.users;
        expect(state.users).toEqual(rest);
      });

      it('should not update other entities on state', () => {
        expect(state.products).toBe(currentState.products);
      });

      describe('given a not found selector', () => {
        it('should return keep state unchanged', () => {
          expect(
            entities(currentState, actions.remove('users', 'not-found-user')),
          ).toBe(currentState);
        });
      });
    });
  });

  describe('when setting an entity', () => {
    beforeEach(() => {
      action = actions.set('users', payload);
    });

    describe('action', () => {
      it('should return action type `entities/users/SET`', () => {
        expect(action.type).toBe('entities/users/SET');
      });

      it('should return given value as payload', () => {
        expect(action.payload).toBe(payload);
      });

      it('should return meta method SET', () => {
        expect(action.meta.method).toBe('SET');
      });
    });

    describe('reducer', () => {
      beforeEach(() => {
        state = entities(currentState, action);
      });

      it('should replace current state', () => {
        expect(state.users).toEqual(payload.users);
      });

      it('should not update other entities on state', () => {
        expect(state.products).toBe(currentState.products);
      });
    });
  });

  describe('when updating an entity', () => {
    beforeEach(() => {
      action = actions.update('users', payload);
    });

    describe('action', () => {
      it('should return action type `entities/users/UPDATE`', () => {
        expect(action.type).toBe('entities/users/UPDATE');
      });

      it('should return given value as payload', () => {
        expect(action.payload).toBe(payload);
      });

      it('should return meta method UPDATE', () => {
        expect(action.meta.method).toBe('UPDATE');
      });
    });

    describe('reducer', () => {
      beforeEach(() => {
        state = entities(currentState, action);
      });

      it('should update current state', () => {
        expect(state.users).toEqual({
          ...currentState.users,
          ...payload.users,
        });
      });

      it('should not update other entities on state', () => {
        expect(state.products).toBe(currentState.products);
      });
    });
  });

  describe('given init action', () => {
    it('should return initial state', () => {
      expect(entities(undefined, { type: '@@INIT' })).toEqual({});
    });
  });

  describe('given an unhandled action', () => {
    it('should keep state unchanged', () => {
      expect(entities(currentState, { type: 'NOT_HANDLED' })).toBe(
        currentState,
      );
    });
  });

  describe('given an unhandled action method', () => {
    it('should return keep state unchanged', () => {
      expect(
        entities(currentState, {
          type: 'entities/users/NOT_HANDLED_METHOD',
          meta: { method: 'NOT_HANDLED' },
        }),
      ).toBe(currentState);
    });
  });
});
