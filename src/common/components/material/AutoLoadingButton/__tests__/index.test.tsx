import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { AutoLoadingButton } from '../index'
import userEvent from '@testing-library/user-event'

it('AutoLoadingButton click', () => {
  const onClick = jest.fn().mockImplementation(() => Promise.resolve())
  const { asFragment, getByRole } = render(<AutoLoadingButton onClick={onClick}>标题</AutoLoadingButton>)
  userEvent.click(getByRole('button'))
  expect(onClick).toBeCalled()
  expect(asFragment()).toMatchSnapshot()
})

it('AutoLoadingButton no Loading', async () => {
  const onClick = jest.fn().mockImplementation(() => Promise.resolve())
  const { asFragment, getByRole } = render(<AutoLoadingButton onClick={onClick}>按钮</AutoLoadingButton>)
  await waitFor(() => userEvent.click(getByRole('button')))
  expect(onClick).toBeCalled()
  expect(asFragment()).toMatchSnapshot()
})
