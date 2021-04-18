import * as React from 'react'
import { enUS, zhCN } from '@/locales'
import { useDidMount } from '../../common/hooks/lifecycle'
import './util'

export interface IntlProps {
  children: React.ReactElement
}

export const Intl: React.FC<IntlProps> = React.memo(props => {
  const [hasLoadLocales, setHasLoadLocales] = React.useState(false)
  useDidMount(async () => {
    await intl.init({
      currentLocale: window.configStore.determineLocale(),
      locales: {
        'en-US': enUS,
        'zh-CN': zhCN,
      },
    })
    setHasLoadLocales(true)
  })

  return hasLoadLocales ? props.children : null
})
