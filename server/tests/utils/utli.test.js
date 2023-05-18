import {
  validInteger,
  validateEmail,
  validatePassword,
} from '../../utils/utils';

describe('Test validInteger function', () => {
  test('return true for normal case 0, 1, 999', () => {
    expect(validInteger(0)).toBe(true);
    expect(validInteger('0')).toBe(true);
    expect(validInteger(1)).toBe(true);
    expect(validInteger('1')).toBe(true);
    expect(validInteger(9999)).toBe(true);
    expect(validInteger('9999')).toBe(true);
  });

  test('return false for negative case -1, -999', () => {
    expect(validInteger(-1)).toBe(false);
    expect(validInteger('-1')).toBe(false);
    expect(validInteger(-999)).toBe(false);
    expect(validInteger('-999')).toBe(false);
  });

  test('return false for string', () => {
    expect(validInteger('abc')).toBe(false);
    expect(validInteger('zzz')).toBe(false);
  });
});

describe('Test validateEmail function', () => {
  test('return true for normal email case', () => {
    expect(validateEmail('test@hotmail.com')).toBe(true);
  });

  test('return false for invalidate email(without @ or .)', () => {
    expect(validateEmail('tz@qq')).toBe(false);
    expect(validateEmail('1232.com')).toBe(false);
  });
});

describe('validatePassword', () => {
  test('return true for normal case (6-16 char)', () => {
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('1234567890123456')).toBe(true);
  });

  test('return false for error case, char too short, or empty', () => {
    expect(validatePassword('1')).toBe(false);
    expect(validatePassword('')).toBe(false);
    expect(validatePassword('12345')).toBe(false);
  });

  test('return false for error case, char too long.', () => {
    expect(validatePassword('12345678901234567')).toBe(false);
  });

  test('return false for error case, not english or number ', () => {
    expect(validatePassword('中文')).toBe(false);
    expect(validatePassword('中文中文中文中文中文')).toBe(false);
  });
});
