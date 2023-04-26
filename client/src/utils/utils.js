export function formatDate(dateString) {
  const formattedDate = new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  });

  const [date, time] = formattedDate.split(', ');
  const [month, day, year] = date.split('/');
  const [hour, minute, second] = time.split(':');
  const formattedDateString = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

  return formattedDateString;
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
