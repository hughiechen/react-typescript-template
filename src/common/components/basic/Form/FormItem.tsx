import React from 'react'
import { Form } from 'antd'
import classnames from 'classnames'
import { FormItemProps as AntdFormItemProps } from 'antd/lib/form'
import styles from './index.module.less'
import { ColProps } from 'antd/lib/col'

export interface FormItemProps extends Omit<AntdFormItemProps, 'className' | 'labelCol' | 'wrapperCol'> {
  /**
   * 水平布局
   * - 数组第一项为 labelCol; 第二项为 wrapperCol
   */
  horizontalLayout?: [ColProps, ColProps]
  /**
   * 是否缩短下边距, 将会重置 antd FormItem 的下边距，以及部分内部样式，横向布局下，该属性应当为 false
   */
  shortMarginBottom?: boolean
}

/**
 * 自定义 FormItem
 * @description
 * - 外部使用可以通过 `help` 属性传入校验信息
 * - 当 `validateStatus` 值为 undefined，`help` 有值且不为空字符串，validateStatus 自动为 `error`
 * - 当 `validateStatus` 值不为 undefined，那么 `FormItem` 使用传入的 `validateStatus`
 */
export const FormItem: React.FC<FormItemProps> = React.memo(props => {
  const { validateStatus, horizontalLayout, shortMarginBottom, ...restFormItemProps } = props
  const finalValidateStatus = props.validateStatus ?? (props.help ? 'error' : undefined)
  return (
    <Form.Item
      colon={false}
      {...restFormItemProps}
      labelCol={horizontalLayout![0]}
      wrapperCol={horizontalLayout![1]}
      className={classnames(styles.customColon, { [styles.shortMarginBottom]: shortMarginBottom })}
      validateStatus={finalValidateStatus}
    >
      {props.children}
    </Form.Item>
  )
})

FormItem.defaultProps = {
  horizontalLayout: [{ span: 24 }, { span: 24 }],
  shortMarginBottom: true,
}

export default FormItem
