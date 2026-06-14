import i18n from '../i18n';

// Returns the language-appropriate value for a bilingual field. When the app is
// in Hindi and a `<base>Hi` value exists, returns it; otherwise falls back to
// the base (English) value. e.g. pickLocalized(subject, 'name'),
// pickLocalized(chapter, 'title').
export function pickLocalized(obj, base) {
  if (!obj) return '';
  const hi = obj[`${base}Hi`];
  if (i18n.language === 'hi' && hi) return hi;
  return obj[base] || hi || '';
}
