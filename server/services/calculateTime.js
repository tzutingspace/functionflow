import date from 'date-and-time';
import moment from 'moment-timezone';

export const triggerIntervalConvert = {
  minute: 60,
  hour: 60 * 60,
  daily: 60 * 60 * 24,
  weekly: 60 * 60 * 24 * 7,
  monthly: null,
};

export const calculateNextExecutionTime = (
  scheduleType,
  triggerIntervalSeconds,
  startTime,
  currentDate = new Date()
) => {
  // console.debug('@calculate next execution time');
  console.debug('scheduleType', scheduleType);
  console.debug('triggerIntervalSeconds', triggerIntervalSeconds);
  console.debug('startTime', startTime);
  console.debug('currentDate', currentDate);

  // The startTime is a future time, the next scheduled execution time is the start time.
  if (startTime > currentDate) {
    return startTime;
  }

  // The startTime is in the past, and type is "monthly".
  if (scheduleType === 'monthly') {
    const monthDiff = currentDate.getMonth() - startTime.getMonth() || 1;
    let nextExecuteTime = moment(startTime).add(monthDiff, 'M').toDate();
    // let nextExecuteTime = date.addMonths(startTime, monthDiff);
    // console.debug('@startTime is past and is monthly');
    // console.debug('monthDiff', monthDiff);
    // console.debug('currentDate', currentDate);
    // console.debug('nextExecuteTime', nextExecuteTime);

    // If the nextExecuteTime is already past the current time.
    if (nextExecuteTime < currentDate) {
      // nextExecuteTime = date.addMonths(nextExecuteTime, 1);
      nextExecuteTime = moment(nextExecuteTime).add(1, 'M').toDate();
    }
    return nextExecuteTime;
  }

  const timeDiffIntervalCount = Math.ceil(
    (currentDate - startTime) / 1000 / triggerIntervalSeconds
  );

  return date.addSeconds(
    startTime,
    timeDiffIntervalCount * triggerIntervalSeconds
  );
};
