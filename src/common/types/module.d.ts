/*
 * @Author: Hughie
 * @Date: 2020-01-01 11:07:29
 * @LastEditTime: 2020-04-06 15:00:08
 * @LastEditors: Hughie
 * @Description:
 */
declare module '*.gif' {
  const gif: string
  export default gif
}

declare module '*.jpg' {
  const jpg: string
  export default jpg
}

declare module '*.jpeg' {
  const jpeg: string
  export default jpeg
}

declare module '*.png' {
  const png: string
  export default png
}

declare module '*.webp' {
  const webp: string
  export default webp
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.SFC<React.HTMLAttributes<SVGSVGElement>>

  export default ReactComponent
}

declare module '*.bmp' {
  const bmp: string
  export default bmp
}

declare module '*.module.css' {
  const css: { [key: string]: string }
  export default css
}

declare module '*.module.less' {
  const css: { [key: string]: string }
  export default css
}

declare module '*.raw.less' {
  const css: string
  export default css
}

declare module '*.xlsx'

declare module '*.graphql'

declare module '*.gql'

declare module 'jsencrypt'
