import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BackHeader from '../index'
import userEvent from '@testing-library/user-event'
import { history } from '@/common/navigation/history'

jest.mock('@/common/navigation/history', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('@/common/__globalMocks__/history')
})

beforeAll(() => {
  history.push('/a')
})

it('BackHeader snapshot', () => {
  const { asFragment } = render(<BackHeader backText="返回" />)
  expect(asFragment()).toMatchSnapshot()
})

it('BackHeader onClick', () => {
  history.goBack = jest.fn()
  const { getByTestId } = render(<BackHeader backText="返回" />)
  const elem = getByTestId('click')
  expect(elem).not.toBeUndefined()
  userEvent.click(elem)
  expect(history.goBack).toHaveBeenCalled()
})
