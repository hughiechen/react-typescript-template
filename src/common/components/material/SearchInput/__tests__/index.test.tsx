import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserEvent from '@testing-library/user-event'

import { SearchInput } from '../index'

describe('SearchInput', () => {
  test('style', () => {
    const { asFragment } = render(<SearchInput style={{ width: 100 }} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('click', () => {
    const onSearch = jest.fn()
    const { getByTestId, asFragment } = render(<SearchInput style={{ width: 100 }} onSearch={onSearch} />)
    UserEvent.click(getByTestId('searchBt'))
    expect(onSearch).toBeCalled()
    expect(asFragment()).toMatchSnapshot()
  })
})
