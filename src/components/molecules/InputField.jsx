// src/components/molecules/InputField.jsx
import React, { useState } from 'react';
import { Label } from '../atoms/Label.jsx';
import { Input } from '../atoms/Input.jsx';
import Icon from '../atoms/Icon.jsx';

export const InputField = ({ id, label, icon, type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordInput = type === 'password';
  const currentType = isPasswordInput ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 flex items-center text-slate-400 pointer-events-none">
            <Icon name={icon} size={18} />
          </span>
        )}
        
        <Input 
          id={id} 
          type={currentType} 
          hasIcon={!!icon} 
          className={isPasswordInput ? 'pr-10' : 'pr-4'} 
          {...props} 
        />
        
        {isPasswordInput && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors outline-none rounded-md focus-visible:ring-2 focus-visible:ring-kop-main/50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
          </button>
        )}
      </div>
    </div>
  );
};