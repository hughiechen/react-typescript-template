import React from 'react'
import { render, cleanup } from '@testing-library/react'

import GridTable from '../index'

afterEach(cleanup)

it('empty dataSource', () => {
  const { asFragment } = render(
    <GridTable dataSource={[]} loading={false} renderItem={item => <div>{item}</div>} style={{ marginTop: 15 }} total={10} current={1} pageSize={10} onChange={v => console.log('v', v)} />
  )
  expect(asFragment()).toMatchSnapshot()
})

it('has dataSource', () => {
  const { asFragment } = render(
    <GridTable dataSource={[1, 2, 3]} loading={false} renderItem={item => <div>{item}</div>} style={{ marginTop: 15 }} total={10} current={1} pageSize={10} onChange={v => console.log('v', v)} />
  )
  expect(asFragment()).toMatchSnapshot()
})
