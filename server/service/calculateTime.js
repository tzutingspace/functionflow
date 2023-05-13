import date from 'date-and-time';

export const calculateNextExecutionTime = (triggerInfo) => {
  console.debug('calculate next execution time');
  let triggerIntervalSeconds;
  let nextExecuteTime;

  if (triggerInfo.triggerName === 'custom') {
    if (triggerInfo.intervalType === 'hour') {
      triggerIntervalSeconds = triggerInfo.customInterval * 60 * 60;
      nextExecuteTime = date.addHours(
        triggerInfo.startTime,
        parseInt(triggerInfo.customInterval, 10)
      );
    } else if (triggerInfo.intervalType === 'minute') {
      triggerIntervalSeconds = triggerInfo.customInterval * 60;
      nextExecuteTime = date.addMinutes(
        triggerInfo.startTime,
        parseInt(triggerInfo.customInterval, 10)
      );
    }
  } else if (triggerInfo.triggerName === 'daily') {
    triggerIntervalSeconds = 86400;
    nextExecuteTime = date.addDays(triggerInfo.startTime, 1);
  } else if (triggerInfo.triggerName === 'weekly') {
    triggerIntervalSeconds = 86400 * 7;
    nextExecuteTime = date.addDays(triggerInfo.startTime, 7);
  } else if (triggerInfo.triggerName === 'monthly') {
    nextExecuteTime = date.addMonths(triggerInfo.startTime, 1);
  }
  return { triggerIntervalSeconds, nextExecuteTime };
};
