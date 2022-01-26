module.exports = {
    parser: "@babel/eslint-parser",
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  
    env: {
      browser: true,
      es2021: true,
      jest: true,
      jasmine: true,
    },
  
    plugins: [
      "jest",
    ],
  
    extends: [
      "eslint:recommended",
      "plugin:jest/recommended",
    ],
  
    rules: {
    }
  };
  