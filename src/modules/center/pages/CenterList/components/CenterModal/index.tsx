/*
 * @Author: Hughie
 * @Date: 2021-03-24 09:49:27
 * @LastEditTime: 2021-04-09 14:25:27
 * @LastEditors: Hughie
 * @Description:
 */

import * as React from 'react'
import { Field, Form, Modal, useForm } from '@/common/components/basic'
import { ColProps, Input } from 'antd'
import { usePersistFn } from '@/common/hooks'
import { AreaCascader } from '@/components/AreaCascader'
import { GridLayout } from '@/common/components/layout'
import EditableTags from '../EditableTags'
import { createCenter } from './api/createCenter'

interface CenterModalProps {
  onCancel?: () => void
  id?: string
}

const horizontalLayout: [ColProps, ColProps] = [{ span: 6 }, { span: 17 }]

export const CenterModal: React.FC<CenterModalProps> = React.memo(props => {
  const { store } = useForm({
    name: '',
    alias: [],
    area: [],
    code: '',
  })

  const onOk = usePersistFn(async () => {
    const result = await store.submit()
    if (!result.hasError) {
      await createCenter({
        code: result.values.code,
        name: result.values.name,
        provinceCode: result.values.area[0],
        cityCode: result.values.area[1],
        areaCode: result.values.area[2],
        alias: result.values.alias.toString(),
      }).then(() => {
        props.onCancel?.()
      })
    }
  })

  return (
    <Modal visible maskClosable={false} title="新建中心" onCancel={props.onCancel} onOk={onOk} width="40%">
      <Form store={store}>
        <GridLayout column={2} columnGap={50}>
          <Field name="name" label="医院名称" required horizontalLayout={horizontalLayout}>
            <Input />
          </Field>
          <Field name="alias" label="医院别名" horizontalLayout={horizontalLayout}>
            {({ value, setValue }) => {
              return <EditableTags value={value} onChange={setValue} />
            }}
          </Field>
          <Field name="area" label="省份" horizontalLayout={horizontalLayout}>
            <AreaCascader />
          </Field>
          <Field name="code" label="医院编码" required horizontalLayout={horizontalLayout}>
            <Input />
          </Field>
        </GridLayout>
      </Form>
    </Modal>
  )
})
