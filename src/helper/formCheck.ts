const getNrLength = (number?: number) => number && number.toString().length;

export const isPlz = (plz: number) => {
  const isNum = /^\d+$/;
  return getNrLength(plz) === 5 && isNum.test(plz.toString());
};

export const isURL = (str: string) => {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
};

export const isEmail = (email?: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email && re.test(email.toLowerCase());
};

export const isPhone = (phone: string) => {
  const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]{8,14}$/g;
  return phone && re.test(phone.toLowerCase());
};

export const isStreetWithNr = (street: string) => {
  const re = /\d/;
  return street && re.test(street.toLocaleLowerCase());
};

export const noSpecialCharacters = (text: string) => !!text;
// wenn buchstaben vorhanden muss auch text vorhanden sein nicht einzelnt
