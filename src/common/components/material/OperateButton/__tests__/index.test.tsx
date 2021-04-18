import React from 'react'
import { render, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { OperateButton } from '../index'

afterEach(cleanup)

it('disabled=false', () => {
  const { asFragment } = render(<OperateButton style={{ padding: 2 }} onClick={() => console.log('onClick')} />)
  expect(asFragment()).toMatchSnapshot()
})

it('disabled=true', () => {
  const { asFragment } = render(<OperateButton disabled />)
  expect(asFragment()).toMatchSnapshot()
})

it('OperateButton click loading', () => {
  const onClick = jest.fn().mockImplementation(() => Promise.resolve())
  const { asFragment, getByTestId } = render(<OperateButton onClick={onClick}>点击</OperateButton>)
  userEvent.click(getByTestId('OperateButton'))
  expect(onClick).toBeCalled()
  expect(asFragment()).toMatchSnapshot()
})

it('OperateButton click no loading', async () => {
  const onClick = jest.fn().mockImplementation(() => Promise.resolve())
  const { asFragment, getByTestId } = render(<OperateButton onClick={onClick}>点击</OperateButton>)
  await waitFor(() => userEvent.click(getByTestId('OperateButton')))
  expect(onClick).toBeCalled()
  expect(asFragment()).toMatchSnapshot()
})
