import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { Password } from '../Password'

test('Password onChange Event', () => {
  const { asFragment, getByPlaceholderText } = render(<Password placeholder="password" />)
  const input = getByPlaceholderText('password') as HTMLInputElement
  fireEvent.change(input, { target: { value: 'test value' } })
  expect(input.value).toEqual('test value')
  expect(asFragment()).toMatchSnapshot()
})

test('Password test onChange trim', done => {
  const { asFragment, getByPlaceholderText } = render(<Password trim onChange={handlerOnChange} placeholder="password" />)
  const input = getByPlaceholderText('password') as HTMLInputElement
  fireEvent.change(input, { target: { value: ' test value ' } })
  function handlerOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual('test value')
    expect(asFragment()).toMatchSnapshot()
    done()
  }
})
