import { calculateNextExecutionTime } from '../../services/calculateTime';

describe('calculateNextExecutionTime', () => {
  const startDate = new Date('2023-05-01T00:00:00Z');
  const currentDate = new Date('2023-05-13T00:00:01Z');

  test('start time is in the future', () => {
    const futureDate = new Date(new Date() + 10000);
    const interval = 60;
    const result = calculateNextExecutionTime(
      'hourly',
      interval,
      futureDate,
      currentDate
    );
    expect(result).toEqual(futureDate);
  });
  test('custom 3 hour', () => {
    const interval = 60 * 60 * 3;
    const result = calculateNextExecutionTime(
      'hour',
      interval,
      startDate,
      currentDate
    );
    const expectedDate = new Date('2023-05-13T03:00:00Z');
    expect(result).toEqual(expectedDate);
  });
  test('custom 15 minute', () => {
    const interval = 60 * 15;
    const result = calculateNextExecutionTime(
      'minute',
      interval,
      startDate,
      currentDate
    );
    const expectedDate = new Date('2023-05-13T00:15:00Z');
    expect(result).toEqual(expectedDate);
  });
  test('hourly', () => {
    const interval = 60 * 60;
    const result = calculateNextExecutionTime(
      'hourly',
      interval,
      startDate,
      currentDate
    );
    const expectedDate = new Date('2023-05-13T01:00:00Z');
    expect(result).toEqual(expectedDate);
  });
  test('daily', () => {
    const interval = 60 * 60 * 24;
    const result = calculateNextExecutionTime(
      'daily',
      interval,
      startDate,
      currentDate
    );
    const expectedDate = new Date('2023-05-14T00:00:00Z');
    expect(result).toEqual(expectedDate);
  });
  test('weekly', () => {
    const interval = 60 * 60 * 24 * 7;
    const result = calculateNextExecutionTime(
      'weekly',
      interval,
      startDate,
      currentDate
    );
    const expectedDate = new Date('2023-05-15T00:00:00Z');
    expect(result).toEqual(expectedDate);
  });
  test('monthly', () => {
    const interval = null;
    const result = calculateNextExecutionTime(
      'monthly',
      interval,
      startDate,
      currentDate
    );
    const expectedDate = new Date('2023-06-01T00:00:00Z');
    expect(result).toEqual(expectedDate);
  });
  test('monthly for odd or even month', () => {
    const result = calculateNextExecutionTime(
      'monthly',
      null,
      new Date('2023-01-31T00:00:00Z'),
      new Date('2023-02-01T00:00:00Z')
    );
    const expectedDate = new Date('2023-02-28T00:00:00Z');
    expect(result).toEqual(expectedDate);
  });
  test('monthly and If the nextExecuteTime is already past the current time.', () => {
    const result = calculateNextExecutionTime(
      'monthly',
      null,
      new Date('2023-01-20T00:00:00Z'),
      new Date('2023-02-20T01:00:00Z')
    );
    const expectedDate = new Date('2023-03-20T00:00:00Z');
    expect(result).toEqual(expectedDate);
  });
});
