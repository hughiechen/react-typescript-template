require('colors')
const path = require('path')
const fs = require('fs-extra')
const { argv } = require('yargs')
const prettier = require('prettier')
const axios = require('axios')

const url = argv._[0]

if (!url) {
  console.log(`请输入正确的命令行参数，例：npm run icon [url]。url 从 iconfont.com 获取`.red)
  process.exit(1)
}

async function getIconNames(url) {
  try {
    console.log('加载字体资源...'.yellow)
    const { data } = await axios.get(`https:${url}`)
    console.log('加载完成'.yellow)
    return [...data.matchAll(/<symbol id="(.+?)"/g)].map(_ => _[1])
  } catch {
    console.log(`下载字体文件失败，请重试`.red)
    process.exit(1)
  }
}

function createComponentCode(iconNames) {
  const templateCode = fs.readFileSync(path.resolve(__dirname, './template.tsx'))
  return templateCode
    .toString()
    .replace('icon-url', url)
    .replace("'icon-union'", iconNames.map(_ => `'${_}'`).join('|'))
}

function formatCode(code) {
  return prettier.format(code, { ...JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.prettierrc')).toString()), parser: 'typescript' })
}

function updateIconCode(code) {
  fs.writeFileSync(path.resolve(process.cwd(), 'src/common/components/basic/Icon/index.tsx'), code)
}

async function run() {
  updateIconCode(formatCode(createComponentCode(await getIconNames(url))))
  console.log('更新组件 Icon 完成'.green)
}

run()
