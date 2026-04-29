/* src/hooks/useLoanDetail.js */
import { useState, useEffect } from 'react';
import { loanService } from '../services/loanService.js';
import toast from 'react-hot-toast';

export const useLoanDetail = (loanId) => {
  const [loan, setLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loanId) {
      setLoan(null);
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await loanService.getLoanById(loanId);
        if (response.success) {
          setLoan(response.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch loan details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [loanId]);

  return { loan, isLoading };
};