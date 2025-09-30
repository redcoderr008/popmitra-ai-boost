import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

const FREE_USAGE_LIMIT = 1;
const UNVERIFIED_USAGE_LIMIT = 3;

export const useUsageLimit = () => {
  const { user } = useAuth();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get usage count for anonymous users from localStorage
  const getAnonymousUsage = () => {
    const stored = localStorage.getItem('popmitra_usage_count');
    return stored ? parseInt(stored, 10) : 0;
  };

  // Set usage count for anonymous users in localStorage
  const setAnonymousUsage = (count: number) => {
    localStorage.setItem('popmitra_usage_count', count.toString());
  };

  // Update usage count
  const incrementUsage = async () => {
    if (user) {
      // For authenticated users, we don't need to track usage
      // since they have unlimited generations
      return;
    } else {
      // For anonymous users, update localStorage
      const newCount = usageCount + 1;
      setAnonymousUsage(newCount);
      setUsageCount(newCount);
    }
  };

  // Check if user has exceeded free limit
  const hasExceededLimit = () => {
    if (!user) {
      // Anonymous users: 1 free generation
      return usageCount >= FREE_USAGE_LIMIT;
    } else if (!isEmailVerified) {
      // Unverified users: 3 generations
      return usageCount >= UNVERIFIED_USAGE_LIMIT;
    }
    // Verified users: unlimited
    return false;
  };

  // Get remaining free generations
  const getRemainingGenerations = () => {
    if (user && isEmailVerified) {
      return "unlimited";
    } else if (user && !isEmailVerified) {
      return Math.max(0, UNVERIFIED_USAGE_LIMIT - usageCount);
    }
    return Math.max(0, FREE_USAGE_LIMIT - usageCount);
  };

  // Fetch email verification status
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          setIsEmailVerified(data.email_verified);
        }
      }
    };

    fetchVerificationStatus();
  }, [user]);

  // Initialize usage count
  useEffect(() => {
    if (!user) {
      setUsageCount(getAnonymousUsage());
    } else if (!isEmailVerified) {
      // Unverified users track usage in localStorage
      setUsageCount(getAnonymousUsage());
    } else {
      setUsageCount(0); // Verified users don't have limits
    }
  }, [user, isEmailVerified]);

  return {
    usageCount,
    loading,
    incrementUsage,
    hasExceededLimit,
    getRemainingGenerations,
    isAuthenticated: !!user,
    isEmailVerified,
    freeLimit: FREE_USAGE_LIMIT,
    unverifiedLimit: UNVERIFIED_USAGE_LIMIT,
  };
};