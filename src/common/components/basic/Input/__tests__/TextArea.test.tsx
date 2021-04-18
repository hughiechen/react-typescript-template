import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { TextArea } from '../TextArea'

test('TextArea onChange Event', () => {
  const { asFragment, getByRole } = render(<TextArea />)
  const input = getByRole('textbox', { hidden: true }) as HTMLTextAreaElement
  fireEvent.change(input, { target: { value: 'test value' } })
  expect(input.value).toEqual('test value')
  expect(asFragment()).toMatchSnapshot()
})

test('TextArea test trim', done => {
  const { asFragment, getByRole } = render(<TextArea trim onChange={handlerOnChange} />)
  const input = getByRole('textbox', { hidden: true }) as HTMLTextAreaElement
  fireEvent.change(input, { target: { value: ' test value ' } })
  function handlerOnChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    expect(event.target.value).toEqual('test value')
    expect(asFragment()).toMatchSnapshot()
    done()
  }
})
