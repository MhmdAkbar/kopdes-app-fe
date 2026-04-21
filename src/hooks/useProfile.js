// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userService } from '../services/userService.js';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '', nik: '', birthPlace: '', birthDate: '', gender: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        nik: user.nik || '',
        birthPlace: user.birthPlace || '',
        birthDate: user.birthDate || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Saving profile updates...');

    try {
      const response = await userService.updateProfile(formData);
      if (response.success) {
        setUser(response.data);
        toast.success('Profile successfully updated.', { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, handleChange, handleSubmit };
};