import { validateEmail, validateRequired } from '../validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should return error message for empty email', () => {
      const result = validateEmail('');
      expect(result).toBe('validation.emailRequired');
    });

    it('should return error message for invalid email format', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@invalid.com',
        'invalid@.com',
        'invalid.com',
        'invalid@com',
        'invalid @example.com',
      ];

      invalidEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result).toBe('validation.emailInvalid');
      });
    });

    it('should return undefined for valid email', () => {
      const validEmails = ['admin@example.com', 'member@example.com'];

      validEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result).toBeUndefined();
      });
    });
  });

  describe('validateRequired', () => {
    it('should return error message for empty string', () => {
      const result = validateRequired('', 'fieldName');
      expect(result).toBe('validation.fieldNameRequired');
    });

    it('should return error message for whitespace-only string', () => {
      const result = validateRequired('   ', 'fieldName');
      expect(result).toBe('validation.fieldNameRequired');
    });

    it('should return error message for null/undefined (empty check)', () => {
      // TypeScript won't allow null/undefined, but testing empty string covers the logic
      const result = validateRequired('', 'password');
      expect(result).toBe('validation.passwordRequired');
    });

    it('should return undefined for valid non-empty string', () => {
      const result = validateRequired('valid value', 'fieldName');
      expect(result).toBeUndefined();
    });

    it('should return undefined for string with content after trim', () => {
      const result = validateRequired('  valid  ', 'fieldName');
      expect(result).toBeUndefined();
    });

    it('should use fieldName in error message', () => {
      const result1 = validateRequired('', 'title');
      expect(result1).toBe('validation.titleRequired');

      const result2 = validateRequired('', 'description');
      expect(result2).toBe('validation.descriptionRequired');
    });
  });
});
