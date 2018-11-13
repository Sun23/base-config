const postcssEnv = require('postcss-preset-env')
const stylelint = require('stylelint')
const postcssReporter = require("postcss-reporter")
const postcssModule = require('postcss-modules')

module.exports = {
  plugins: [
    postcssEnv({
      stage: 0, browserslist: [
        '1% in CN',
        'android >= 4.4',
        'ios >= 8',
        'not ie <= 11'
      ]
    }),
    // postcssModule(),
    stylelint({
      configFile: './stylelint.config.js'
    }),
    postcssReporter({clearReportedMessages: true})
  ]
}