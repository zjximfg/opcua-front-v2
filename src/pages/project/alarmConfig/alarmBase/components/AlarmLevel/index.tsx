import {FormComponentProps} from "antd/es/form";
import {Dispatch} from "redux";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import React from "react";
import {Button, Card, Col, Divider, Form, Input, Modal, Row, Table} from "antd";
import {ColumnProps} from "antd/es/table";
import FormLayout from "@/models/formLayout";
import AlarmLevelDataType from "@/pages/project/alarmConfig/alarmBase/components/AlarmLevel/alarmLevel";
import {AlarmLevelModelStateType} from "@/models/alarmLevel";

const FormItem = Form.Item;

interface AlarmLevelProps extends FormComponentProps{
  dispatch?: Dispatch<any>;
  alarmLevelModel?: AlarmLevelModelStateType;
  loading?: boolean;
}

interface AlarmLevelState {
  visible: boolean;
  formType: 'edit' | 'create' | undefined;
  current?: Partial<AlarmLevelDataType>;
}

@connect(({alarmLevel, loading}: {alarmLevel: AlarmLevelModelStateType, loading: LoadingDataType})=>{
  return {
    alarmLevelModel: alarmLevel,
    loading: loading.models.alarmLevel,
  }
})
class AlarmLevel extends React.Component<AlarmLevelProps, AlarmLevelState> {
  state: AlarmLevelState = {
    visible: false,
    formType: undefined,
    current: undefined,
  };

  componentDidMount(): void {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'alarmLevel/fetchAlarmLevelList',
    });
  }

  showAddModal = () => {
    this.setState({
      visible: true,
      formType: "create",
      current: undefined,
    });
  };

  showEditModal = (item: AlarmLevelDataType): void => {
    if (!this.props.alarmLevelModel) return;
    this.setState({
      visible: true,
      formType: "edit",
      current: item,
    });
  };

  handleDelete = (item: AlarmLevelDataType): void => {
    Modal.confirm({
      title: 'Delete Data',
      content: 'Are you sure delete this data?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => this.deleteItem(item.id),
    })
  };

  deleteItem = (id: number): void => {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'alarmLevel/deleteAlarmLevelFetch',
      payload: {id: id},
      callback: () => {
        dispatch({
          type: 'alarmLevel/fetchAlarmLevelList',
        });
      },
    })
  };

  handleSubmit = (): void => {
    const {dispatch, form} = this.props;
    if (!dispatch) return;
    form.validateFields((err: string | undefined, fieldsValue: AlarmLevelDataType): void => {
      if (err) return;
      const item: AlarmLevelDataType = {
        ...fieldsValue
      };
      if (this.state.formType === 'edit') {
        dispatch({
          type: 'alarmLevel/editAlarmLevelFetch',
          payload: item,
          callback: () => {
            dispatch({
              type: 'alarmLevel/fetchAlarmLevelList',
            });
          }
        });
      } else {
        if (this.state.formType === 'create') {
          dispatch({
            type: 'alarmLevel/createAlarmLevelFetch',
            payload: item,
            callback: () => {
              dispatch({
                type: 'alarmLevel/fetchAlarmLevelList',
              });
            }
          });
        }
      }
      this.setState({
        visible: false,
        formType: undefined,
        current: undefined
      })
    })
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {alarmLevelModel, loading, form} = this.props;

    const {visible, current = {}} = this.state;

    const {getFieldDecorator} = form;

    const formLayout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };

    if (!alarmLevelModel) return;

    const extraContent: React.ReactNode = (
      <Row>
        <Col span={24}>
          <Button type={"primary"} icon={"plus"}
                  onClick={this.showAddModal}>Add</Button>
        </Col>
      </Row>
    );

    const columns: ColumnProps<AlarmLevelDataType>[] = [
      {
        key: 'id',
        title: 'Id',
        dataIndex: 'id',
      },
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description'
      },
      {
        key: 'action',
        title: 'Action',
        render: (text, record) => renderTableAction(record)
      }
    ];

    const renderTableAction = (item: AlarmLevelDataType): React.ReactNode => {
      return (
        <div>
          <a key={"edit"} onClick={e => {
            e.preventDefault();
            this.showEditModal(item);
          }}>Edit</a>
          <Divider type={"vertical"}/>
          <a key={"delete"} onClick={e => {
            e.preventDefault();
            this.handleDelete(item);
          }}>Delete</a>
        </div>
      )
    };


    const renderForm = (): React.ReactNode => {
      getFieldDecorator("id", {
        initialValue: current.id,
      });
      return (
        <Form>
          <FormItem label={"Name"} {...formLayout}>
            {
              getFieldDecorator("name", {
                initialValue: current.name,
                rules: [{required: true, message: "Please input the Name"}]
              })(
                <Input type={"text"} placeholder={'Name'} />
              )
            }
          </FormItem>
          <FormItem label={"Description"} {...formLayout}>
            {
              getFieldDecorator("description", {
                initialValue: current.description,
              })(
                <Input type={"text"} placeholder={'Description'}/>
              )
            }
          </FormItem>
        </Form>
      )
    };

    return (
      <>
        <Card
          title={"OPC UA Alarm Level"}
          bordered={false}
          extra={extraContent}
        >
          <Table
            dataSource={alarmLevelModel.alarmLevelList}
            columns={columns}
            loading={loading}
          />
        </Card>
        <Modal
          title={"Edit Alarm Level Properties"}
          width={800}
          bodyStyle={{padding: '28px 0 0'}}
          destroyOnClose
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({
              visible: false,
              formType: undefined,
              current: undefined
            })
          }}
        >
          {renderForm()}
        </Modal>
      </>
    );
  }
}

export default Form.create<AlarmLevelProps>()(AlarmLevel)
