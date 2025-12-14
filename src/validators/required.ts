import i18n from '../i18n';

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim() === '') {
    return i18n.t(`validation.${fieldName}Required`, { defaultValue: i18n.t('common.required') });
  }
  return undefined;
};
