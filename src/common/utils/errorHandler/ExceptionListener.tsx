/*
 * @Author: Hughie
 * @Date: 2020-04-22 11:07:50
 * @LastEditTime: 2021-02-12 17:11:12
 * @LastEditors: Hughie
 * @Description:
 */

import { observable, observe, IObjectDidChange, runInAction } from 'mobx'
import { message } from 'antd'
import { APIException, NetworkException, BadRequestException } from '../../network/Exception'
import { ReactLifecycleException } from '../../components/material/ErrorBoundary/ReactLifecycleException'

/**
 * - APIException, NetworkException, BadRequestException 从 client 中抛出，大部分由 unhandledrejection 事件捕获，小部分由 errorHandler.catch 捕获
 * - ReactLifecycleException 由 errorHandler.catch 捕获
 * - Error 属于运行时错误，不在 ExceptionListener 中处理，直接由 Sentry 自动捕获上报
 */
type GlobalException = APIException | NetworkException | BadRequestException | ReactLifecycleException | Error | null

class ExceptionListener {
  @observable.shallow private exception: { info: GlobalException } = {
    info: null,
  }

  constructor() {
    observe(this.exception, this.exceptionListener)
  }

  /**
   * 所有异常信息汇集到该方法内
   */
  private exceptionListener = (change: IObjectDidChange) => {
    if (change.type === 'update') {
      const error = change.newValue as GlobalException
      // 开发模式输出log
      if (IS_DEBUG) {
        if (error instanceof BadRequestException) {
          message.error('BadRequestException: 请在控制台查看详细信息')
        }
        console.group('%c【全局异常】', 'color: red;font-size: 14px')
        console.error(error)
        console.groupEnd()
      }
      // 处理 api 层级的 error
      if (error instanceof APIException) {
        // 登录错误单独处理
        const msg = error.message || '服务器开小差,请稍后再试'
        if (error.code === 2041 || error.code === 2040) {
          message.error({
            content: msg,
            duration: 1,
            onClose: () => (window.location.href = '/login'),
          })
        } else {
          message.error(msg)
        }

        return
      }
      // 当处理网络异常错误时
      if (error instanceof NetworkException) {
        message.error(IS_DEBUG ? `${error.message}：请在控制台查看详细信息` : error.message)
      }
    }
  }

  /**
   * 开发环境下禁止运行时异常的默认打印，显示自定义的log
   * @description
   * - 该事件捕获到的异常在 exceptionListener 中做自定义的提示效果，Sentry 已经做了默认的全局捕获并且上报
   */
  private handleUnhandledrejection = (event: PromiseRejectionEvent) => {
    this.catch(event.reason)
    if (IS_DEBUG) {
      event.preventDefault()
    }
  }

  /**
   * 开发环境下禁止运行时异常的默认打印，显示自定义的log
   * @description 该事件捕获到的异常不做任何处理，Sentry 已经做了默认的全局捕获并且上报
   */
  private handleRuntimeException = (event: ErrorEvent) => {
    this.catch(event.error)
    if (IS_DEBUG) {
      event.preventDefault()
    }
  }

  /**
   * 用于手动捕获异常，特别适用无法抛出到顶层的异常
   * @example common/basic/Modal 中 confirm 方法需要此方式手动捕获异常
   */
  catch = (exception: GlobalException) => {
    runInAction(() => {
      this.exception.info = exception
    })
  }

  /**
   * 添加全局异常监听方法，应当在 App 入口文件中执行
   */
  addGlobalExceptionListener = () => {
    window.removeEventListener('error', this.handleRuntimeException)
    window.removeEventListener('unhandledrejection', this.handleUnhandledrejection)
    window.addEventListener('error', this.handleRuntimeException)
    window.addEventListener('unhandledrejection', this.handleUnhandledrejection)
  }
}

export const errorHandler = new ExceptionListener()
