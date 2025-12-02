import { describe, it, expect } from 'vitest';
import { version } from '@lib/utilities/version.js';
import packageJson from '../../../package.json';

describe('version utility', () => {
	it('should export a version', () => {
		expect(version).toBeDefined();
	});

	it('should be a string', () => {
		expect(typeof version).toBe('string');
	});

	it('should match semantic versioning format', () => {
		// Matches X.Y.Z where X, Y, Z are numbers
		const semverPattern = /^\d+\.\d+\.\d+$/;
		expect(version).toMatch(semverPattern);
	});

	it('should match the version in package.json', () => {
		expect(version).toBe(packageJson.version);
	});
});
