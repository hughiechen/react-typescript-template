// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = (/* {vscode, utils} */) => {
  return {
    localeDir: path.join(__dirname, 'src/locales'),
    langKey: {
      zh_CN: '中文',
      en_US: '英语',
    },
    checkFileReg: /.(?:ts|tsx)$/,
    ignoreCheckNode: nodePath => {
      return nodePath.findParent(item => {
        const node = item.node
        if ((node.type === 'NewExpression' && node.callee.name === 'Error') || (node.type === 'CallExpression' && node.callee.type === 'MemberExpression' && node.callee.object.name === 'console')) {
          return true
        }
      })
    },
  }
}
