import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { InputNumber } from '../index'

describe('InputNumber', () => {
  test('onChange Event', done => {
    const { asFragment, getByPlaceholderText } = render(<InputNumber placeholder="number" onChange={handlerOnChange} />)
    const input = getByPlaceholderText('number') as HTMLInputElement
    fireEvent.change(input, { target: { value: 3 } })
    function handlerOnChange(value: number | undefined) {
      expect(value).toBe(3)
      expect(asFragment()).toMatchSnapshot()
      done()
    }
  })

  test('test min', () => {
    const { asFragment, getByPlaceholderText } = render(<InputNumber placeholder="number" value={5} min={10} />)
    const input = getByPlaceholderText('number') as HTMLInputElement
    expect(input.value).toBe('10')
    expect(asFragment()).toMatchSnapshot()
  })

  test('test max', () => {
    const { asFragment, getByPlaceholderText } = render(<InputNumber placeholder="number" value={12} max={10} />)
    const input = getByPlaceholderText('number') as HTMLInputElement
    expect(input.value).toBe('10')
    expect(asFragment()).toMatchSnapshot()
  })

  test('test precision', () => {
    const { asFragment, getByPlaceholderText } = render(<InputNumber placeholder="number" precision={4} value={12} max={10} />)
    const input = getByPlaceholderText('number') as HTMLInputElement
    expect(input.value).toBe('10.0000')
    expect(asFragment()).toMatchSnapshot()
  })
})
