const presets = ['module:metro-react-native-babel-preset'];
const plugins = [];

plugins.push([
  'module-resolver',
  {
    root: ['.'],
    extensions: [
      '.ios.ts',
      '.android.ts',
      '.ts',
      '.ios.tsx',
      '.android.tsx',
      '.jsx',
      '.js',
      '.json',
    ],
    alias: {
      '@assets': './assets',
      '@components': './src/components',
      '@screens': './src/screens',
      '@constants': './src/constants',
      '@services': './src/services',
      '@hocs': './src/hocs',
      '@hooks': './src/hooks',
      '@stores': './src/stores',
      '@navigation': './src/navigation',
      '@context': './src/context',
      '@utils': './src/utils',
      '@internalTypes': './src/types',
      '@theme': './src/theme',
    },
  },
]);

plugins.push('react-native-reanimated/plugin');

module.exports = {
  presets,
  plugins,
};
