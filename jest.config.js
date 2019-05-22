module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "\\.xml$": "jest-raw-loader"
  }
};