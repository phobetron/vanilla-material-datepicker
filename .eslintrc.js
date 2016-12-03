module.exports = {
  extends: 'airbnb',
  plugins: ['import'],
  env: { browser: true },
  rules: {
    'comma-dangle': 0,
    'no-console': ['error', {
      allow: ['warn', 'error']
    }]
  }
};
