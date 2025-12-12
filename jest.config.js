module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],

  collectCoverage: true,

  collectCoverageFrom: [
    "src/**/*.{ts,js}",

    // ❌ Exclusions coverage
    "!src/index.ts",
    "!src/app.ts",
    "!src/swagger.ts",

    "!src/controllers/**",
    "!src/routes/**",
    "!src/config/**",
    "!src/middleware/**",
    "!src/utils/**",
    "!src/models/**",
  ],
  coveragePathIgnorePatterns: ["/node_modules/",
    "/dist/"

  ],
};
