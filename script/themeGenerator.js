/*
 * @Author: laiyangli
 * @Date: 2021-03-02 13:58:34
 * @LastEditTime: 2021-03-16 19:44:13
 * @LastEditors: Hughie
 * @Description:
 */
const { generateTheme, getLessVars } = require('antd-theme-generator')
const path = require('path')

const themeVariables = getLessVars(path.join(__dirname, '../src/styles/variables.less'))

const options = {
  antDir: path.join(__dirname, '../node_modules/antd'),
  stylesDir: path.join(__dirname, '../src/styles'), // all files with .less extension will be processed
  varFile: path.join(__dirname, '../src/styles/variables.less'), // default path is Ant Design default.less file
  themeVariables: [...Object.keys(themeVariables)],
  // indexFileName: '../public/index.html',
  outputFilePath: path.join(__dirname, '../public/color.less'), // if provided, file will be created with generated less/styles
  // customColorRegexArray: [/^color\(.*\)$/,'pri-color'], // An array of regex codes to match your custom color variable values so that code can identify that it's a valid color. Make sure your regex does not adds false positives.
}

generateTheme(options)
  .then(less => {
    console.log('Theme generated successfully')
  })
  .catch(error => {
    console.log('Error', error)
  })
