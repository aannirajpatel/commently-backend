module.exports = {
  root: true,
  env: {
    es2020: true, // Update to include ES2020 support
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020, // Update to include ES2020 support
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "require-jsdoc": "off",
    "no-unused-vars": "off",
    "max-len": "off",
    "no-undef": "off",
  },
};
