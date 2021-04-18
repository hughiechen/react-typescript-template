/*
 * @Author: Hughie
 * @Date: 2021-01-31 13:55:14
 * @LastEditTime: 2021-02-22 16:02:04
 * @LastEditors: Hughie
 * @Description:
 */

import React from 'react'
import { Lambda } from 'mobx'
import { deepObserve } from 'mobx-utils'
import { StoreContext } from './context'

export interface ConsumerProps<V> {
  /** names 包含的字段值变化后，重新渲染该组件，不填写该项默认所有字段变化都重渲染 */
  names?: Array<keyof V>
  children: (values: Readonly<V>) => React.ReactNode
  /** 重渲染时机 deepObserve.change */
  reRenderMoments?: Array<'add' | 'update' | 'remove' | 'splice' | 'delete'>
}

export class Consumer<V> extends React.PureComponent<ConsumerProps<V>> {
  static contextType = StoreContext

  readonly context!: React.ContextType<typeof StoreContext>

  private disposer: Lambda | null = null

  componentDidMount() {
    const { names, reRenderMoments } = this.props
    this.disposer = deepObserve(this.context.values, change => {
      // NOTE: type 为 update时，类型声明是没有 name 属性，但是实际是存在的
      if ((reRenderMoments || ['update']).indexOf(change.type) > -1) {
        if (!names || names.includes((change as any).name)) {
          this.forceUpdate()
        }
      }
    })
  }

  componentWillUnmount() {
    this.disposer?.()
  }

  render() {
    return this.props.children(this.context.values)
  }
}

export default Consumer
