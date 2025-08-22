const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };

  config.resolver = {
    ...config.resolver,
    // assetExts에서 svg 제외
    assetExts: config.resolver.assetExts.filter(ext => ext !== "svg"),
    // sourceExts에 svg 추가
    sourceExts: [...config.resolver.sourceExts, "svg"],
  };

  return config;
})();