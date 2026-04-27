// src/hooks/useLoans.js
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loanService } from '../services/loanService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

export const useLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const fetchLoans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = isAdmin 
        ? await loanService.getAllLoans() 
        : await loanService.getMyLoans();
        
      if (response.success) {
        setLoans(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to retrieve loan records.');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleApplyLoan = async (payload, onSuccess) => {
    setIsProcessing(true);
    const toastId = toast.loading('Submitting application...');
    try {
      await loanService.submitLoan(payload);
      toast.success('Application submitted successfully!', { id: toastId });
      fetchLoans();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewLoan = async (loanId, payload, onSuccess) => {
    setIsProcessing(true);
    const toastId = toast.loading('Updating loan status...');
    try {
      await loanService.reviewLoan(loanId, payload);
      toast.success('Loan reviewed successfully!', { id: toastId });
      fetchLoans();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Review failed.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoanDecision = async (loanId, decision, onSuccess) => {
    setIsProcessing(true);
    const toastId = toast.loading('Processing decision...');
    const idempotencyKey = uuidv4(); 
    
    try {
      await loanService.decideLoan(loanId, { status: decision }, idempotencyKey);
      toast.success(`Loan ${decision.toLowerCase()} successfully!`, { id: toastId });
      fetchLoans();
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Decision processing failed.';
      if (errorMsg.includes('Duplicate request')) {
        toast.success('Decision already processed!', { id: toastId });
        fetchLoans();
        if (onSuccess) onSuccess();
      } else {
        toast.error(errorMsg, { id: toastId });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    loans,
    isLoading,
    isProcessing,
    isAdmin,
    fetchLoans,
    handleApplyLoan,
    handleReviewLoan,
    handleLoanDecision
  };
};