import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export const testEnvironment = 'node';
export const transform = {
  ...tsJestTransformCfg,
};
export const collectCoverage = true;
export const coverageDirectory = 'coverage';
