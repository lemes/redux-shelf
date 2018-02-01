import communication, * as actions from '../src/communication';

describe('communication', () => {
  let action;
  let currentState;
  let error;
  let selector;
  let state;
  let type;

  beforeEach(() => {
    type = 'users';
    currentState = {};
  });

  describe('when dispatching starting communication action', () => {
    beforeEach(() => {
      action = actions.starting(type);
    });

    it('should return type communication/{type}/STARTING', () => {
      expect(action.type).toEqual(`communication/${type}/STARTING`);
    });

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 'userId';
        action = actions.starting(type, selector);
      });

      it('should return given meta selector', () => {
        expect(action.meta.selector).toEqual(selector);
      });
    });
  });

  describe('when dispatching cancel communication action', () => {
    beforeEach(() => {
      action = actions.cancel(type);
    });

    it('should return type communication/{type}/CANCEL', () => {
      expect(action.type).toEqual(`communication/${type}/CANCEL`);
    });

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 'userId';
        action = actions.cancel(type, selector);
      });

      it('should return given meta selector', () => {
        expect(action.meta.selector).toEqual(selector);
      });
    });
  });

  describe('when dispatching done communication action', () => {
    beforeEach(() => {
      action = actions.done(type);
    });

    it('should return type communication/{type}/DONE', () => {
      expect(action.type).toEqual(`communication/${type}/DONE`);
    });

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 'userId';
        action = actions.done(type, selector);
      });

      it('should return given meta selector', () => {
        expect(action.meta.selector).toEqual(selector);
      });
    });
  });

  describe('when dispatching fail communication action', () => {
    beforeEach(() => {
      error = new Error('my mocked error');
      action = actions.fail(type, error);
    });

    it('should return type communication/{type}/FAIL', () => {
      expect(action.type).toEqual(`communication/${type}/FAIL`);
    });

    it('should return payload with the error', () => {
      expect(action.payload).toEqual(error);
    });

    it('should return action with error true', () => {
      expect(action.error).toBeTruthy();
    });

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 'userId';
        error = new Error('my mocked error');
        action = actions.fail(type, selector, error);
      });

      it('should return given meta selector', () => {
        expect(action.meta.selector).toEqual(selector);
      });
    });

    describe('given no error', () => {
      beforeEach(() => {
        action = actions.fail(type);
      });

      it('should return payload undefined', () => {
        expect(action.payload).toBeUndefined();
      });
    });
  });

  describe('when dispatching a communication action', () => {
    beforeEach(() => {
      action = actions.starting(type);
      state = communication(currentState, action);
    });

    it('should add type to state', () => {
      expect(state).toHaveProperty(`${type}`);
    });

    it('should set status', () => {
      expect(state[type].status).toBe('STARTING');
    });

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 'userA';
        action = actions.starting(type, selector);
        state = communication(currentState, action);
      });

      it('should add type and selector to state', () => {
        expect(state).toHaveProperty(`${type}:${selector}`);
      });
    });

    describe('given an error', () => {
      beforeEach(() => {
        error = new Error('my mocked error');
        action = actions.fail(type, error);
        state = communication(currentState, action);
      });

      it('should set error', () => {
        expect(state[type].error).toEqual(error);
      });
    });
  });

  describe('given init action', () => {
    it('should return initial state', () => {
      expect(typeof communication(undefined, { type: '@@INIT' }).of).toEqual(
        'function',
      );
    });
  });

  describe('given an action that do not starts with "communication"', () => {
    it('should keep state unchanged', () => {
      expect(communication(currentState, { type: 'NOT_HANDLED' })).toBe(
        currentState,
      );
    });
  });

  describe('given an action that has an invalid status', () => {
    it('should keep state unchanged', () => {
      expect(
        communication(currentState, {
          type: 'communication/users/INVALID_STATUS',
          meta: {
            type: 'users',
            status: 'INVALID_STATUS',
          },
        }),
      ).toBe(currentState);
    });
  });
});

describe('communication.of', () => {
  let action;
  let state;

  describe('when there is some work in progress external request', () => {
    beforeEach(() => {
      action = actions.starting('users', 'a1b2c3');
      state = communication(undefined, action);
    });

    it('should set loding flag to true', () => {
      expect(state.of('users', 'a1b2c3').loading).toBeTruthy();
    });

    it('should set error flag to undefined', () => {
      expect(state.of('users', 'a1b2c3').error).toBeUndefined();
    });
  });

  describe('when there os come some external request that was canceled', () => {
    beforeEach(() => {
      action = actions.cancel('users');
      state = communication(undefined, action);
    });

    it('should set loading flag to false', () => {
      expect(state.of('users').loading).toBeFalsy();
    });

    it('should set error flag to undefined', () => {
      expect(state.of('users').error).toBeUndefined();
    });
  });

  describe('when there is some external request that was finished', () => {
    beforeEach(() => {
      action = actions.done('users');
      state = communication(undefined, action);
    });

    it('should set loading flag to false', () => {
      expect(state.of('users').loading).toBeFalsy();
    });

    it('should set error flag to undefined', () => {
      expect(state.of('users').error).toBeUndefined();
    });
  });

  describe('when there some external request that failed', () => {
    let error;
    beforeEach(() => {
      error = new Error('Somthing wrong happened');
      action = actions.fail('users', error);
      state = communication(undefined, action);
    });

    it('should set loading flag to false', () => {
      expect(state.of('users').loading).toBeFalsy();
    });

    it('should return the error', () => {
      expect(state.of('users').error).toEqual(
        new Error('Somthing wrong happened'),
      );
    });
  });
});
