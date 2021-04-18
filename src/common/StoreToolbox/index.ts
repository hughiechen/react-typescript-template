import * as React from 'react'
import { observer } from 'mobx-react'

/**
 * 状态管理套件
 */
export class StoreToolbox<S> {
  private readonly StoreContext = React.createContext<S>({} as S)

  public readonly Provider = this.StoreContext.Provider

  /**
   * 函数组件中使用 hooks useStore 获取 store 中的数据
   */
  public readonly useStore = <R>(fn: (store: S) => R) => fn(React.useContext(this.StoreContext))

  /**
   * 高阶组件，给类组件注入 store 中的数据
   */
  public readonly inject = <R>(mapStateToProps?: (state: S) => R) => {
    return <P extends R>(Component: React.ComponentType<P>): React.ComponentType<Subtract<P, R>> =>
      observer(props => {
        const store = mapStateToProps ? this.useStore(mapStateToProps) : {}
        return React.createElement(Component, { ...props, ...store } as P)
      })
  }
}
