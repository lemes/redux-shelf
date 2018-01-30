import entities, * as actions from '../src/entities';

describe('entities', () => {
  let action;
  let currentState;
  let payload;
  let state;

  beforeEach(() => {
    currentState = {
      products: { content: { 1: { name: 'Milk' } } },
      users: {
        content: {
          2: { name: 'Lisa Silva' },
          3: { name: 'Marcus Paiva' },
        },
      },
    };
    payload = {
      content: {
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

      it('should return meta type users', () => {
        expect(action.meta.type).toBe('users');
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

      it('should return meta type users', () => {
        expect(action.meta.type).toBe('users');
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
      expect(
        entities(currentState, {
          type: 'NOT_HANDLED',
          meta: { type: 'users', method: 'UPDATE' },
        }),
      ).toBe(currentState);
    });
  });

  describe('given an unhandled action without meta', () => {
    it('should keep state unchanged', () => {
      expect(entities(currentState, { type: 'entities/users/UPDATE' })).toBe(
        currentState,
      );
    });
  });

  describe('given an unhandled action without meta type', () => {
    it('should keep state unchanged', () => {
      expect(
        entities(currentState, { type: 'entities/users/UPDATE', meta: {} }),
      ).toBe(currentState);
    });
  });

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
      ).toBe(currentState);
    });
  });

  describe('given an action that changes state', () => {
    beforeEach(() => {
      action = actions.set('users', payload);
      state = entities(undefined, action);
    });

    it('should update state', () => {
      expect(state).toEqual({
        users: { content: payload.content },
      });
    });

    it('should have entity type', () => {
      expect(state).toHaveProperty('users');
    });

    it('should keep other entities unchanged', () => {
      payload = { content: { 2: { name: 'Sugar' } } };
      action = actions.update('products', payload);
      state = entities(currentState, action);
      expect(state.users).toBe(currentState.users);
    });
  });
});
