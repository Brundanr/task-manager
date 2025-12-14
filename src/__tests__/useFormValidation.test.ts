import { renderHook, act } from '@testing-library/react-native';
import { useFormValidation, ValidationErrors } from '../hooks/useFormValidation';

describe('useFormValidation', () => {
    const initialValues = { email: '', password: '' };
    const mockValidate = jest.fn((values: typeof initialValues): ValidationErrors => {
        const errors: ValidationErrors = {};
        if (!values.email) {
            errors.email = 'Email is required';
        }
        if (!values.password) {
            errors.password = 'Password is required';
        }
        return errors;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        it('should initialize with provided values', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            expect(result.current.values).toEqual(initialValues);
            expect(result.current.errors).toEqual({});
            expect(result.current.touched).toEqual({});
        });
    });

    describe('handleChange', () => {
        it('should update field value', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.handleChange('email', 'test@example.com');
            });

            expect(result.current.values.email).toBe('test@example.com');
        });

        it('should clear error when user starts typing', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            // First, create an error
            act(() => {
                result.current.validateForm();
            });
            expect(result.current.errors.email).toBe('Email is required');

            // Then, clear it by typing
            act(() => {
                result.current.handleChange('email', 'test@example.com');
            });

            expect(result.current.errors.email).toBeUndefined();
        });

        it('should not clear errors for other fields', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.validateForm();
            });

            act(() => {
                result.current.handleChange('email', 'test@example.com');
            });

            expect(result.current.errors.email).toBeUndefined();
            expect(result.current.errors.password).toBe('Password is required');
        });
    });

    describe('handleBlur', () => {
        it('should mark field as touched', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.handleBlur('email');
            });

            expect(result.current.touched.email).toBe(true);
        });

        it('should validate field on blur and set error if invalid', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.handleBlur('email');
            });

            expect(result.current.touched.email).toBe(true);
            expect(result.current.errors.email).toBe('Email is required');
        });

        it('should not set error if field is valid', () => {
            const { result } = renderHook(() =>
                useFormValidation({ email: 'test@example.com', password: '' }, mockValidate)
            );

            act(() => {
                result.current.handleBlur('email');
            });

            expect(result.current.touched.email).toBe(true);
            expect(result.current.errors.email).toBeUndefined();
        });
    });

    describe('validateForm', () => {
        it('should return true when form is valid', () => {
            const { result } = renderHook(() =>
                useFormValidation(
                    { email: 'test@example.com', password: 'password123' },
                    mockValidate
                )
            );

            let isValid: boolean;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid!).toBe(true);
            expect(result.current.errors).toEqual({});
        });

        it('should return false when form is invalid', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            let isValid: boolean;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid!).toBe(false);
            expect(result.current.errors.email).toBe('Email is required');
            expect(result.current.errors.password).toBe('Password is required');
        });

        it('should mark all fields as touched', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.validateForm();
            });

            expect(result.current.touched.email).toBe(true);
            expect(result.current.touched.password).toBe(true);
        });

        it('should set all validation errors', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.validateForm();
            });

            expect(result.current.errors).toEqual({
                email: 'Email is required',
                password: 'Password is required',
            });
        });
    });

    describe('reset', () => {
        it('should reset values to initial values', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.handleChange('email', 'test@example.com');
                result.current.handleChange('password', 'password123');
            });

            act(() => {
                result.current.reset();
            });

            expect(result.current.values).toEqual(initialValues);
        });

        it('should clear all errors', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.validateForm();
            });

            act(() => {
                result.current.reset();
            });

            expect(result.current.errors).toEqual({});
        });

        it('should clear all touched fields', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.handleBlur('email');
                result.current.handleBlur('password');
            });

            act(() => {
                result.current.reset();
            });

            expect(result.current.touched).toEqual({});
        });
    });

    describe('setValues', () => {
        it('should update values directly', () => {
            const { result } = renderHook(() =>
                useFormValidation(initialValues, mockValidate)
            );

            act(() => {
                result.current.setValues({ email: 'new@example.com', password: 'newpass' });
            });

            expect(result.current.values).toEqual({
                email: 'new@example.com',
                password: 'newpass',
            });
        });
    });
});

