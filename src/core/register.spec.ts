import { register } from './register';

describe('register', () => {
  it('should set the reducer according to type', () => {
    const type = '[Action] type';
    const reducer = jest.fn();
    const reducers = {};

    register(reducers, type, reducer);

    expect((reducers as any)[type]).toBe(reducer);
  });

  it('should throw if type has already been registered', () => {
    const type = '[Action] type';
    const reducer = jest.fn();
    const reducers = { [type]: () => {} };

    const act = () => register(reducers, type, reducer);

    expect(act).toThrowError(
      `Store already has reducer for type (${type}). ` +
        `Choose another type when registering a reducer with '.on()'`
    );
  });
});
