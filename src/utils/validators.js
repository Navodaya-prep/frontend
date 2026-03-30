export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

export function isValidName(name) {
  return name.trim().length >= 2;
}

export function formatPhone(phone) {
  return phone.replace(/\s/g, '').replace(/^(\+91)?/, '').trim();
}
