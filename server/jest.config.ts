/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  extensionsToTreatAsEsm: [".ts"],
  clearMocks: true,
  modulePaths: ["<rootDir>"],
  moduleFileExtensions: ["js", "ts", "json"],
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  resolver: "jest-ts-webcompat-resolver",
  verbose: true,
};

export default config;
