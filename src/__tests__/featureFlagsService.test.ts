import { FeatureFlagsService } from '../services/featureFlagsService';
import { StorageService } from '../utills/storage';
import { FeatureFlags, FeatureFlagKey } from '../types';
import { StorageItemsEnum } from '../constants/StorageItemsEnum';

jest.mock('../utills/storage');

const StorageServiceMock = StorageService as jest.Mocked<typeof StorageService>;

describe('FeatureFlagsService', () => {
  const DEFAULT_FLAGS: FeatureFlags = {
    theme: true,
    language: true,
    search: true,
    sort: true,
    filter: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the static config
    (FeatureFlagsService as any).config = null;
    (FeatureFlagsService as any).listeners = new Set();
  });

  describe('initialize', () => {
    it('should initialize with defaults when no stored config exists', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      const flags = await FeatureFlagsService.initialize();

      expect(flags).toEqual(DEFAULT_FLAGS);
      expect(StorageServiceMock.getItem).toHaveBeenCalledWith(StorageItemsEnum.FEATURE_FLAGS);
      expect(StorageServiceMock.setItem).toHaveBeenCalledWith(
        StorageItemsEnum.FEATURE_FLAGS,
        expect.objectContaining({
          flags: DEFAULT_FLAGS,
          version: '1.0.0',
        })
      );
    });

    it('should load stored config and merge with defaults', async () => {
      const storedConfig = {
        flags: {
          theme: false,
          language: true,
          search: true,
          sort: false,
          filter: true,
        },
        lastUpdated: '2024-01-01T00:00:00.000Z',
        version: '1.0.0',
      };

      StorageServiceMock.getItem.mockResolvedValue(storedConfig);

      const flags = await FeatureFlagsService.initialize();

      expect(flags).toEqual({
        theme: false,
        language: true,
        search: true,
        sort: false,
        filter: true,
      });
      expect(StorageServiceMock.getItem).toHaveBeenCalledWith(StorageItemsEnum.FEATURE_FLAGS);
    });

    it('should merge stored flags with defaults to ensure all flags are present', async () => {
      const storedConfig = {
        flags: {
          theme: false,
          // Missing other flags
        },
        lastUpdated: '2024-01-01T00:00:00.000Z',
        version: '1.0.0',
      };

      StorageServiceMock.getItem.mockResolvedValue(storedConfig);

      const flags = await FeatureFlagsService.initialize();

      expect(flags).toEqual({
        theme: false,
        language: true, // From defaults
        search: true, // From defaults
        sort: true, // From defaults
        filter: true, // From defaults
      });
    });

    it('should return defaults on error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      StorageServiceMock.getItem.mockRejectedValue(new Error('Storage error'));

      const flags = await FeatureFlagsService.initialize();

      expect(flags).toEqual(DEFAULT_FLAGS);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getFlags', () => {
    it('should return default flags when config is not initialized', () => {
      const flags = FeatureFlagsService.getFlags();
      expect(flags).toEqual(DEFAULT_FLAGS);
    });

    it('should return current flags when config is initialized', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      const flags = FeatureFlagsService.getFlags();

      expect(flags).toEqual(DEFAULT_FLAGS);
    });

    it('should return a copy of flags, not the original', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      const flags1 = FeatureFlagsService.getFlags();
      const flags2 = FeatureFlagsService.getFlags();

      expect(flags1).toEqual(flags2);
      expect(flags1).not.toBe(flags2); // Different objects
    });
  });

  describe('getFlag', () => {
    it('should return default value when config is not initialized', () => {
      const value = FeatureFlagsService.getFlag('theme');
      expect(value).toBe(true);
    });

    it('should return flag value when config is initialized', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      const value = FeatureFlagsService.getFlag('theme');
      expect(value).toBe(true);
    });

    it('should return false for disabled flag', async () => {
      const storedConfig = {
        flags: {
          ...DEFAULT_FLAGS,
          theme: false,
        },
        lastUpdated: '2024-01-01T00:00:00.000Z',
        version: '1.0.0',
      };

      StorageServiceMock.getItem.mockResolvedValue(storedConfig);
      await FeatureFlagsService.initialize();

      const value = FeatureFlagsService.getFlag('theme');
      expect(value).toBe(false);
    });

    it('should default to true for non-existent flag', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      // @ts-expect-error - testing with invalid key
      const value = FeatureFlagsService.getFlag('nonExistent' as FeatureFlagKey);
      expect(value).toBe(true);
    });
  });

  describe('setFlag', () => {
    it('should initialize config if not already initialized', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.setFlag('theme', false);

      expect(StorageServiceMock.getItem).toHaveBeenCalled();
      expect(StorageServiceMock.setItem).toHaveBeenCalled();
    });

    it('should update flag value and persist', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      jest.clearAllMocks();

      await FeatureFlagsService.setFlag('theme', false);

      expect(StorageServiceMock.setItem).toHaveBeenCalledWith(
        StorageItemsEnum.FEATURE_FLAGS,
        expect.objectContaining({
          flags: expect.objectContaining({
            theme: false,
          }),
        })
      );

      const flagValue = FeatureFlagsService.getFlag('theme');
      expect(flagValue).toBe(false);
    });

    it('should notify listeners when flag is updated', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const listener = jest.fn();
      FeatureFlagsService.subscribe(listener);

      await FeatureFlagsService.setFlag('language', false);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          language: false,
        })
      );
    });

    it('should update lastUpdated timestamp', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      jest.clearAllMocks();

      const beforeTime = new Date().toISOString();
      await FeatureFlagsService.setFlag('search', false);
      const afterTime = new Date().toISOString();

      const setItemCall = StorageServiceMock.setItem.mock.calls[0];
      const persistedConfig = setItemCall[1] as any;
      const persistedTime = persistedConfig.lastUpdated;

      expect(new Date(persistedTime).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeTime).getTime()
      );
      expect(new Date(persistedTime).getTime()).toBeLessThanOrEqual(new Date(afterTime).getTime());
    });
  });

  describe('setFlags', () => {
    it('should initialize config if not already initialized', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.setFlags({ theme: false, language: false });

      expect(StorageServiceMock.getItem).toHaveBeenCalled();
      expect(StorageServiceMock.setItem).toHaveBeenCalled();
    });

    it('should update multiple flags at once', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      jest.clearAllMocks();

      await FeatureFlagsService.setFlags({
        theme: false,
        language: false,
        search: true,
      });

      expect(FeatureFlagsService.getFlag('theme')).toBe(false);
      expect(FeatureFlagsService.getFlag('language')).toBe(false);
      expect(FeatureFlagsService.getFlag('search')).toBe(true);
      expect(FeatureFlagsService.getFlag('sort')).toBe(true); // Unchanged
    });

    it('should merge with existing flags', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      await FeatureFlagsService.setFlag('theme', false);
      jest.clearAllMocks();

      await FeatureFlagsService.setFlags({ language: false });

      expect(FeatureFlagsService.getFlag('theme')).toBe(false); // Preserved
      expect(FeatureFlagsService.getFlag('language')).toBe(false); // Updated
    });

    it('should notify listeners when flags are updated', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const listener = jest.fn();
      FeatureFlagsService.subscribe(listener);

      await FeatureFlagsService.setFlags({ theme: false, search: false });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: false,
          search: false,
        })
      );
    });
  });

  describe('resetToDefaults', () => {
    it('should reset all flags to defaults', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      await FeatureFlagsService.setFlags({ theme: false, language: false });
      jest.clearAllMocks();

      await FeatureFlagsService.resetToDefaults();

      const flags = FeatureFlagsService.getFlags();
      expect(flags).toEqual(DEFAULT_FLAGS);
      expect(StorageServiceMock.setItem).toHaveBeenCalledWith(
        StorageItemsEnum.FEATURE_FLAGS,
        expect.objectContaining({
          flags: DEFAULT_FLAGS,
        })
      );
    });

    it('should notify listeners when resetting to defaults', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      await FeatureFlagsService.setFlags({ theme: false });

      const listener = jest.fn();
      FeatureFlagsService.subscribe(listener);

      await FeatureFlagsService.resetToDefaults();

      expect(listener).toHaveBeenCalledWith(DEFAULT_FLAGS);
    });
  });

  describe('fetchFromRemote', () => {
    it('should simulate network delay', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const startTime = Date.now();
      await FeatureFlagsService.fetchFromRemote();
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(450); // At least 450ms (allowing for some variance)
    });

    it('should update flags from remote and persist', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      jest.clearAllMocks();

      const flags = await FeatureFlagsService.fetchFromRemote();

      expect(flags).toEqual(DEFAULT_FLAGS);
      expect(StorageServiceMock.setItem).toHaveBeenCalled();
    });

    it('should notify listeners after fetching from remote', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const listener = jest.fn();
      FeatureFlagsService.subscribe(listener);

      await FeatureFlagsService.fetchFromRemote();

      expect(listener).toHaveBeenCalledWith(DEFAULT_FLAGS);
    });

    it('should return mock remote flags', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const flags = await FeatureFlagsService.fetchFromRemote();

      expect(flags).toEqual({
        theme: true,
        language: true,
        search: true,
        sort: true,
        filter: true,
      });
    });
  });

  describe('subscribe', () => {
    it('should add listener and return unsubscribe function', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const listener = jest.fn();
      const unsubscribe = FeatureFlagsService.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');

      await FeatureFlagsService.setFlag('theme', false);
      expect(listener).toHaveBeenCalled();

      unsubscribe();
      jest.clearAllMocks();

      await FeatureFlagsService.setFlag('language', false);
      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const listener1 = jest.fn();
      const listener2 = jest.fn();

      FeatureFlagsService.subscribe(listener1);
      FeatureFlagsService.subscribe(listener2);

      await FeatureFlagsService.setFlag('theme', false);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should handle listener errors gracefully', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const goodListener = jest.fn();

      FeatureFlagsService.subscribe(errorListener);
      FeatureFlagsService.subscribe(goodListener);

      await FeatureFlagsService.setFlag('theme', false);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in feature flags listener:',
        expect.any(Error)
      );
      expect(goodListener).toHaveBeenCalled(); // Other listeners should still work
      consoleSpy.mockRestore();
    });
  });

  describe('isEnabled', () => {
    it('should return true for enabled flag', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      expect(FeatureFlagsService.isEnabled('theme')).toBe(true);
    });

    it('should return false for disabled flag', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();
      await FeatureFlagsService.setFlag('theme', false);

      expect(FeatureFlagsService.isEnabled('theme')).toBe(false);
    });

    it('should be equivalent to getFlag', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const flagKey: FeatureFlagKey = 'language';
      expect(FeatureFlagsService.isEnabled(flagKey)).toBe(FeatureFlagsService.getFlag(flagKey));
    });
  });

  describe('persist error handling', () => {
    it('should handle persist errors gracefully in setFlag', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      StorageServiceMock.setItem.mockRejectedValueOnce(new Error('Storage error'));

      await FeatureFlagsService.setFlag('theme', false);

      expect(consoleSpy).toHaveBeenCalledWith('Error persisting feature flags:', expect.any(Error));
      // Flag should still be updated in memory
      expect(FeatureFlagsService.getFlag('theme')).toBe(false);
      consoleSpy.mockRestore();
    });

    it('should handle persist errors gracefully in setFlags', async () => {
      StorageServiceMock.getItem.mockResolvedValue(null);
      StorageServiceMock.setItem.mockResolvedValue(undefined);

      await FeatureFlagsService.initialize();

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      StorageServiceMock.setItem.mockRejectedValueOnce(new Error('Storage error'));

      await FeatureFlagsService.setFlags({ theme: false });

      expect(consoleSpy).toHaveBeenCalledWith('Error persisting feature flags:', expect.any(Error));
      expect(FeatureFlagsService.getFlag('theme')).toBe(false);
      consoleSpy.mockRestore();
    });
  });
});
