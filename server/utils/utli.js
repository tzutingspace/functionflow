// 確認為正整數(0-9)
export function vaildInterger(sting) {
  const regexNumber = /^[0-9]*$/;
  return regexNumber.test(sting);
}
