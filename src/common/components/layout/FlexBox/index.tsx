import * as React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

export interface FlexLayoutProps {
  // 作为 flex 父容器可用的属性
  flexDirection?: 'column' | 'column-reverse' | 'row' | 'row-reverse'
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  alignContent?: 'flex-start' | 'flex-end' | 'center'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  // 作为 flex 子元素可用的属性
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  flexGrow?: number
  flexShrink?: number
  flexBasis?: number
  order?: number
  // 公用属性
  marginLeft?: 'auto' | number
  marginRight?: 'auto' | number
  marginTop?: 'auto' | number
  marginBottom?: 'auto' | number
  margin?: 'auto' | number
  /** style 会覆盖所有样式 */
  style?: React.CSSProperties
  className?: string
}

export class FlexBox extends React.PureComponent<FlexLayoutProps> {
  /** 用于 flexBox 子元素的 css 类 */
  static itemClass = {
    alignSelfAuto: styles.alignSelfAuto,
    alignSelfFlexStart: styles.alignSelfFlexStart,
    alignSelfFlexEnd: styles.alignSelfFlexEnd,
    alignSelfCenter: styles.alignSelfCenter,
    alignSelfBaseline: styles.alignSelfBaseline,
    alignSelfStretch: styles.alignSelfStretch,
    marginLeftAuto: styles.marginLeftAuto,
    marginRightAuto: styles.marginRightAuto,
    marginTopAuto: styles.marginTopAuto,
    marginBottomAuto: styles.marginBottomAuto,
    marginAuto: styles.marginAuto,
  }

  render() {
    const { style, className, children, ...restProps } = this.props
    return (
      <div style={{ ...restProps, ...style }} className={classnames(styles.flex, className)}>
        {children}
      </div>
    )
  }
}
