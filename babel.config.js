const removeConsolePlugin = []
if (process.env.NODE_ENV === 'production') {
  removeConsolePlugin.push('transform-remove-console')
}

module.exports = {
  presets: [
    [
      '@vue/app',
      {
        polyfills: ['es7.object.entries', 'es6.promise']
      }
    ]
  ],
  plugins: removeConsolePlugin
}
