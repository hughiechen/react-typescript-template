import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SpinEmpty from '../index'

describe('SpinEmpty', () => {
  test('no children', () => {
    const { getByText, asFragment } = render(<SpinEmpty emptyDescription="没数据" />)
    expect(getByText('没数据')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })

  test('has children', () => {
    const { getByText, rerender, asFragment, queryByText } = render(
      <SpinEmpty loading emptyDescription="没数据">
        <div>1</div>
      </SpinEmpty>
    )

    expect(queryByText('加载中...')).toBe(null)

    rerender(
      <SpinEmpty emptyDescription="没数据">
        <div>内容</div>
      </SpinEmpty>
    )
    expect(getByText('内容')).not.toBeEmpty()
    expect(asFragment()).toMatchSnapshot()
  })
})
