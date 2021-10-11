module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest-setup.js'],
  transformIgnorePatterns: [
    './node_modules/(?!((jest-)?react-native|@react-native|@react-navigation))',
  ],
  globals: {
    __DEV__: true,
  },
};
