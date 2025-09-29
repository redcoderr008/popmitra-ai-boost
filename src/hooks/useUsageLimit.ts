import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const FREE_USAGE_LIMIT = 1;

export const useUsageLimit = () => {
  const { user } = useAuth();
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
    return !user && usageCount >= FREE_USAGE_LIMIT;
  };

  // Get remaining free generations
  const getRemainingGenerations = () => {
    if (user) return "unlimited";
    return Math.max(0, FREE_USAGE_LIMIT - usageCount);
  };

  // Initialize usage count
  useEffect(() => {
    if (!user) {
      setUsageCount(getAnonymousUsage());
    } else {
      setUsageCount(0); // Authenticated users don't have limits
    }
  }, [user]);

  return {
    usageCount,
    loading,
    incrementUsage,
    hasExceededLimit,
    getRemainingGenerations,
    isAuthenticated: !!user,
    freeLimit: FREE_USAGE_LIMIT,
  };
};