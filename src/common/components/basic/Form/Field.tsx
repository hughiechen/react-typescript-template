/*
 * @Author: Hughie
 * @Date: 2021-01-31 17:54:23
 * @LastEditors: Hughie
 * @LastEditTime: 2021-02-04 17:17:01
 * @Description:
 */
import React from 'react'
import { Field as MobxField, FieldProps as MobxFieldProps, AnyValue } from './core/Field'
import { validateTypeMap } from './validate'
import { FormItem } from './FormItem'
import { UnifiedEvent } from './core/UnifiedEvent'
import { ColProps } from 'antd/lib/col'

export type ValidateType = 'IdCard' | 'PhoneNumber' | 'password' | 'fileList'

export interface FieldProps<V, K extends keyof V> extends MobxFieldProps<V, K> {
  /** 填写该项就会忽略 validate 验证函数 */
  validateType?: ValidateType
  /**
   * 不带 FormItem UI
   * @default true
   */
  noStyle?: boolean
  /** 同 antd hasFeedback */
  hasFeedback?: boolean
  /** 只在 validating（表单验证） 过程中才开启 hasFeedback，效果为 loading */
  validatingHasFeedback?: boolean
  /**
   * 水平布局
   * - 数组第一项为 labelCol; 第二项为 wrapperCol
   */
  horizontalLayout?: [ColProps, ColProps]
  shortMarginBottom?: boolean
  /** 同 antd FormItem extra */
  extra?: React.ReactNode
}

export class Field<V extends AnyValue, K extends keyof V> extends React.PureComponent<FieldProps<V, K>> {
  static FormItem = FormItem

  static defaultProps: PickOptional<FieldProps<any, any>> = {
    valuePropName: 'value',
  }

  render() {
    const { validateType, validate, noStyle, hasFeedback, validatingHasFeedback, horizontalLayout, shortMarginBottom, extra, children, ...restFieldProps } = this.props
    if (noStyle) {
      return (
        <MobxField {...restFieldProps} validate={validateType ? validateTypeMap[validateType] : validate}>
          {children}
        </MobxField>
      )
    }
    return (
      <MobxField {...restFieldProps} validate={validateType ? validateTypeMap[validateType] : validate}>
        {renderPropsConfig => {
          const { error, label, required } = renderPropsConfig
          const element =
            children instanceof Function ? (
              children(renderPropsConfig)
            ) : React.isValidElement(children) ? (
              <UnifiedEvent valuePropName={restFieldProps.valuePropName!} value={renderPropsConfig.value} onChange={renderPropsConfig.setValue}>
                {children}
              </UnifiedEvent>
            ) : (
              children
            )
          const finalHasFeedback = hasFeedback ?? (validatingHasFeedback && renderPropsConfig.validateStatus === 'validating')
          return (
            <FormItem
              horizontalLayout={horizontalLayout}
              shortMarginBottom={shortMarginBottom}
              label={label}
              required={required}
              help={error}
              validateStatus={renderPropsConfig.validateStatus}
              hasFeedback={finalHasFeedback}
              extra={extra}
            >
              {element}
            </FormItem>
          )
        }}
      </MobxField>
    )
  }
}

export default Field
