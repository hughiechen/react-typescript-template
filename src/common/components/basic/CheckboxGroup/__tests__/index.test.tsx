import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { CheckboxGroup } from '../index'

test('CheckboxGroup 选中：男', () => {
  const { asFragment, getByText } = render(
    <CheckboxGroup
      value={[1]}
      dataSource={[
        { label: '男', value: 1 },
        { label: '女', value: 2 },
        { label: '未知', value: 3, disabled: true },
      ]}
    />
  )

  expect(getByText('男').closest('label')).toHaveClass('ant-checkbox-wrapper-checked')
  expect(getByText('女').closest('label')).not.toHaveClass('ant-checkbox-wrapper-checked')
  expect(getByText('未知').closest('label')).toHaveClass('ant-checkbox-wrapper-disabled')

  expect(asFragment()).toMatchSnapshot()
})
