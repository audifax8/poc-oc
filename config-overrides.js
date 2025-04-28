const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    fs: false,
    vm: false,
    'process/browser': require.resolve('process/browser')
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.DefinePlugin({
      'process.env.FLUID_CONFIGURATIONS_VERSION': parseInt('3.13.0')
    })
  ]);
  return config;
}