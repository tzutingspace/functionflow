import {
  validInteger,
  validateEmail,
  validatePassword,
} from '../../utils/utils';

describe('validInteger', () => {
  test('normal case 0, 1, 999', () => {
    expect(validInteger(0)).toBe(true);
    expect(validInteger('0')).toBe(true);
    expect(validInteger(1)).toBe(true);
    expect(validInteger('1')).toBe(true);
    expect(validInteger(9999)).toBe(true);
    expect(validInteger('9999')).toBe(true);
  });

  test('negative case -1, -999', () => {
    expect(validInteger(-1)).toBe(false);
    expect(validInteger('-1')).toBe(false);
    expect(validInteger(-999)).toBe(false);
    expect(validInteger('-999')).toBe(false);
  });

  test('string', () => {
    expect(validInteger('abc')).toBe(false);
    expect(validInteger('zzz')).toBe(false);
  });
});

describe('validateEmail', () => {
  test('normal case', () => {
    expect(validateEmail('tzuting@hotmail.com')).toBe(true);
  });

  test('error case', () => {
    expect(validateEmail('tz@qq')).toBe(false);
    expect(validateEmail('1232.com')).toBe(false);
  });
});

describe('validatePassword', () => {
  test('normal case', () => {
    expect(validatePassword('123456')).toBe(true);
  });

  test('error case, char too short', () => {
    expect(validatePassword('1')).toBe(false);
    expect(validatePassword('')).toBe(false);
    expect(validatePassword('12345')).toBe(false);
  });

  test('error case, not english or number ', () => {
    expect(validatePassword('中文')).toBe(false);
    expect(validatePassword('中文中文中文中文中文')).toBe(false);
  });
});
