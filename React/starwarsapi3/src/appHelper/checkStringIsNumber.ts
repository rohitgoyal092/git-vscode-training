export const checkStringIsNumber = (txt: string): boolean => {
  if (txt.length < 1) {
    return true;
  }
  let validRegex = /^[0-9]+$/;
  if (txt.match(validRegex)) {
    return true;
  }
  return false;
};
