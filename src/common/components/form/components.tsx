import React from 'react'
import { DatePicker, Cascader, TimePicker, Checkbox } from 'antd'
import { AgePicker } from './AgePicker'
import { AddressCascader, SimpleAddressCascader } from './AddressCascader'
import { CheckboxGroup, InputNumber, RadioGroup, Input } from '../basic'
import { SelectProps, Select } from '../new/Select'
import { ButtonSuffixInput } from '../material'
import type { InputProps } from 'antd/lib/input'
import type { DatePickerProps } from 'antd/lib/date-picker'
import type { CascaderProps } from 'antd/lib/cascader'
import type { TimePickerProps } from 'antd/lib/time-picker'
import type { SimpleAddressCascaderProps } from './AddressCascader'

/**
 * 默认封装好的表单组件
 */

/**
 * Input 从 antd 4.0 以后，修改了默认受控条件，改为 value 值不为 undefined 时，才受控，这里将 value 值做处理，使得 Input 在表单情况下，始终为受控状态，主要达到 Form 绑定的字段值可以为选填
 */
export const InputComponent = React.forwardRef<Input, InputProps>((props, ref) => <Input ref={ref} trim {...props} value={props.value || ''} />)

export const TextareaComponent = Input.TextArea

export const PasswordComponent = Input.Password

export const SelectComponent: React.FC<SelectProps> = React.memo(props => <Select {...props} style={{ width: '100%', ...props.style }} />)

export const DatePickerComponent = React.memo<DatePickerProps>(props => <DatePicker {...props} style={{ width: '100%', ...props.style }} />)

export const InputNumberComponent = InputNumber

export const RadioGroupComponent = RadioGroup

export const CheckboxGroupComponent = CheckboxGroup

export const AgePickerComponent = AgePicker

export const AddressCascaderComponent = AddressCascader

export const SimpleAddressCascaderComponent = React.memo<SimpleAddressCascaderProps>(props => <SimpleAddressCascader {...props} style={{ width: '100%', ...props.style }} />)

export const CascaderComponent = React.memo<CascaderProps>(props => <Cascader {...props} style={{ width: '100%', ...props.style }} />)

export const TimePickerComponent = React.memo<TimePickerProps>(props => <TimePicker {...props} style={{ width: '100%', ...props.style }} />)

export const CheckboxComponent = Checkbox

export const ButtonSuffixInputComponent = ButtonSuffixInput
