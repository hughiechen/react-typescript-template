import * as React from 'react'
import { createFromIconfontCN } from '@ant-design/icons'
import { IconFontProps } from '@ant-design/icons/lib/components/IconFont'

// NOTE: 该文件由脚本自动生成，请勿修改

export type IconUnion = 'icon-union'

export interface IconProps extends IconFontProps {
  type: IconUnion
}

// scriptUrl 在 iconfont.com 中获取
const IconWithURL = createFromIconfontCN({ scriptUrl: 'icon-url' })

export const Icon: React.FC<IconProps> = React.memo(props => <IconWithURL {...props} />)

export default Icon
