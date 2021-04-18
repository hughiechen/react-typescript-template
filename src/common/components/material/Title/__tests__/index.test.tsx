/*
 * @Author: Hughie
 * @Date: 2020-06-21 09:26:34
 * @LastEditTime: 2020-06-21 09:56:31
 * @LastEditors: Hughie
 * @Description:
 */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Title from '../index'

it('Title title', () => {
  const title = '标题'

  const { asFragment, getByText } = render(<Title text={title} />)
  expect(getByText(title)).not.toBeUndefined()
  expect(asFragment()).toMatchSnapshot()
})

it('Title noStyle', () => {
  const title = '标题'
  const { asFragment, getByText } = render(<Title text={title} type="noStyle" />)
  expect(getByText(title)).not.toBeUndefined()
  expect(asFragment()).toMatchSnapshot()
})

it('Title fullLine', () => {
  const title = '标题'
  const { asFragment } = render(<Title text={title} type="fullLine" />)
  expect(asFragment()).toMatchSnapshot()
})

it('Title fullLine', () => {
  const title = '标题'
  const { asFragment } = render(<Title text={title} type="verticalHighlight" />)
  expect(asFragment()).toMatchSnapshot()
})

it('Title className', () => {
  const { asFragment, container } = render(<Title text="标题" className="text" />)
  expect(container.firstChild).toHaveClass('text')
  expect(asFragment()).toMatchSnapshot()
})
