export type FeatureFlagKey = 'theme' | 'language' | 'search' | 'sort' | 'filter';

export interface FeatureFlags {
  theme: boolean;
  language: boolean;
  search: boolean;
  sort: boolean;
  filter: boolean;
}

export interface FeatureFlagsConfig {
  flags: FeatureFlags;
  lastUpdated: string;
  version: string;
}
