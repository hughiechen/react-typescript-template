/*
 * @Author: Hughie
 * @Date: 2020-10-09 09:42:58
 * @LastEditTime: 2021-03-04 13:20:35
 * @LastEditors: Hughie
 * @Description:
 */

require('colors')
const path = require('path')
const { Select } = require('enquirer')
const { runShell } = require('./common')

// 任务
const tasks = ['[ Check ]: 综合检查', 'prettier（格式化代码）', 'eslint检查', 'typescript 编译检查（全局）', '循环依赖检察']

// 发起任务
async function createPrompt() {
  // 复制一份，不然放入 Select 会改变原素组
  const copyTaskArray = [...tasks]
  try {
    const task = await new Select({ message: '请选择执行任务: '.green, choices: copyTaskArray }).run()
    if (task === tasks[0]) {
      composeTask()
    }
    if (task === tasks[1]) {
      prettier()
    }
    if (task === tasks[2]) {
      eslint()
    }
    if (task === tasks[3]) {
      checkTypescriptCode()
    }
    if (task === tasks[4]) {
      checkCircular()
    }
  } catch (error) {
    console.log(error.red)
    process.exit(0)
  }
}

function prettier(url = 'src/**') {
  console.log('[Task: 格式化代码]'.green)
  runShell('prettier', ['--config', '.prettierrc', '--write', `${url}/*.{ts,tsx,less,css,json,md}`])
}

function checkTypescriptCode() {
  console.log('[Task: typescript 编译检查（全局）]'.green)
  runShell('tsc', ['-p', 'tsconfig.json', '--noEmit'])
}

function eslint(url = 'src/**') {
  console.log('[Task: eslint]'.green)
  runShell('eslint', ['--fix', `${url}/*.{ts,tsx,json}`])
}

/**
 * 检查循环依赖
 */
function checkCircular() {
  console.log('[Task: 循环依赖检查]'.green)
  runShell('madge', ['--circular', path.resolve(__dirname, '../src')])
}

function composeTask(url) {
  checkCircular()
  prettier(url)
  checkTypescriptCode()
  eslint(url)
}

createPrompt()
