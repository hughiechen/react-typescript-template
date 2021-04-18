import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CustomTag } from '../index'

it('CustomTag title', () => {
  const title = '标题'
  const { asFragment, getByText } = render(<CustomTag color="blue">{title}</CustomTag>)
  expect(getByText(title)).toBeDefined()
  expect(asFragment()).toMatchSnapshot()
})

it('CustomTag green', () => {
  const title = '标题'
  const { asFragment, getByText } = render(<CustomTag color="green">{title}</CustomTag>)
  expect(getByText(title)).toBeDefined()
  expect(asFragment()).toMatchSnapshot()
})
