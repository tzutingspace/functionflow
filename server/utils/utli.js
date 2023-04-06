import moment from 'moment-timezone';

// 取得現在時間
export function getNowTime() {
  // const dt0 = moment.utc().tz('UTC');
  return moment.utc().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss');
}

export function calculateTime(inputTime, internalMinutes) {
  const interval = moment.duration(parseInt(internalMinutes), 'minutes');
  const executeTime = moment(inputTime);
  const nextTime = executeTime.clone().add(interval).format('YYYY-MM-DD HH:mm:ss');
  return nextTime;
}

// 確認為正整數(0-9)
export function vaildInterger(sting) {
  const regexNumber = /^[0-9]*$/;
  return regexNumber.test(sting);
}
