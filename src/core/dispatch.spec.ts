import { dispatch } from './dispatch';

describe('dispatch', () => {
  const type = '[Action] type';
  const payload = {};
  const action = { payload, type };
  const state = {};

  it('should call the reducer for that type with the payload as argument', () => {
    const reducer = jest.fn().mockReturnValueOnce(type);
    const reducers = { [type]: reducer };

    const result = dispatch(reducers, state, action);

    expect(result).toBe(type);
    expect(reducer).toBeCalledWith(state, payload);
  });

  it('should throw when a reducer is not found for the action.type', () => {
    const act = () => dispatch({}, state, action);

    expect(act).toThrowError(
      `Action of type (${type}) was dispatched ` +
        `but no reducer was registered for it. ` +
        `Only thrown because your mode is "development".`
    );
  });
});
