import communication, * as actions from '../src/communication';

describe('communication', () => {
  let action;
  let error;
  let selector;
  let state;
  let type;

  beforeEach(() => {
    type = 'users';
  });

  describe('when dispatching starting communication action', () => {
    beforeEach(() => {
      action = actions.starting(type);
      state = communication(undefined, action);
    });

    it('should return type communication/{type}/STARTING', () => {
      expect(action.type).toEqual(`communication/${type}/STARTING`);
    });

    it('should return meta status STARTING', () => {
      expect(action.meta.status).toBe('STARTING');
    });

    it(`should return meta type ${type}`, () => {
      expect(action.meta.type).toBe(type);
    });

    it(`should set status to communication state.${type}`, () => {
      expect(state.users).toEqual({ status: 'STARTING' });
    });

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 'userId';
        action = actions.starting(type, selector);
        state = communication(undefined, action);
      });

      it('should return given meta selector', () => {
        expect(action.meta.selector).toEqual(selector);
      });

      it(`should set status to communication state[${type}:${selector}]`, () => {
        expect(state[`${type}:${selector}`]).toEqual({ status: 'STARTING' });
      });
    });
  });

  describe('when dispatching cancel communication action', () => {
    beforeEach(() => {
      action = actions.cancel(type);
      state = communication(
        {
          users: { status: 'STARTING' },
        },
        action,
      );
    });

    it('should return type communication/{type}/CANCEL', () => {
      expect(action.type).toEqual(`communication/${type}/CANCEL`);
    });

    it('should return meta status CANCEL', () => {
      expect(action.meta.status).toBe('CANCEL');
    });

    it(`should return meta type ${type}`, () => {
      expect(action.meta.type).toBe(type);
    });

    it(`should remove state.${type}`, () => {
      expect(state.users).toBeUndefined();
    });

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 'userId';
        action = actions.cancel(type, selector);
        state = communication(
          {
            [`users:${selector}`]: { status: 'STARTING' },
          },
          action,
        );
      });

      it('should return given meta selector', () => {
        expect(action.meta.selector).toEqual(selector);
      });

      it(`should remove state[${type}:${selector}]`, () => {
        expect(state.users).toBeUndefined();
      });
    });
  });

  describe('when dispatching done communication action', () => {
    beforeEach(() => {
      action = actions.done(type);
      state = communication(
        {
          users: { status: 'STARTING' },
        },
        action,
      );
    });

    it('should return type communication/{type}/DONE', () => {
      expect(action.type).toEqual(`communication/${type}/DONE`);
    });

    it('should return meta status DONE', () => {
      expect(action.meta.status).toBe('DONE');
    });

    it(`should return meta type ${type}`, () => {
      expect(action.meta.type).toBe(type);
    });

    it(`should remove state.${type}`, () => {
      expect(state.users).toBeUndefined();
    });

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 'userId';
        action = actions.done(type, selector);
        state = communication(
          {
            [`users:${selector}`]: { status: 'STARTING' },
          },
          action,
        );
      });

      it('should return given meta selector', () => {
        expect(action.meta.selector).toEqual(selector);
      });

      it(`should remove state[${type}:${selector}]`, () => {
        expect(state.users).toBeUndefined();
      });
    });
  });

  describe('when dispatching fail communication action', () => {
    beforeEach(() => {
      error = new Error('my mocked error');
      action = actions.fail(type, error);
      state = communication(undefined, action);
    });

    it('should return type communication/{type}/FAIL', () => {
      expect(action.type).toEqual(`communication/${type}/FAIL`);
    });

    it('should return meta status FAIL', () => {
      expect(action.meta.status).toBe('FAIL');
    });

    it(`should return meta type ${type}`, () => {
      expect(action.meta.type).toBe(type);
    });

    it('should return payload with the error', () => {
      expect(action.payload).toEqual(error);
    });

    it('should return action with error true', () => {
      expect(action.error).toBeTruthy();
    });

    it(`should set status to communication state.${type}`, () => {
      expect(state.users.status).toBe('FAIL');
    });

    it(`should set error to communication state.${type}`, () => {
      expect(state.users.error).toBe(error);
    });

    describe('given a selector', () => {
      beforeEach(() => {
        selector = 'userId';
        error = new Error('my mocked error');
        action = actions.fail(type, selector, error);
        state = communication(
          {
            [`users:${selector}`]: { status: 'STARTING' },
          },
          action,
        );
      });

      it('should return given meta selector', () => {
        expect(action.meta.selector).toEqual(selector);
      });

      it(`should set status to communication state[${type}:${selector}]`, () => {
        expect(state[`${type}:${selector}`].status).toBe('FAIL');
      });

      it(`should set error to communication state[${type}:${selector}]`, () => {
        expect(state[`${type}:${selector}`].error).toBe(error);
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

  describe('given init action', () => {
    it('should return `of` function on initial state', () => {
      expect(communication(undefined, { type: '@@INIT' }).of).toBeInstanceOf(
        Function,
      );
    });
  });

  describe('given an action that do not starts with "communication"', () => {
    it('should keep state unchanged', () => {
      const curentState = {};
      expect(communication(curentState, { type: 'NOT_HANDLED' })).toBe(
        curentState,
      );
    });
  });

  describe('given an action that has an invalid status', () => {
    it('should keep state unchanged', () => {
      const curentState = {};
      expect(
        communication(curentState, {
          type: 'communication/users/INVALID_STATUS',
          meta: {
            type: 'users',
            status: 'INVALID_STATUS',
          },
        }),
      ).toBe(curentState);
    });
  });
});

describe('communication.of', () => {
  let action;
  let state;

  describe('when there is a not-yet complete request', () => {
    beforeEach(() => {
      action = actions.starting('users');
      state = communication(undefined, action);
    });

    it('should return loading true', () => {
      expect(state.of('users').loading).toBeTruthy();
    });

    it('should return error undefined', () => {
      expect(state.of('users').error).toBeUndefined();
    });

    describe('given a selector', () => {
      beforeEach(() => {
        action = actions.starting('users', 'userA');
        state = communication(undefined, action);
      });

      it('should return loading true', () => {
        expect(state.of('users', 'userA').loading).toBeTruthy();
      });

      it('should return error undefined', () => {
        expect(state.of('users', 'userA').error).toBeUndefined();
      });
    });
  });

  describe("when there isn't a not-yet complete request", () => {
    beforeEach(() => {
      state = communication(undefined, action);
    });

    it('should return loading false', () => {
      expect(state.of('users').loading).toBeFalsy();
    });

    it('should return error undefined', () => {
      expect(state.of('users').error).toBeUndefined();
    });

    describe('given a selector', () => {
      beforeEach(() => {
        state = communication(undefined, action);
      });

      it('should return loading false', () => {
        expect(state.of('users').loading).toBeFalsy();
      });

      it('should return error undefined', () => {
        expect(state.of('users').error).toBeUndefined();
      });
    });
  });

  describe('when there is a failed request', () => {
    let error;
    beforeEach(() => {
      error = new Error('Somthing wrong happened');
      action = actions.fail('users', error);
      state = communication(undefined, action);
    });

    it('should return loading false', () => {
      expect(state.of('users').loading).toBeFalsy();
    });

    it('should return the error', () => {
      expect(state.of('users').error).toEqual(
        new Error('Somthing wrong happened'),
      );
    });

    describe('given a selector', () => {
      beforeEach(() => {
        error = new Error('Somthing wrong happened');
        action = actions.fail('users', 'userA', error);
        state = communication(undefined, action);
      });

      it('should return loading false', () => {
        expect(state.of('users', 'userA').loading).toBeFalsy();
      });

      it('should return error undefined', () => {
        expect(state.of('users', 'userA').error).toEqual(
          new Error('Somthing wrong happened'),
        );
      });
    });
  });
});
