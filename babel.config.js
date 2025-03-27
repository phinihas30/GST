module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-export-namespace-from',
      ['module-resolver', {
        alias: {
          '@': './',
          'screens': './screens',
          'components': './components',
        },
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
      }],
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
}; 