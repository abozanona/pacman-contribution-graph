import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest/presets/js-with-ts-esm',
	testEnvironment: 'node',
	testMatch: ['**/?(*.)+(test).ts'],
	extensionsToTreatAsEsm: ['.ts'],
	coverageProvider: 'v8',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts', '!src/types.ts', '!src/index.ts'],
	coverageReporters: ['text', 'html'],
	coverageDirectory: 'coverage'
};

export default config;
