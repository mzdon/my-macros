const path = require('path');
const rootPath = path.resolve('./src');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: rootPath,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
