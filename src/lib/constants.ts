import { APPLIANCE_METADATA, CategoryConfig } from './applianceConfig';

export const CATEGORY_CONFIG: Record<string, any> = {
    ...APPLIANCE_METADATA
};

export type CategoryKey = keyof typeof APPLIANCE_METADATA;

export const PROHIBITED_KEYWORDS = ['sex', 'porn', 'gamble', 'drug', 'weapon'];
