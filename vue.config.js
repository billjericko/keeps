module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: true,
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/keeps/'
    : '/'
}
