import {FormComponentProps} from "antd/es/form";
import {Dispatch} from "redux";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import React from "react";
import {Button, Card, Col, Divider, Form, Input, Modal, Row, Table} from "antd";
import {AlarmCategoryModelStateType} from "@/models/alarmCategory";
import {ColumnProps} from "antd/es/table";
import FormLayout from "@/models/formLayout";
import AlarmCategoryDataType from "@/pages/project/alarmConfig/alarmBase/components/AlarmCategory/alarmCategory";

const FormItem = Form.Item;

interface AlarmCategoryProps extends FormComponentProps{
  dispatch?: Dispatch<any>;
  alarmCategoryModel?: AlarmCategoryModelStateType;
  loading?: boolean;
}

interface AlarmCategoryState {
  visible: boolean;
  formType: 'edit' | 'create' | undefined;
  current?: Partial<AlarmCategoryDataType>;
}

@connect(({alarmCategory, loading}: {alarmCategory: AlarmCategoryModelStateType, loading: LoadingDataType})=>{
  return {
    alarmCategoryModel: alarmCategory,
    loading: loading.models.alarmCategory,
  }
})
class AlarmCategory extends React.Component<AlarmCategoryProps, AlarmCategoryState> {
  state: AlarmCategoryState = {
    visible: false,
    formType: undefined,
    current: undefined,
  };

  componentDidMount(): void {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'alarmCategory/fetchAlarmCategoryList',
    });
  }

  showAddModal = () => {
    this.setState({
      visible: true,
      formType: "create",
      current: undefined,
    });
  };

  showEditModal = (item: AlarmCategoryDataType): void => {
    if (!this.props.alarmCategoryModel) return;
    this.setState({
      visible: true,
      formType: "edit",
      current: item,
    });
  };

  handleDelete = (item: AlarmCategoryDataType): void => {
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
      type: 'alarmCategory/deleteAlarmCategoryFetch',
      payload: {id: id},
      callback: () => {
        dispatch({
          type: 'alarmCategory/fetchAlarmCategoryList',
        });
      },
    })
  };

  handleSubmit = (): void => {
    const {dispatch, form} = this.props;
    if (!dispatch) return;
    form.validateFields((err: string | undefined, fieldsValue: AlarmCategoryDataType): void => {
      if (err) return;
      const item: AlarmCategoryDataType = {
        ...fieldsValue
      };
      if (this.state.formType === 'edit') {
        dispatch({
          type: 'alarmCategory/editAlarmCategoryFetch',
          payload: item,
          callback: () => {
            dispatch({
              type: 'alarmCategory/fetchAlarmCategoryList',
            });
          }
        });
      } else {
        if (this.state.formType === 'create') {
          dispatch({
            type: 'alarmCategory/createAlarmCategoryFetch',
            payload: item,
            callback: () => {
              dispatch({
                type: 'alarmCategory/fetchAlarmCategoryList',
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

    const {alarmCategoryModel, loading, form} = this.props;

    const {visible, current = {}} = this.state;

    const {getFieldDecorator} = form;

    const formLayout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };

    if (!alarmCategoryModel) return;

    const extraContent: React.ReactNode = (
      <Row>
        <Col span={24}>
          <Button type={"primary"} icon={"plus"}
                  onClick={this.showAddModal}>Add</Button>
        </Col>
      </Row>
    );

    const columns: ColumnProps<AlarmCategoryDataType>[] = [
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

    const renderTableAction = (item: AlarmCategoryDataType): React.ReactNode => {
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
          title={"OPC UA Alarm Category"}
          bordered={false}
          extra={extraContent}
        >
          <Table
            dataSource={alarmCategoryModel.alarmCategoryList}
            columns={columns}
            loading={loading}
          />
        </Card>
        <Modal
          title={"Edit Alarm Category Properties"}
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

export default Form.create<AlarmCategoryProps>()(AlarmCategory)
