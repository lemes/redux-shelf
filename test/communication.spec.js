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

  describe('when dispatching a communication action', () => {
    beforeEach(() => {
      action = actions.starting(type);
      state = communication(currentState, action);
    });

    it('should add type to state', () => {
      expect(state).toHaveProperty(`${type}`);
    });

    it('should not add error to state', () => {
      expect(state).not.toHaveProperty(`${type}.error`);
    });

    it('should set status', () => {
      expect(state[type].status).toBe('STARTING');
    });
  });

  describe('when dispatching a communication action with selector', () => {
    beforeEach(() => {
      selector = 'userA';
      action = actions.starting(type, selector);
      state = communication(currentState, action);
    });

    it('should add type:selector to state', () => {
      expect(state).toHaveProperty(`${type}:${selector}`);
    });

    it('should set status', () => {
      expect(state[`${type}:${selector}`].status).toBe('STARTING');
    });
  });

  describe('when dispatching a communication action with error ', () => {
    beforeEach(() => {
      selector = 'userA';
      error = new Error('error');
      action = actions.starting(type, selector, error);
      state = communication(currentState, action)[`${type}:${selector}`];
    });

    it('should set error', () => {
      expect(state.error).toBe(error);
    });
  });

  describe('given init action', () => {
    it('should return initial state', () => {
      expect(communication(undefined, { type: '@@INIT' })).toEqual({});
    });
  });

  describe('given an action that do not starts with "communication"', () => {
    it('should keep state unchanged', () => {
      expect(communication(currentState, { type: 'NOT_HANDLED' })).toBe(
        currentState,
      );
    });
  });
});
