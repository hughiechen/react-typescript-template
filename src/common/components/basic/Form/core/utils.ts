/**
 * 从鼠标事件 MouseEvent 或者 键盘输入事件 InputEvent 中获取 value 或者 checked 值
 * @param event
 * @param valuePropName
 */
export const getValueFormUIEvent = (event: any, valuePropName: 'checked' | 'value') => {
  if (event?.nativeEvent instanceof MouseEvent || event?.nativeEvent instanceof Event) {
    return valuePropName === 'value' ? event.target.value : event.target.checked
  }
  return event
}

export const asyncDebounce = <F extends (...args: any[]) => Promise<any>>(fn: F, wait?: number) => {
  let timerId: number | undefined

  async function f(...args: Parameters<F>) {
    if (timerId !== undefined) {
      clearTimeout(timerId)
      timerId = undefined
    }
    return await new Promise<ReturnType<F>>(resolve => {
      timerId = window.setTimeout(() => {
        resolve(fn(...args))
      }, wait)
    })
  }

  return f as F
}
