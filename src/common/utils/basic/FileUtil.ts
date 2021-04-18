/*
 * @Author: liubin
 * @Date: 2019-12-18 09:54:11
 * @LastEditTime: 2021-03-16 16:30:44
 * @LastEditors: Hughie
 * @Description:
 */
import { NetworkException, BadRequestException } from '@/common/network'
import { message } from 'antd'
import { createSearch } from '@/common/navigation'

export class FileUtil {
  /**
   * 将文件生成 base64 字符串数据
   * @param file 文件
   */
  static dataURL(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
    })
  }

  /**
   * 下载文件
   * @param url
   * @param downloadName
   */
  static async download(url: string, downloadName?: string): Promise<void> {
    try {
      // const res = await fetch(url)

      const res = await fetch(url, {
        // 解决由于图片预览，导致浏览器缓存了该（url）支援，导致后面fetch出现跨域失败的问题（下载fetch相同的支援，浏览器直接使用了缓存，但是该缓存的请求（之前是通过A标签显示的）是不支持跨域的）。
        headers: {
          pragma: 'no-cache',
          'cache-control': 'no-cache',
        },
        method: 'GET',
      })

      if (res.ok) {
        const blob = await res.blob()
        const objectUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.download = `${downloadName}`
        a.href = objectUrl
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(objectUrl)
        return
      }
      message.error(intl.get('download_fail_again').d('下载失败，请重试'))
      // 下载失败，抛出上报异常
      throw new BadRequestException(`下载文件失败; 文件名${downloadName || '--'}; 下载地址: ${url}`, { url, downloadName })
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new NetworkException()
    }
  }

  /** 导出文件 */
  static exportFile(path: string, query: AnyObject = {}) {
    const url = `${path}${createSearch(query)}`
    const a = document.createElement('a')
    a.href = url
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
}
