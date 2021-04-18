/*
 * @Author: Hughie
 * @Date: 2021-03-23 18:15:49
 * @LastEditTime: 2021-04-18 18:13:04
 * @LastEditors: Hughie
 * @Description:
 */

import { Table } from '@/common/components/basic'
import { PageCard, PageLayout } from '@/common/components/layout'
import { OperateButton, TableSearchBar } from '@/common/components/material'
import { useDidMount, useDidUpdate, useFetchTableData, useModalVisible } from '@/common/hooks'
import { Button, Divider, Input } from 'antd'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Center, getCenterList } from './api/getCenterList'
import { CenterModal } from './components/CenterModal'

export interface ModalState {
  id?: string
}

const CenterList: React.FC = observer(() => {
  const centerModal = useModalVisible<ModalState>()

  const { state, fetchData } = useFetchTableData(getCenterList, () => {
    const defaultQuery = {
      page: 1,
      limit: 10,
    }
    return defaultQuery
  })

  useDidMount(() => {
    fetchData()
  })

  useDidUpdate(() => {
    fetchData()
  }, [window.appStore.user])

  const renderIndex = React.useCallback((text: any, record: Center, index) => {
    return index + 1
  }, [])
  return (
    <PageLayout>
      <PageCard>
        <TableSearchBar>
          <TableSearchBar.Left>
            <Input.Search placeholder="中心名称" onSearch={e => fetchData({ name: e })} />
          </TableSearchBar.Left>
          <TableSearchBar.Right>
            <Button type="primary" onClick={() => centerModal.open()}>
              新增
            </Button>
          </TableSearchBar.Right>
        </TableSearchBar>
        <Table rowKey="id" dataSource={state.data?.data ?? []} pageSize={state.query.limit} current={state.query.page} total={state.data?.total} loading={state.loading}>
          <Table.Column<Center> title="序号" render={renderIndex} />
          <Table.Column<Center> title="中心编码" dataIndex="code" />
          <Table.Column<Center> title="中心名称" dataIndex="name" />
          <Table.Column<Center> title="中心别名" dataIndex="alias" />
          <Table.Column<Center> title="省" dataIndex="provinceCode" />
          <Table.Column<Center> title="市" dataIndex="cityCode" />
          <Table.Column<Center> title="区" dataIndex="areaCode" />
          <Table.Column<Center>
            title="操作"
            render={(text: any, record: Center) => {
              return (
                <>
                  <OperateButton onClick={() => centerModal.open({ id: record.id })}>编辑</OperateButton>
                  <Divider type="vertical" />
                  <OperateButton>删除</OperateButton>
                  <Divider type="vertical" />
                </>
              )
            }}
          />
        </Table>
        {centerModal.state.visible && (
          <CenterModal
            id={centerModal.state.data?.id}
            onCancel={() => {
              centerModal.cancel()
              fetchData()
            }}
          />
        )}
      </PageCard>
    </PageLayout>
  )
})

export default CenterList
