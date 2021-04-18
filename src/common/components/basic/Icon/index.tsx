import * as React from 'react'
import { createFromIconfontCN } from '@ant-design/icons'
import { IconFontProps } from '@ant-design/icons/lib/components/IconFont'

// NOTE: 该文件由脚本自动生成，请勿修改

export type IconUnion =
  | 'icon-querenmima'
  | 'icon-shenqingjigou'
  | 'icon-tupianyanzhengma'
  | 'icon-shenqingren'
  | 'icon-mima'
  | 'icon-shoujihaoma'
  | 'icon-duanxinyanzhengma'
  | 'suoxiao'
  | 'xuanzhuan'
  | 'fangda'
  | 'error'
  | 'tixing'
  | '404'
  | 'quanxian'
  | 'left'
  | 'right'
  | 'weihu'
  | 'subject'
  | 'edit'
  | 'loading'
  | 'user'
  | 'calendar'
  | 'design'
  | 'data'
  | 'setting'
  | 'beiwanglu'

export interface IconProps extends IconFontProps {
  type: IconUnion
}

// scriptUrl 在 iconfont.com 中获取
const IconWithURL = createFromIconfontCN({ scriptUrl: '//at.alicdn.com/t/font_2430757_1k0eoqhhq4l.js' })

export const Icon: React.FC<IconProps> = React.memo(props => <IconWithURL {...props} />)

export default Icon
