"use client"

import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  onInputChange?: (value: string) => void;
}

export function LabelInput({
  label,
  className = '',
  labelClassName = '',
  inputClassName = '',
  onInputChange,
  ...inputProps
}: LabelInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputProps.onChange?.(e);
    
    onInputChange?.(e.target.value);
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <Label 
        htmlFor={inputProps.id || inputProps.name} 
        className={`text-sm ${labelClassName}`}
      >
        {label}
      </Label>
      <Input
        {...inputProps}
        onChange={handleChange}
        className={`text-sm sm:text-base ${inputClassName}`}
      />
    </div>
  );
}