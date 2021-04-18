export class NextManager {
  private readonly focusbleSelector = ['button', 'input', 'select', 'textarea', '[tabindex]']

  private scopeSelector: string | null = null

  private isDisableFocus(element?: HTMLInputElement) {
    return element?.disabled || (typeof element?.tabIndex === 'number' && element.tabIndex < 0)
  }

  setScope(scopeSelector: string) {
    this.scopeSelector = scopeSelector
  }

  getScope() {
    return this.scopeSelector
  }

  next(selector?: string) {
    const scope = document.querySelector(this.scopeSelector!)
    const currentActiveElement = document.activeElement
    const hasFocus = document.hasFocus()
    const allFocusbleElements = Array.from(scope!.querySelectorAll<HTMLInputElement>(this.focusbleSelector.join(','))) // HTMLInputElement 用来泛指可以获取焦点的元素
    if (selector) {
      const target = scope!.querySelector(selector)
      if (target && hasFocus) {
        const nextElement = allFocusbleElements.find(item => this.focusbleSelector.find(s => target === item || target.querySelector(s) === item))
        if (this.isDisableFocus(nextElement)) {
          return
        }
        nextElement?.focus()
      }
      return
    }

    if (scope!.contains(currentActiveElement) && hasFocus) {
      let activeIndex = allFocusbleElements.findIndex(_ => _ === currentActiveElement)
      while (activeIndex > -1 && activeIndex < allFocusbleElements.length) {
        const nextElement = allFocusbleElements[activeIndex + 1]
        if (!this.isDisableFocus(nextElement)) {
          nextElement?.focus()
          break
        }
        activeIndex++
      }
    }
  }
}
