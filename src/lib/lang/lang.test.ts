// lib/lang/lang.test.ts
// Unit tests for language translation.

import { beforeEach, describe, expect, it, vi } from 'vitest';

import t from './lang';
import i18n from '../../config/langConfig';

vi.mock('../../config/langConfig', () => ({
    default: {
        t: vi.fn(),
    },
}));

describe('t()', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns the translation from i18n', () => {
        vi.mocked(i18n.t).mockReturnValue('Adjust settings');

        const result = t('adjust');

        expect(result).toBe('Adjust settings');
        expect(i18n.t).toHaveBeenCalledWith('adjust', undefined);
    });
});