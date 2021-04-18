/*
 * @Author: Hughie
 * @Date: 2020-05-16 18:36:15
 * @LastEditTime: 2020-06-23 15:42:30
 * @LastEditors: Hughie
 * @Description:
 */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ButtonSuffixInput from '../index'
import UserEvent from '@testing-library/user-event'

describe('ButtonSuffixInput', () => {
  test('should support maxLength', async () => {
    const { asFragment } = render(<ButtonSuffixInput maxLength={3} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('buttonDisabled', async () => {
    const { asFragment } = render(<ButtonSuffixInput buttonDisabled />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('trim', async () => {
    const onChange = jest.fn()
    const { asFragment, container } = render(<ButtonSuffixInput onChange={onChange} />)
    // 这里尝试不使用data-testid 来获取 控件
    const firstInput = container.querySelector('input')!
    UserEvent.type(firstInput, '你好')
    expect(onChange).toHaveBeenCalledTimes(2)

    expect(asFragment()).toMatchSnapshot()
  })

  test('onClick', async () => {
    const onClick = jest.fn()
    const { asFragment, container, rerender } = render(<ButtonSuffixInput buttonDisabled onClick={onClick} />)
    expect(asFragment()).toMatchSnapshot()
    const firstButton = container.querySelector('button')!
    UserEvent.click(firstButton)
    expect(onClick).not.toHaveBeenCalled()
    rerender(<ButtonSuffixInput onClick={onClick} />)
    UserEvent.click(firstButton)
    expect(onClick).toHaveBeenCalled()
  })
})
