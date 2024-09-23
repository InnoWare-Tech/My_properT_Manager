export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/tests/**/*.test.ts"], // Match test files in `tests` folder
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
