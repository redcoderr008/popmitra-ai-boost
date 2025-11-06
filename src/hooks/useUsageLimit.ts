import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

const ANONYMOUS_USAGE_LIMIT = 1;
const FREE_PLAN_DAILY_LIMIT = 5;

export const useUsageLimit = () => {
  const { user } = useAuth();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'pro' | 'business'>('free');
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get daily usage key for free plan users
  const getDailyUsageKey = () => {
    const today = new Date().toISOString().split('T')[0];
    return `popmitra_usage_${today}`;
  };

  // Get usage count from localStorage
  const getStoredUsage = () => {
    const key = user ? getDailyUsageKey() : 'popmitra_usage_count';
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : 0;
  };

  // Set usage count in localStorage
  const setStoredUsage = (count: number) => {
    const key = user ? getDailyUsageKey() : 'popmitra_usage_count';
    localStorage.setItem(key, count.toString());
  };

  // Update usage count
  const incrementUsage = async () => {
    if (user && (subscriptionPlan === 'pro' || subscriptionPlan === 'business')) {
      // Pro/Business users have unlimited generations
      return;
    } else {
      // For anonymous users and free plan users, update localStorage
      const newCount = usageCount + 1;
      setStoredUsage(newCount);
      setUsageCount(newCount);
    }
  };

  // Check if user has exceeded free limit
  const hasExceededLimit = () => {
    if (!user) {
      // Anonymous users: 1 free generation
      return usageCount >= ANONYMOUS_USAGE_LIMIT;
    } else if (subscriptionPlan === 'pro' || subscriptionPlan === 'business') {
      // Pro/Business users: unlimited
      return false;
    } else if (subscriptionPlan === 'free') {
      // Free plan users: 5 generations per day
      return usageCount >= FREE_PLAN_DAILY_LIMIT;
    }
    return false;
  };

  // Get remaining free generations
  const getRemainingGenerations = () => {
    if (!user) {
      return Math.max(0, ANONYMOUS_USAGE_LIMIT - usageCount);
    } else if (subscriptionPlan === 'pro' || subscriptionPlan === 'business') {
      return "unlimited";
    } else if (subscriptionPlan === 'free') {
      return Math.max(0, FREE_PLAN_DAILY_LIMIT - usageCount);
    }
    return 0;
  };

  // Fetch user profile and subscription status
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('user_id', user.id)
          .single();

        if (!profileError && profileData) {
          setIsEmailVerified(profileData.email_verified);
        }

        // Fetch subscription data
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', user.id)
          .single();

        if (!subError && subData && subData.status === 'active') {
          setSubscriptionPlan(subData.plan as 'free' | 'pro' | 'business');
        } else {
          setSubscriptionPlan('free');
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Initialize usage count
  useEffect(() => {
    if (!user || subscriptionPlan === 'free') {
      setUsageCount(getStoredUsage());
    } else {
      setUsageCount(0); // Pro/Business users don't have limits
    }
  }, [user, subscriptionPlan]);

  return {
    usageCount,
    loading,
    incrementUsage,
    hasExceededLimit,
    getRemainingGenerations,
    isAuthenticated: !!user,
    isEmailVerified,
    subscriptionPlan,
    anonymousLimit: ANONYMOUS_USAGE_LIMIT,
    freePlanLimit: FREE_PLAN_DAILY_LIMIT,
  };
};