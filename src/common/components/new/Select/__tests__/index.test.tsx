import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { Select } from '../index'

describe('Select', () => {
  test('test default', () => {
    const { asFragment, getByText } = render(
      <Select
        value={1}
        options={[
          { label: '1', value: 1 },
          { label: '2', value: 2 },
        ]}
      />
    )
    expect(getByText('1')).toHaveClass('ant-select-selection-selected-value')
    expect(asFragment()).toMatchSnapshot()
  })

  test('test undefinedAsAll', () => {
    const { asFragment, getByText } = render(
      <Select
        undefinedAsAll
        open
        options={[
          { label: '1', value: 1 },
          { label: '2', value: 2 },
        ]}
        placeholder="placeholder test"
      />
    )
    expect(getByText('全部')).toBeInTheDocument()
    expect(getByText('placeholder test')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})
