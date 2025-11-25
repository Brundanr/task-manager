import { useState, useCallback } from 'react';

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormField {
  value: string;
  error?: string;
}

export const useFormValidation = <T extends Record<string, string>>(
  initialValues: T,
  validate: (values: T) => ValidationErrors
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate(values);
    if (validationErrors[field as string]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field as string] }));
    }
  }, [values, validate]);

  const validateForm = useCallback((): boolean => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );
    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setValues,
  };
};

// Validation helpers
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  return undefined;
};

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim() === '') {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
  }
  return undefined;
};

