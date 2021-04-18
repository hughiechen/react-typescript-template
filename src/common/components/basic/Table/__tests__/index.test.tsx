import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { Table } from '../index'

interface DataSourceItem {
  id: string
  name: string
}

describe('Table', () => {
  test('test UI', () => {
    const { asFragment, getByText } = render(
      <Table
        dataSource={[
          { id: '1', name: 'test1' },
          { id: '2', name: 'test2' },
          { id: '3', name: 'test3' },
          { id: '4', name: 'test4' },
          { id: '5', name: 'test5' },
          { id: '6', name: 'test6' },
          { id: '7', name: 'test7' },
          { id: '8', name: 'test8' },
          { id: '9', name: 'test9' },
          { id: '10', name: 'test10' },
          { id: '11', name: 'test11' },
        ]}
        pageSize={10}
        current={1}
        total={2}
      >
        <Table.Column<DataSourceItem> title="id" dataIndex="id" />
        <Table.Column<DataSourceItem> title="name" dataIndex="name" />
      </Table>
    )
    expect(getByText('test1')).toBeInTheDocument()
    expect(getByText('test2')).toBeInTheDocument()
    expect(getByText('共2条')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})
