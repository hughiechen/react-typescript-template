import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { InputSearch } from '../InputSearch'

test('InputSearch onChange Event', () => {
  const { asFragment, getByRole } = render(<InputSearch />)
  const input = getByRole('textbox', { hidden: true }) as HTMLInputElement
  fireEvent.change(input, { target: { value: 'test value' } })
  expect(input.value).toEqual('test value')
  expect(asFragment()).toMatchSnapshot()
})

test('InputSearch test onChange trim', done => {
  const { asFragment, getByRole } = render(<InputSearch trim onChange={handlerOnChange} />)
  const input = getByRole('textbox', { hidden: true }) as HTMLInputElement
  fireEvent.change(input, { target: { value: ' test value ' } })
  function handlerOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual('test value')
    expect(asFragment()).toMatchSnapshot()
    done()
  }
})

test('InputSearch test onSearch trim', done => {
  const { asFragment, getByRole, getByLabelText } = render(<InputSearch trim onSearch={handlerOnSearch} />)
  const input = getByRole('textbox', { hidden: true }) as HTMLInputElement
  const button = getByLabelText('icon: search') as HTMLButtonElement
  fireEvent.change(input, { target: { value: ' test value ' } })
  fireEvent.click(button)
  function handlerOnSearch(value: string) {
    expect(value).toEqual('test value')
    expect(asFragment()).toMatchSnapshot()
    done()
  }
})
