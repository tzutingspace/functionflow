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

export function replaceSpecialCharacters(inputString) {
  const regexForUrlEncodedChars = /[!#$&'()*+,/:;=?@[\]]/g; // url 的保留字元
  return inputString.replace(regexForUrlEncodedChars, '_');
}

export function ValidUsername(inputText) {
  const regexForUrlEncodedChars = /[!#$&'()*+,/:;=?@[\]]/g; // url 的保留字元

  // 如果有特殊字元, 回false
  if (regexForUrlEncodedChars.test(inputText)) {
    return false;
  }
  return true;
}

// 和後端相同
export function ValidateEmail(inputText) {
  // reference: https://www.w3schools.com/jsref/jsref_obj_regexp.asp
  // reference: https://www.geeksforgeeks.org/form-validation-using-html-javascript/
  const mailFormat = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/g;
  if (mailFormat.test(inputText)) {
    return true;
  }
  return false;
}

export function ValidatePassword(inputText) {
  // 用可顯示字元
  const pwdFormat = /^[\x20-\x7E]{6,16}$/;
  if (pwdFormat.test(inputText)) {
    return true;
  }
  return false;
}
