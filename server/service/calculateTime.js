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
  startTime
) => {
  console.debug('@calculate next execution time');
  console.debug('1.scheduleType', '2.triggerIntervalSeconds', '3.startTime');
  console.debug(scheduleType, triggerIntervalSeconds, startTime);

  const currentDate = new Date();

  if (startTime > currentDate) {
    console.log('startTime 為未來時間, 表示下次執行時間是starttime');
    return startTime;
  }

  if (scheduleType === 'monthly') {
    console.log('startTime 為過去時間, 但為monthly');
    const monthDiff = startTime.getMonth() - currentDate.getMonth() || 1;
    let nextExecuteTime = date.addMonths(startTime, monthDiff);
    // 如果 nextExecuteTime 已過當下時間,
    if (nextExecuteTime < currentDate) {
      nextExecuteTime = date.addMonths(nextExecuteTime, 1);
    }
    return nextExecuteTime;
  }

  console.log('startTime 為過去時間, 計算下次執行時間');
  console.log('startime:', startTime, 'currentDate:', currentDate);
  console.log('差距(s)', (currentDate - startTime) / 1000);
  const timeDiffIntervalCount = Math.ceil(
    (currentDate - startTime) / 1000 / triggerIntervalSeconds
  );
  console.log('次數(interval)', timeDiffIntervalCount);
  return date.addSeconds(
    startTime,
    timeDiffIntervalCount * triggerIntervalSeconds
  );
};
