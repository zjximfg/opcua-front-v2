import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Dispatch} from "redux";
import {AlarmHistoryModelStateType} from "@/models/alarmHistory";
import {Button, Card, Col, DatePicker, Form, Row, Select, Table, Tag} from "antd";
import {AlarmHistoryDataType, AlarmHistoryQueryParams} from "@/pages/history/alarmHistory/alarmHistory";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import FormLayout from "@/models/formLayout";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import AlarmDataType from "@/pages/project/components/Alarm/alarm";
import {ColumnProps} from "antd/es/table";
import {PaginationProps} from "antd/es/pagination";
import moment from 'moment';

const Option = Select.Option;

const {RangePicker} = DatePicker;

interface AlarmHistoryProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  alarmHistoryModel: AlarmHistoryModelStateType;
  loading: boolean;
}

interface AlarmHistoryState {
  queryParams: AlarmHistoryQueryParams;
  timeRequired: boolean;
}

@connect(({alarmHistory, loading}: { alarmHistory: AlarmHistoryModelStateType, loading: LoadingDataType }) => {
  return {
    alarmHistoryModel: alarmHistory,
    loading: loading.models.alarmHistory
  }
})
class AlarmHistory extends React.Component<AlarmHistoryProps, AlarmHistoryState> {

  state: AlarmHistoryState = {
    queryParams: {
      currentPage: 1,
      pageSize: 10,
    },
    timeRequired: true,
  };

  componentDidMount(): void {
    // 获取connectionList
    const {dispatch} = this.props;
    dispatch({
      type: 'alarmHistory/fetchConnectionList',
    });
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
        type: 'alarmHistory/fetchAlarmHistoryPage',
        payload: this.state.queryParams,
      });
    })
  };

  handleConnectionOnSelect = (value: any) => {
    // 获取alarmList
    const {dispatch} = this.props;
    dispatch({
      type: 'alarmHistory/fetchAlarmList',
      payload: {opcUaConnectionId: value}
    })
  };

  handleAlarmStateOnSelect = (value: any) => {
    if (value === "Current") {
      this.setState({
        timeRequired: false
      })
    } else {
      this.setState({
        timeRequired: true
      })
    }
  };

  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      let startTime = moment().format("YYYY-MM-DD HH:mm:ss");
      let endTime = moment().format("YYYY-MM-DD HH:mm:ss");
      if (values.alarmState !== 'Current') {
        startTime = values.dateTime[0].format("YYYY-MM-DD HH:mm:ss");
        endTime = values.dateTime[1].format("YYYY-MM-DD HH:mm:ss");
      }
      this.setState({
        queryParams: {
          ...this.state.queryParams,
          alarmState: values.alarmState,
          alarmId: values.alarmId,
          startTime: startTime,
          endTime: endTime,
        }
      }, () => {
        const {dispatch} = this.props;
        dispatch({
          type: 'alarmHistory/fetchAlarmHistoryPage',
          payload: this.state.queryParams,
        });
      });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {queryParams, timeRequired} = this.state;

    const {alarmHistoryModel, loading, form} = this.props;

    const {getFieldDecorator} = form;

    const columns: ColumnProps<AlarmHistoryDataType>[] = [
      {
        key: 'alarmName',
        title: 'Name',
        dataIndex: 'alarmName',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'Alarm State',
        title: 'Coming State',
        render: (text, record) => {
          const color = record.isComing? 'volcano': "geekblue";
          const tag = record.isComing? 'Coming': 'Leaving';
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        }
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
      total: alarmHistoryModel.total || 0,
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
                  <Col span={8} key={"alarmState"}>
                    <Form.Item label={'State'} {...formLayout}>
                      {getFieldDecorator('alarmState', {
                        rules: [{required: true, message: 'Select Connection!'}],
                      })(
                        <Select placeholder="State" onSelect={value => this.handleAlarmStateOnSelect(value)}>
                          <Option value={"Leaving"}>Leaving</Option>
                          <Option value={"Coming"}>Coming</Option>
                          <Option value={"Both"}>Both</Option>
                          <Option value={"Current"}>Current</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} key={"connectionId"}>
                    <Form.Item label={'Connection'} {...formLayout}>
                      {getFieldDecorator('connectionId', {
                        rules: [{required: true, message: 'Select Connection!'}],
                      })(
                        <Select placeholder="Connection" onSelect={(value) => this.handleConnectionOnSelect(value)}>
                          {alarmHistoryModel.connectionList.map((item: OpcUaConnectionDataType) => {
                            return (
                              <Option value={item.id}>{item.connectionName} </Option>
                            )
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} key={"alarmId"}>
                    <Form.Item label={'Alarm'} {...formLayout}>
                      {getFieldDecorator('alarmId', {
                      })(
                        <Select placeholder="Alarm">
                          <Option value={0}>--All--</Option>
                          {alarmHistoryModel.alarmList.map((item: AlarmDataType) => {
                            return (
                              <Option value={item.id}>{item.fullName + " | " + item.description} </Option>
                            )
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} key={"dateTime"}>
                    <Form.Item label={'Date Time'} {...formLayout}>
                      {getFieldDecorator('dateTime', {
                        rules: [{required: timeRequired, message: 'Select Date Time!'}],
                      })(
                        <RangePicker
                          showTime={{format: 'HH:mm:ss'}}
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
              title={"OPC UA Alarm History List"}
              bordered={false}
            >
              <Table
                dataSource={alarmHistoryModel.alarmHistoryList}
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

export default Form.create<AlarmHistoryProps>()(AlarmHistory)
