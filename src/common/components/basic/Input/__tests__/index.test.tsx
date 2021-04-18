import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { Input } from '../index'

test('Input onChange Event', () => {
  const { asFragment, getByRole } = render(<Input />)
  const input = getByRole('textbox', { hidden: true }) as HTMLInputElement
  fireEvent.change(input, { target: { value: 'test value' } })
  expect(input.value).toEqual('test value')
  expect(input)
  expect(asFragment()).toMatchSnapshot()
})

test('Input test trim', done => {
  const { asFragment, getByRole } = render(<Input trim onChange={handlerOnChange} />)
  const input = getByRole('textbox', { hidden: true }) as HTMLInputElement
  fireEvent.change(input, { target: { value: ' test value ' } })
  function handlerOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual('test value')
    expect(asFragment()).toMatchSnapshot()
    done()
  }
})
