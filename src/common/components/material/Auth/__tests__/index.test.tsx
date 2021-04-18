/*
 * @Author: Hughie
 * @Date: 2020-05-16 18:36:15
 * @LastEditTime: 2020-06-29 12:11:07
 * @LastEditors: Hughie
 * @Description:
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Auth, { PageNoPermission } from '../index'

beforeAll(() => {
  //   jest.spyOn(window, 'get').mockReturnValue({
  //     permissions: { ABC: true },
  //   } as any)
  window.appStore = {
    checkPermission: (authority?: string) => {
      const authorityMap = { ABC: true }
      if (authority === undefined) return true
      return !authority.split('&').some(item => !authorityMap[item])
    },
  } as any
})

afterAll(() => {
  //   jest.clearAllMocks()
})

describe('Auth', () => {
  test('no limit authority', async () => {
    render(
      <Auth>
        <div>about</div>
      </Auth>
    )

    const cText = screen.getByText(/about/i)
    expect(cText).not.toBeEmpty()
  })

  test('limit Auth and has no authority', async () => {
    render(
      <Auth authority="add">
        <div>about</div>
      </Auth>
    )
    expect(() => {
      screen.getByText(/about/i)
    }).toThrow()
  })

  test('noPermissionRenderNull=false', async () => {
    render(
      <Auth authority="add" noPermissionContent={<PageNoPermission />}>
        <div>about</div>
      </Auth>
    )
    const cText = screen.getByText('抱歉，您没有权限访问该页面')
    expect(cText).not.toBeEmpty()
  })

  test('noPermissionRenderNull=true', async () => {
    render(
      <Auth authority="add" noPermissionContent={<PageNoPermission />}>
        <div>about</div>
      </Auth>
    )
    const cText = screen.queryByText('抱歉，您没有权限访问该页面')
    expect(cText).not.toBeNull()
  })
})
