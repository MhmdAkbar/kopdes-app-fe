// src/components/organisms/LoginForm.jsx
import React, { useState } from 'react';
import { InputField } from '../molecules/InputField.jsx';
import { Button } from '../atoms/Button.jsx';
import Icon from '../atoms/Icon.jsx';

export const LoginForm = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ phoneNumber, password });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
      <div className="text-center mb-8 flex flex-col items-center">
        <Icon name="Leaf" className="text-4xl text-kop-main mb-3" size={44} />
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Koperasi Desa</h1>
        <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="phoneNumber"
          label="WhatsApp Number"
          icon="Phone"
          type="tel"
          inputMode="numeric"
          placeholder="e.g., 08123456789"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        
        <InputField
          id="password"
          label="Password"
          icon="Lock"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-4">
          <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  );
};