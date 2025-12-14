import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FeatureFlags, FeatureFlagKey } from '../types';
import { FeatureFlagsService } from '../services/featureFlagsService';

interface FeatureFlagsContextProps {
  flags: FeatureFlags;
  isEnabled: (key: FeatureFlagKey) => boolean;
  setFlag: (key: FeatureFlagKey, value: boolean) => Promise<void>;
  setFlags: (flags: Partial<FeatureFlags>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refreshFromRemote: () => Promise<void>;
  loading: boolean;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextProps>({
  flags: {
    theme: true,
    language: true,
    search: true,
    sort: true,
    filter: true,
  },
  isEnabled: () => true,
  setFlag: async () => {},
  setFlags: async () => {},
  resetToDefaults: async () => {},
  refreshFromRemote: async () => {},
  loading: false,
});

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlagsState] = useState<FeatureFlags>({
    theme: true,
    language: true,
    search: true,
    sort: true,
    filter: true,
  });
  const [loading, setLoading] = useState(true);

  // Initialize feature flags
  useEffect(() => {
    const initializeFlags = async () => {
      setLoading(true);
      try {
        const initialFlags = await FeatureFlagsService.initialize();
        setFlagsState(initialFlags);
      } catch (error) {
        console.error('Error initializing feature flags:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeFlags();

    // Subscribe to flag changes
    const unsubscribe = FeatureFlagsService.subscribe((newFlags) => {
      setFlagsState(newFlags);
    });

    return unsubscribe;
  }, []);

  const isEnabled = useCallback(
    (key: FeatureFlagKey): boolean => {
      return FeatureFlagsService.isEnabled(key);
    },
    []
  );

  const setFlag = useCallback(async (key: FeatureFlagKey, value: boolean) => {
    await FeatureFlagsService.setFlag(key, value);
    // State will be updated via subscription
  }, []);

  const setFlags = useCallback(async (newFlags: Partial<FeatureFlags>) => {
    await FeatureFlagsService.setFlags(newFlags);
    // State will be updated via subscription
  }, []);

  const resetToDefaults = useCallback(async () => {
    await FeatureFlagsService.resetToDefaults();
    // State will be updated via subscription
  }, []);

  const refreshFromRemote = useCallback(async () => {
    setLoading(true);
    try {
      await FeatureFlagsService.fetchFromRemote();
      // State will be updated via subscription
    } catch (error) {
      console.error('Error refreshing feature flags from remote:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: FeatureFlagsContextProps = {
    flags,
    isEnabled,
    setFlag,
    setFlags,
    resetToDefaults,
    refreshFromRemote,
    loading,
  };

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
};

export const useFeatureFlags = () => useContext(FeatureFlagsContext);

