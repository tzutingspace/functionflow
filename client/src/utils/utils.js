export function formatDate(dateString) {
  //來源都是UTC >> 改為zh-TW
  // console.log('來源時間', dateString);
  const formattedDate = new Date(dateString).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  });

  // console.log('時間處理結果', formattedDate);

  const formattedDateString = formattedDate.replace(/\//g, '-');

  return formattedDateString;
  // const [date, time] = formattedDate.split(', ');
  // const [month, day, year] = date.split('/');
  // const [hour, minute, second] = time.split(':');
  // const formattedDateString = `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  // return formattedDateString;
}

export function formatInputDate(dateString) {
  const formattedDate = new Date(dateString).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  });

  const formattedDateString = formattedDate.replace(/\//g, '-');
  return formattedDateString;
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
