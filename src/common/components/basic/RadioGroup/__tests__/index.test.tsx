import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { RadioGroup } from '../index'

describe('RadioGroup', () => {
  test('test RadioGroup', () => {
    const { asFragment, getByText } = render(
      <RadioGroup
        value={1}
        dataSource={[
          { label: '男', value: 1 },
          { label: '女', value: 2 },
          { label: '保密', value: 3, disabled: true },
        ]}
      />
    )
    expect(getByText('男').closest('label')!.querySelector('input')).toBeChecked()
    expect(getByText('保密').closest('label')!.querySelector('input')).toBeDisabled()
    expect(asFragment()).toMatchSnapshot()
  })
})
