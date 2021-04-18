import * as React from 'react'

export type KeyboardKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Enter' | 'Escape'

export interface ExtraKey {
  alt: boolean
  shift: boolean
  ctrl: boolean
}

export interface KeyboardEventListenerProps {
  type?: 'keydown' | 'keypress' | 'keyup'
  /** addEventListener 第三个参数 */
  options?: boolean | AddEventListenerOptions
  /** 将直接渲染 children，该组件没有任何 UI 元素 */
  children?: React.ReactElement
  listener: (code: KeyboardKey, extra: ExtraKey) => void
}

export const KeyboardEventListener: React.FC<KeyboardEventListenerProps> = React.memo(props => {
  const { listener, children, options, type } = props
  const handlerEvent = React.useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'Enter':
        case 'Escape':
          listener(event.key as KeyboardKey, { alt: event.altKey, shift: event.shiftKey, ctrl: event.ctrlKey })
          break
        default:
          break
      }
    },
    [listener]
  )

  React.useEffect(() => {
    window.addEventListener(type!, handlerEvent, options)
    return () => {
      window.removeEventListener(type!, handlerEvent, options)
    }
  }, [handlerEvent, options, type])
  return children ?? null
})

KeyboardEventListener.defaultProps = {
  type: 'keydown',
}
