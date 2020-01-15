import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Dispatch} from "redux";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Card, Col, Divider, Form, Input, Modal, Row, Select, Table, Tag} from "antd";
import SmsUserDataType, {SmsUserQueryParams} from "@/pages/sms/smsUser/smsUser";
import {connect} from "dva";
import {SmsUserModelStateType} from "@/models/smsUser";
import LoadingDataType from "@/models/loading";
import {ColumnProps} from "antd/es/table";
import {PaginationProps} from "antd/es/pagination";
import FormLayout from "@/models/formLayout";
import RoleDataType from "@/pages/sms/role/Role";
import SmsUserForm from "@/pages/sms/smsUser/components/SmsUserForm";

const Option = Select.Option;

interface SmsUserProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  smsUserModel: SmsUserModelStateType;
  loading: boolean;
}

interface SmsUserState {
  visible: boolean;
  formType: 'edit' | 'create' | undefined;
  current?: Partial<SmsUserDataType>;
  queryParams: SmsUserQueryParams;
}

@connect(({smsUser, loading}: {smsUser: SmsUserModelStateType, loading: LoadingDataType})=> {
  return {
    smsUserModel: smsUser,
    loading: loading.models.smsUser
  }
})
class SmsUser extends React.Component<SmsUserProps, SmsUserState> {

  state: SmsUserState = {
    visible: false,
    formType: undefined,
    current: undefined,
    queryParams: {
      currentPage: 1,
      pageSize: 10,
    },
  };

  componentDidMount(): void {
    const {dispatch} = this.props;
    dispatch({
      type: "smsUser/fetchRoleList"
    });
    dispatch({
      type: "smsUser/fetchSmsUserPage",
      payload: this.state.queryParams,
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
        type: 'smsUser/fetchSmsUserPage',
        payload: this.state.queryParams,
      });
    })
  };

  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.setState({
        queryParams: {
          ...this.state.queryParams,
          roleId: values.roleId,
          name: values.name,
          telephone: values.telephone,
          description: values.description,
        }
      }, () => {
        const {dispatch} = this.props;
        dispatch({
          type: 'smsUser/fetchSmsUserPage',
          payload: this.state.queryParams,
        });
      });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  showAddModal = () => {
    this.setState({
      visible: true,
      formType: "create",
      current: undefined,
    })
  };

  showEditModal = (item: SmsUserDataType): void => {
    this.setState({
      visible: true,
      formType: "edit",
      current: item,
    });
  };

  handleDelete = (item: SmsUserDataType): void => {
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
      type: 'role/deleteRoleFetch',
      payload: {id: id},
      callback: () => {
        dispatch({
          type: 'role/fetchRoleList',
        });
      },
    });
  };

  changeStateClose = () => {
    this.setState({
      visible: false,
      formType: undefined,
      current: undefined
    })
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {queryParams, visible, current = {}, formType} = this.state;

    const {smsUserModel, loading, form} = this.props;

    const {getFieldDecorator} = form;

    const renderAddButton = (): React.ReactNode => {
      return  <Button type={"primary"} onClick={this.showAddModal} icon={"plus"} style={{marginRight: 20}}>Add New</Button>
    };

    const renderTableAction = (item: SmsUserDataType): React.ReactNode => {
      return (
        <div>
          <a key={"Edit"} onClick={e => {
            e.preventDefault();
            this.showEditModal(item);
          }}>Edit</a>
          <Divider type={"vertical"}/>
          <a key={"Delete"} onClick={e => {
            e.preventDefault();
            this.handleDelete(item);
          }}>Delete</a>
        </div>
      )
    };

    const columns: ColumnProps<SmsUserDataType>[] = [
      {
        key: 'roleId',
        title: 'Role Group',
        dataIndex: 'roleId',
        render: (text, record) => {
          const smsUser = smsUserModel.roleList.find(item => item.id === record.roleId);
          return smsUser? smsUser.name : '';
        }
      },
      {
        key: 'name',
        title: 'User Name',
        dataIndex: 'name',
      },
      {
        key: 'gender',
        title: 'Gender',
        dataIndex: 'gender',
        render: (text, record) => {
          const color = record.gender? 'green' : 'geekblue';
          const tag = record.gender? 'female': 'male';
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        }
      },
      {
        key: 'telephone',
        title: 'Telephone Number',
        dataIndex: 'telephone',
      },
      {
        key: 'email',
        title: 'Email',
        dataIndex: 'email',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'action',
        title: 'Action',
        render: (text, record) => renderTableAction(record)
      }
    ];

    const paginationProps: PaginationProps = {
      showSizeChanger: true,
      pageSize: queryParams.pageSize,
      total: smsUserModel.total || 0,
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
                  <Col span={8} key={"roleId"}>
                    <Form.Item label={'Role Group'} {...formLayout}>
                      {getFieldDecorator('roleId', {
                      })(
                        <Select placeholder="Role Group" >
                          {smsUserModel.roleList.map((item: RoleDataType) => {
                            return (
                              <Option value={item.id}>{item.name} </Option>
                            )
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} key={"name"}>
                    <Form.Item label={'User Name'} {...formLayout}>
                      {getFieldDecorator('name', {
                      })(
                        <Input placeholder="User Name" type={"text"} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} key={"telephone"}>
                    <Form.Item label={'Telephone'} {...formLayout}>
                      {getFieldDecorator('telephone', {
                      })(
                        <Input placeholder="Telephone" type={"text"} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} key={"description"}>
                    <Form.Item label={'Description'} {...formLayout}>
                      {getFieldDecorator('description', {
                      })(
                        <Input placeholder="Description" type={"text"} />
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
              title={"SMS User List"}
              bordered={false}
              extra={renderAddButton()}
            >
              <Table
                dataSource={smsUserModel.smsUserList}
                columns={columns}
                loading={loading}
                pagination={paginationProps}
              />
            </Card>
          </Row>
        </PageHeaderWrapper>
        <SmsUserForm
          visible={visible}
          formType={formType}
          current={current}
          roleList={smsUserModel.roleList}
          queryParams={queryParams}
          changeStateClose={this.changeStateClose}
        />
      </>
    );
  }
}

export default Form.create<SmsUserProps>()(SmsUser);
