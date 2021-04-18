### 使用方式

用于替换 antd 的 Spin，由于 Spin，这空前会根据是否有数据和是否在加载数据做出相应的显示处理，一般用于自定义列表、卡片等控件的加载

```
    <SpinEmpty loading={loading} hasData={!!pagination?.total}>
          <Row gutter={[24, 24]}>
            {dataSource.map((item, index) => {
              const { printItems, ...other } = item
              return (
                <Col key={index} className="gutter-row" span={8}>
                  <PatientLogCard {...other} prints={printItems} />
                </Col>
              )
            })}
          </Row>
        </SpinEmpty>
```
