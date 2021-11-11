import { isDeepEqual, isString, isNumber } from '@/utils/is';

describe('Utils.Is', () => {
  it('isDeepEqual', done => {
    const a = { a: 1, b: 2 };
    const b = { a: 1, b: 2 };
    const c = { a: 1, b: 2, c: 3 };
    expect(isDeepEqual(a, b)).toBe(true);
    expect(isDeepEqual(a, c)).toBe(false);
    done();
  });

  it('isType', done => {
    expect(isString('string')).toBe(true);
    expect(isNumber(123)).toBe(true);
    done();
  });
});
