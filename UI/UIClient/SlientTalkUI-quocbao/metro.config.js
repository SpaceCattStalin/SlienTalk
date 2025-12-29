const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  resetCache: true,
  ...transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
config.resolver = {
  ...resolver,
  assetExts: [...resolver.assetExts.filter((ext) => ext !== 'svg'),
    'lottie',
    'glb',   
    'gltf',
    'fbx'
  ],
  sourceExts: [...resolver.sourceExts, 'svg'],
};
module.exports = withNativeWind(config, { input: './app/global.css' });
