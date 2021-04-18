import { useIsFirstRender } from '@/common/hooks/lifecycle'
import React from 'react'
import { FormManager, Forms } from './FormManager'

export function useFormProvider<F extends Forms>() {
  const formManager = React.useRef<FormManager<F>>()
  const isFirstRender = useIsFirstRender()
  if (isFirstRender) {
    formManager.current = new FormManager()
  }
  return formManager.current!
}
