const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    // bundle the tflite model as an asset
    assetExts: ['tflite', 'bin', 'png', 'jpg', 'jpeg', 'ttf'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
