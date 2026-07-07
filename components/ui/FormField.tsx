"use client";

import { useState, useCallback, forwardRef } from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  validate?: (value: string) => string | null;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    { label, error: externalError, hint, validate, required, className = "", onBlur, ...props },
    ref
  ) {
    const [touched, setTouched] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    const error = externalError || (touched ? internalError : null);

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        const value = e.target.value;

        // Required validation
        if (required && !value.trim()) {
          setInternalError("この項目は必須です");
        } else if (validate) {
          // Custom validation
          const validationError = validate(value);
          setInternalError(validationError);
        } else {
          setInternalError(null);
        }

        onBlur?.(e);
      },
      [required, validate, onBlur]
    );

    return (
      <div className="form-group">
        <label htmlFor={props.id} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`input ${error ? "input-error" : ""} ${className}`}
          required={required}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${props.id}-hint`} className="text-xs text-gray-500 mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  validate?: (value: string) => string | null;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(
    { label, error: externalError, hint, validate, required, className = "", onBlur, ...props },
    ref
  ) {
    const [touched, setTouched] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    const error = externalError || (touched ? internalError : null);

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setTouched(true);
        const value = e.target.value;

        if (required && !value.trim()) {
          setInternalError("この項目は必須です");
        } else if (validate) {
          const validationError = validate(value);
          setInternalError(validationError);
        } else {
          setInternalError(null);
        }

        onBlur?.(e);
      },
      [required, validate, onBlur]
    );

    return (
      <div className="form-group">
        <label htmlFor={props.id} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          className={`input resize-none ${error ? "input-error" : ""} ${className}`}
          required={required}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${props.id}-hint`} className="text-xs text-gray-500 mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    { label, error: externalError, hint, options, placeholder, required, className = "", onBlur, ...props },
    ref
  ) {
    const [touched, setTouched] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    const error = externalError || (touched ? internalError : null);

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLSelectElement>) => {
        setTouched(true);
        const value = e.target.value;

        if (required && !value) {
          setInternalError("この項目は必須です");
        } else {
          setInternalError(null);
        }

        onBlur?.(e);
      },
      [required, onBlur]
    );

    return (
      <div className="form-group">
        <label htmlFor={props.id} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          ref={ref}
          className={`input ${error ? "input-error" : ""} ${className}`}
          required={required}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${props.id}-hint`} className="text-xs text-gray-500 mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
