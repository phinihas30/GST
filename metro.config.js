const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for the full Metro configuration
module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
    extraNodeModules: {
      '@': path.resolve(__dirname),
      'screens': path.resolve(__dirname, 'screens'),
      'components': path.resolve(__dirname, 'components'),
    },
  },
  transformer: {
    ...config.transformer,
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  },
}; 