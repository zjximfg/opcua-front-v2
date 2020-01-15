import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Dispatch} from "redux";
import {ItemHistoryModelStateType} from "@/models/itemHistory";
import {connect} from "dva";
import {Button, Card, Col, DatePicker, Form, Row, Select, Table} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import LoadingDataType from "@/models/loading";
import {ColumnProps} from "antd/es/table";
import {ItemHistoryDataType, QueryParams} from "@/pages/history/itemHistory/itemHistory";
import {PaginationProps} from "antd/es/pagination";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import OpcUaGroupDataType from "@/pages/project/components/Group/opcUaGroup";
import OpcUaItemDataType from "@/pages/project/components/Item/opcUaItem";
import FormLayout from "@/models/formLayout";


const Option = Select.Option;

const { RangePicker } = DatePicker;

interface ItemHistoryProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  itemHistoryModel: ItemHistoryModelStateType;
  loading: boolean;
}

interface ItemHistoryState {
  queryParams: QueryParams;
  groupOptionList: Array<OpcUaGroupDataType>;
}

@connect(({itemHistory, loading}: { itemHistory: ItemHistoryModelStateType, loading: LoadingDataType }) => {
  return {
    itemHistoryModel: itemHistory,
    loading: loading.models.itemHistory
  }
})
class ItemHistory extends React.Component<ItemHistoryProps, ItemHistoryState> {

  state: ItemHistoryState = {
    queryParams: {
      currentPage: 1,
      pageSize: 10,
    },
    groupOptionList: [],
  };

  componentDidMount(): void {
    // 获取connectionList
    const {dispatch} = this.props;
    dispatch({
      type: 'itemHistory/fetchConnectionList',
    });
    // 获取groupList
    dispatch({
      type: 'itemHistory/fetchGroupList',
    })
  }

  handlePageChange = (page: number, pageSize?: number | undefined): void => {
    this.setState({
      queryParams: {
        ...this.state.queryParams,
        currentPage: page,
        pageSize: pageSize ? pageSize : 10
      }
    }, () => {
      const {dispatch} = this.props;
      dispatch({
        type: 'itemHistory/fetchItemHistoryPage',
        payload: this.state.queryParams,
      });
    })
  };

  handleConnectionOnSelect = (value: any) => {
    const opcUaGroupList = this.props.itemHistoryModel.groupList.filter((item: OpcUaGroupDataType) => item.opcUaConnectionId === value);
    this.setState({
      groupOptionList: opcUaGroupList,
    })
  };

  handleGroupOnSelect = (value: any) => {
    // 获取itemList
    const {dispatch} = this.props;
    dispatch({
      type: 'itemHistory/fetchItemList',
      payload: {opcUaGroupId: value}
    })
  };

  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const startTime = values.dateTime[0].format("YYYY-MM-DD HH:mm:ss");
      const endTime = values.dateTime[1].format("YYYY-MM-DD HH:mm:ss");
      this.setState({
        queryParams: {
          ...this.state.queryParams,
          itemId: values.itemId,
          startTime: startTime,
          endTime: endTime,
        }
      }, () => {
        const {dispatch} = this.props;
        dispatch({
          type: 'itemHistory/fetchItemHistoryPage',
          payload: this.state.queryParams,
        });
      });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {queryParams, groupOptionList} = this.state;

    const {itemHistoryModel, loading, form} = this.props;

    const {getFieldDecorator} = form;

    const columns: ColumnProps<ItemHistoryDataType>[] = [
      {
        key: 'itemName',
        title: 'Name',
        dataIndex: 'itemName',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'itemValue',
        title: 'Value',
        dataIndex: 'itemValue',
      },
      {
        key: 'recordTime',
        title: 'Record Time',
        dataIndex: 'recordTime',
      },
    ];

    const paginationProps: PaginationProps = {
      showSizeChanger: true,
      pageSize: queryParams.pageSize,
      total: itemHistoryModel.total || 0,
      onChange: (page, pageSize) => this.handlePageChange(page, pageSize)
    };


    const formLayout: FormLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
    };

    return (
      <>
        <PageHeaderWrapper>
          <Row>
            <Card>
              <Form onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                this.handleSearch()
              }}>
                <Row gutter={24}>
                  <Col span={8} key={"connectionId"}>
                    <Form.Item label={'Connection'} {...formLayout}>
                      {getFieldDecorator('connectionId', {
                        rules: [{required: true, message: 'Select Connection!'}],
                      })(
                        <Select placeholder="Connection" onSelect={(value) => this.handleConnectionOnSelect(value)}>
                          {itemHistoryModel.connectionList.map((item: OpcUaConnectionDataType) => {
                            return (
                              <Option value={item.id}>{item.connectionName} </Option>
                            )
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} key={"groupId"}>
                    <Form.Item label={'Group'} {...formLayout}>
                      {getFieldDecorator('groupId', {
                        rules: [{required: true, message: 'Select Group!'}],
                      })(
                        <Select placeholder="Group" onSelect={(value) => this.handleGroupOnSelect(value)}>
                          {groupOptionList.map((item: OpcUaGroupDataType) => {
                            return (
                              <Option value={item.id}>{item.groupName} </Option>
                            )
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} key={"itemId"}>
                    <Form.Item label={'Item'} {...formLayout}>
                      {getFieldDecorator('itemId', {
                        rules: [{required: true, message: 'Select Item!'}],
                      })(
                        <Select placeholder="Item" >
                          {itemHistoryModel.itemList.map((item: OpcUaItemDataType) => {
                            return (
                              <Option value={item.id}>{item.fullName} </Option>
                            )
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} key={"dateTime"}>
                    <Form.Item label={'Date Time'} {...formLayout}>
                      {getFieldDecorator('dateTime', {
                        rules: [{required: true, message: 'Select Date Time!'}],
                      })(
                        <RangePicker
                          showTime={{ format: 'HH:mm:ss' }}
                          format="YYYY-MM-DD HH:mm:ss"
                          placeholder={['Start Time', 'End Time']}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={16} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                    <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Row>
          <Row style={{marginTop: 25}}>
            <Card
              title={"OPC UA Item History List"}
              bordered={false}
            >
              <Table
                dataSource={itemHistoryModel.itemHistoryList}
                columns={columns}
                loading={loading}
                pagination={paginationProps}
              />
            </Card>
          </Row>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default Form.create<ItemHistoryProps>()(ItemHistory);
