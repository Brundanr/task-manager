import { FeatureFlags, FeatureFlagsConfig, FeatureFlagKey } from '../types';
import { StorageService } from '../utills/storage';

const STORAGE_KEY = 'feature_flags';
const DEFAULT_FLAGS: FeatureFlags = {
  theme: true,
  language: true,
  search: true,
  sort: true,
  filter: true,
};

// Mock Feature Flags Service
// Simulates a remote feature flags service with local persistence
export class FeatureFlagsService {
  private static config: FeatureFlagsConfig | null = null;
  private static listeners: Set<(flags: FeatureFlags) => void> = new Set();

  // Initialize feature flags from storage or use defaults
  static async initialize(): Promise<FeatureFlags> {
    try {
      const stored = await StorageService.getItem<FeatureFlagsConfig>(STORAGE_KEY);
      
      if (stored && stored.flags) {
        // Merge with defaults to ensure all flags are present
        this.config = {
          flags: { ...DEFAULT_FLAGS, ...stored.flags },
          lastUpdated: stored.lastUpdated || new Date().toISOString(),
          version: stored.version || '1.0.0',
        };
      } else {
        // Use defaults on first run
        this.config = {
          flags: { ...DEFAULT_FLAGS },
          lastUpdated: new Date().toISOString(),
          version: '1.0.0',
        };
        await this.persist();
      }

      return this.config.flags;
    } catch (error) {
      console.error('Error initializing feature flags:', error);
      return { ...DEFAULT_FLAGS };
    }
  }

  // Get all feature flags
  static getFlags(): FeatureFlags {
    if (!this.config) {
      return { ...DEFAULT_FLAGS };
    }
    return { ...this.config.flags };
  }

  // Get a specific feature flag
  static getFlag(key: FeatureFlagKey): boolean {
    const flags = this.getFlags();
    return flags[key] ?? true; // Default to enabled if flag doesn't exist
  }

  // Set a feature flag value
  static async setFlag(key: FeatureFlagKey, value: boolean): Promise<void> {
    if (!this.config) {
      await this.initialize();
    }

    if (this.config) {
      this.config.flags[key] = value;
      this.config.lastUpdated = new Date().toISOString();
      await this.persist();
      this.notifyListeners();
    }
  }

  // Set multiple feature flags at once
  static async setFlags(flags: Partial<FeatureFlags>): Promise<void> {
    if (!this.config) {
      await this.initialize();
    }

    if (this.config) {
      this.config.flags = { ...this.config.flags, ...flags };
      this.config.lastUpdated = new Date().toISOString();
      await this.persist();
      this.notifyListeners();
    }
  }

  // Reset all flags to defaults
  static async resetToDefaults(): Promise<void> {
    this.config = {
      flags: { ...DEFAULT_FLAGS },
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
    };
    await this.persist();
    this.notifyListeners();
  }

  // Mock: Fetch flags from remote service (simulated)
  // In a real implementation, this would make an API call
  static async fetchFromRemote(): Promise<FeatureFlags> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock remote response - in production, this would be an API call
    const mockRemoteFlags: FeatureFlags = {
      theme: true,
      language: true,
      search: true,
      sort: true,
      filter: true,
    };

    if (this.config) {
      this.config.flags = mockRemoteFlags;
      this.config.lastUpdated = new Date().toISOString();
      await this.persist();
      this.notifyListeners();
    }

    return mockRemoteFlags;
  }

  // Subscribe to feature flags changes
  static subscribe(listener: (flags: FeatureFlags) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners of flag changes
  private static notifyListeners(): void {
    const flags = this.getFlags();
    this.listeners.forEach((listener) => {
      try {
        listener(flags);
      } catch (error) {
        console.error('Error in feature flags listener:', error);
      }
    });
  }

  // Persist flags to storage
  private static async persist(): Promise<void> {
    if (this.config) {
      try {
        await StorageService.setItem(STORAGE_KEY, this.config);
      } catch (error) {
        console.error('Error persisting feature flags:', error);
      }
    }
  }

  // Check if a feature is enabled
  static isEnabled(key: FeatureFlagKey): boolean {
    return this.getFlag(key);
  }
}

