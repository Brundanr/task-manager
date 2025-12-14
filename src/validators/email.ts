import i18n from '../i18n';

export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return i18n.t('validation.emailRequired');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return i18n.t('validation.emailInvalid');
  }
  return undefined;
};
