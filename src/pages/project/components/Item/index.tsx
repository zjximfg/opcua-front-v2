import React from 'react';
import {Dispatch} from "redux";
import {ItemModelStateType} from "@/models/item";
import OpcUaGroupDataType from "@/pages/project/components/Group/opcUaGroup";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import {Button, Card, Col, Divider, Form, Input, InputNumber, Modal, Radio, Row, Select, Table, Tag} from "antd";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {FormComponentProps} from "antd/es/form";
import FormLayout from "@/models/formLayout";
import {ColumnProps} from "antd/es/table";
import ItemCategoryDataType from "@/pages/project/components/Item/opcUaItem";
import OpcUaItemDataType from "@/pages/project/components/Item/opcUaItem";
import ItemObjectDataType from "@/pages/project/components/Item/opcUaItem";
import ItemTypeDataType from "@/pages/project/components/Item/opcUaItem";
import ItemCurve from "@/pages/project/components/Item/ItemCurve";

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

interface ItemProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  itemModel?: ItemModelStateType;
  opcUaConnection: Partial<OpcUaConnectionDataType>;
  opcUaGroup: Partial<OpcUaGroupDataType>;
}

interface ItemState {
  visible: boolean;
  formType: 'edit' | 'create' | undefined;
  current?: Partial<OpcUaItemDataType>;
  intervalNumber: NodeJS.Timeout | null;
  state: 'online' | 'offline';
  itemObjectOptionList: Array<ItemObjectDataType>;
  itemTypeOptionList: Array<ItemTypeDataType>;
  dbNumberShow: boolean;
  bitAddressShow: boolean;
  stringLengthShow: boolean;
  quantityShow: boolean;
  curveVisible: boolean;
  curveCurrent?: Partial<OpcUaItemDataType>;
}

@connect(({item, loading}: { item: ItemModelStateType, loading: LoadingDataType }) => {
  return {
    itemModel: item,
    loading: loading.models.item
  }
})
class Item extends React.Component<ItemProps, ItemState> {

  state: ItemState = {
    visible: false,
    formType: undefined,
    current: undefined,
    intervalNumber: null,
    state: 'offline',
    itemObjectOptionList: [],
    itemTypeOptionList: [],
    dbNumberShow: false,
    bitAddressShow: false,
    stringLengthShow: false,
    quantityShow: false,
    curveVisible: false,
    curveCurrent: undefined,
  };


  componentWillReceiveProps(nextProps: Readonly<ItemProps>, nextContext: any): void {
    if (this.props.opcUaGroup.id !== nextProps.opcUaGroup.id) {
      if (!("id" in nextProps.opcUaGroup)) return;
      if (!this.props.dispatch) return;
      this.props.dispatch({
        type: 'item/fetchOpcUaItemListByGroupId',
        payload: {opcUaGroupId: nextProps.opcUaGroup.id},
      });
      // 清除online 功能 （包括1. 按钮状态，2. 结束周期timer）
      if (this.state.intervalNumber === null) return;
      clearInterval(this.state.intervalNumber);
      this.setState({
        state: "offline",
        intervalNumber: null,
      })
    }

    if (this.props.opcUaConnection.id !== nextProps.opcUaConnection.id) {
      const {dispatch} = this.props;
      if (!dispatch) return;
      dispatch({
        type: 'item/fetchItemCategoryListByOpcUaNamespaceId',
        payload: {opcUaNamespaceId: nextProps.opcUaConnection.opcUaNamespaceId}
      });
      dispatch({
        type: 'item/fetchItemObjectListByOpcUaNamespaceId',
        payload: {opcUaNamespaceId: nextProps.opcUaConnection.opcUaNamespaceId}
      });
      dispatch({
        type: 'item/fetchItemTypeListByOpcUaNamespaceId',
        payload: {opcUaNamespaceId: nextProps.opcUaConnection.opcUaNamespaceId}
      });
      // 清除列表内的显示数据
      dispatch({
        type: 'item/resetOpcUaItemList',
      });
      // 清除online 功能 （包括1. 按钮状态，2. 结束周期timer）
      if (this.state.intervalNumber === null) return;
      clearInterval(this.state.intervalNumber);
      this.setState({
        state: "offline",
        intervalNumber: null,
      })
    }
  }

  setObjectInitValue = (itemObjectList: Array<ItemObjectDataType>, itemCategoryId: number) => {
    const list = itemObjectList.filter((item: ItemObjectDataType) => item.itemCategoryId === itemCategoryId);
    this.setState({
      itemObjectOptionList: list
    });
  };

  setTypeInitValue = (itemTypeList: Array<ItemTypeDataType>, itemCategoryId: number) => {
    const list = itemTypeList.filter((item: ItemTypeDataType) => item.itemCategoryId === itemCategoryId);
    this.setState({
      itemTypeOptionList: list
    });
  };

  showAddModal = () => {
    this.setState({
      visible: true,
      formType: "create",
      current: undefined,
    });
    if (!this.props.itemModel) return;
    this.setObjectInitValue(this.props.itemModel.itemObjectList, 1);
    this.setTypeInitValue(this.props.itemModel.itemTypeList, 1);
  };

  showCurveModal = (item: OpcUaItemDataType) => {
    this.setState({
      curveVisible: true,
      curveCurrent: item,
    })
  };

  showEditModal = (item: OpcUaItemDataType): void => {
    if (!this.props.itemModel) return;

    const itemObject = this.props.itemModel.itemObjectList.find((item: ItemObjectDataType) => item.id === this.props.form.getFieldValue("itemObjectId"));
    const itemType = this.props.itemModel.itemTypeList.find((item: ItemTypeDataType) => item.id === this.props.form.getFieldValue("itemTypeId"));
    this.setState({
      visible: true,
      formType: "edit",
      current: item,
      dbNumberShow: itemObject ? itemObject.name === 'db' : false,
      bitAddressShow: itemType ? itemType.s7Name === 'x' : false,
      stringLengthShow: itemType ? itemType.s7Name === 's' : false,
      quantityShow: item.isArray ? (itemType ? itemType.s7Name === 'tda' : true) : false
    });
    this.setObjectInitValue(this.props.itemModel.itemObjectList, item.itemCategoryId);
    this.setTypeInitValue(this.props.itemModel.itemTypeList, item.itemCategoryId);
  };

  handleDelete = (item: OpcUaItemDataType): void => {
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
      type: 'item/deleteItemFetch',
      payload: {id: id},
      callback: () => {
        dispatch({
          type: 'item/fetchOpcUaItemListByGroupId',
          payload: {opcUaGroupId: this.props.opcUaGroup.id},
        });
      },
    })
  };

  updateOnlineData = () => {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'item/fetchOnlineDataByGroupId',
      payload: {opcUaGroupId: this.props.opcUaGroup.id},
    });
  };

  handleOnline = () => {
    this.setState({
      state: 'online',
      intervalNumber: setInterval(this.updateOnlineData, 2 * 1000),
    });
  };

  handleOffline = () => {
    if (this.state.intervalNumber === null) return;
    clearInterval(this.state.intervalNumber);
    this.setState({
      state: 'offline',
      intervalNumber: null,
    });
  };

  handleSearch = (value: string) => {
    this.setState({
      // TODO
    })
  };

  handleSubmit = (): void => {
    const {dispatch, form} = this.props;
    if (!dispatch) return;
    form.validateFields((err: string | undefined, fieldsValue: OpcUaItemDataType): void => {
      if (err) return;
      const item: OpcUaItemDataType = {
        ...fieldsValue
      };
      if (this.state.formType === 'edit') {
        dispatch({
          type: 'item/editOpcUaItemFetch',
          payload: item,
          callback: () => {
            dispatch({
              type: 'item/fetchOpcUaItemListByGroupId',
              payload: {opcUaGroupId: this.props.opcUaGroup.id},
            });
          }
        });
      } else {
        if (this.state.formType === 'create') {
          dispatch({
            type: 'item/createOpcUaItemFetch',
            payload: item,
            callback: () => {
              dispatch({
                type: 'item/fetchOpcUaItemListByGroupId',
                payload: {opcUaGroupId: this.props.opcUaGroup.id},
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

  handleCategoryOnChange = (item: number) => {
    if (!this.props.itemModel) return;
    this.setObjectInitValue(this.props.itemModel.itemObjectList, item);
    this.setTypeInitValue(this.props.itemModel.itemTypeList, item);
  };

  handleItemObjectOnSelect = (value: any) => {
    if (!this.props.itemModel) return;
    const itemObject = this.props.itemModel.itemObjectList.find((item: ItemObjectDataType) => item.id === value);
    this.setState({
      dbNumberShow: itemObject ? itemObject.name === 'db' : false,
    })
  };
  handleItemTypeOnSelect = (value: any) => {
    if (!this.props.itemModel) return;
    const itemType = this.props.itemModel.itemTypeList.find((item: ItemTypeDataType) => item.id === value);
    this.setState({
      bitAddressShow: itemType ? itemType.s7Name === 'x' : false,
      stringLengthShow: itemType ? itemType.s7Name === 's' : false,
    })
  };
  handleIsArrayOnChange = (item: boolean) => {
    if (!this.props.itemModel) return;
    const itemType = this.props.itemModel.itemTypeList.find((item: ItemTypeDataType) => item.id === this.props.form.getFieldValue("itemTypeId"));
    this.setState({
      quantityShow: item ? (itemType ? itemType.s7Name === 'tda' : true) : false
    })
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {itemModel, opcUaConnection, opcUaGroup, form} = this.props;

    const {visible, current = {}, state, itemObjectOptionList, itemTypeOptionList, curveCurrent = {}, curveVisible} = this.state;

    const {getFieldDecorator} = form;

    if (!itemModel) return;


    const formLayout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };

    const columns: ColumnProps<OpcUaItemDataType>[] = [
      {
        key: 'itemCategoryId',
        title: 'Category',
        dataIndex: 'itemCategoryId',
        render: (text, record) => {
          const itemCategory = itemModel.itemCategoryList.find((item: ItemCategoryDataType) => item.id === record.itemCategoryId);
          return itemCategory ? itemCategory.name : '';
        }
      },
      {
        key: 'fullName',
        title: 'Name',
        dataIndex: 'fullName',
      },
      {
        key: 'itemObjectId',
        title: 'Object',
        dataIndex: 'itemObjectId',
        render: (text, record) => {
          const itemObject = itemModel.itemObjectList.find((item: ItemObjectDataType) => item.id === record.itemObjectId);
          return itemObject ? itemObject.name : '';
        }
      },
      {
        key: 'itemTypeId',
        title: 'Type',
        dataIndex: 'itemTypeId',
        render: (text, record) => {
          const itemType = itemModel.itemTypeList.find((item: ItemTypeDataType) => item.id === record.itemTypeId);
          return itemType ? itemType.s7Name : '';
        }
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description'
      },
      {
        key: 'currentValue',
        title: 'Value',
        dataIndex: 'currentValue',
      },
      {
        key: 'quality',
        title: 'Quality',
        dataIndex: 'quality',
        render: quality => {
          let color = 'geekblue';
          if (!quality || this.state.state === 'offline') return (<span>
            <Tag color={color} key={"offline"}>
                {"offline".toUpperCase()}
            </Tag>
          </span>);
          if (quality === 'good') color = 'green';
          if (quality === 'bad') color = 'volcano';
          return (
            <span>
              <Tag color={color} key={quality}>
                {quality.toUpperCase()}
              </Tag>
            </span>
          )
        }
      },
      {
        key: 'action',
        title: 'Action',
        render: (text, record) => renderTableAction(record)
      }
    ];

    const renderTableAction = (item: OpcUaItemDataType): React.ReactNode => {
      return (
        <div>
          <a key={"curve"} onClick={e => {
            e.preventDefault();
            this.showCurveModal(item);
          }}>View</a>
          <Divider type={"vertical"}/>
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
      if (!this.props.itemModel) return;
      getFieldDecorator("id", {
        initialValue: current.id,
      });
      getFieldDecorator("opcUaConnectionId", {
        initialValue: current.opcUaConnectionId || opcUaConnection.id
      });
      getFieldDecorator("opcUaGroupId", {
        initialValue: current.opcUaGroupId || opcUaGroup.id,
      });
      return (
        <Form>
          <FormItem label={"Category"} {...formLayout}>
            {
              getFieldDecorator("itemCategoryId", {
                initialValue: current.itemCategoryId || 1,
                rules: [{required: true, message: "Please select the Category for Item!"}]
              })(
                <Radio.Group onChange={(e) => {
                  this.handleCategoryOnChange(e.target.value);
                }}>
                  {itemModel.itemCategoryList.map((item: ItemCategoryDataType) => {
                    return (
                      <Radio value={item.id}>{item.name}</Radio>
                    )
                  })}
                </Radio.Group>
              )
            }
          </FormItem>
          <FormItem label={"Object"} {...formLayout}>
            {
              getFieldDecorator("itemObjectId", {
                initialValue: current.itemObjectId,
                rules: [{required: true, message: "Please select the Item Object!"}]
              })(
                <Select placeholder={'Please select the Item Object'}
                        onSelect={(value) => this.handleItemObjectOnSelect(value)}>
                  {itemObjectOptionList.map((item: ItemObjectDataType) => {
                    return (
                      <Option value={item.id}>{item.name}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
          <FormItem label={"DB number"} {...formLayout}>
            {
              getFieldDecorator("dbNumber", {
                initialValue: current.dbNumber,
                rules: [{required: this.state.dbNumberShow, message: "Please input the DB number"}]
              })(
                <InputNumber placeholder={'DB number'} disabled={!this.state.dbNumberShow}/>
              )
            }
          </FormItem>
          <FormItem label={"Address"} {...formLayout}>
            {
              getFieldDecorator("address", {
                initialValue: current.address,
                rules: [{required: this.state.dbNumberShow, message: "Please input the address"}]
              })(
                <InputNumber placeholder={'Address'}/>
              )
            }
          </FormItem>
          <FormItem label={"Type"} {...formLayout}>
            {
              getFieldDecorator("itemTypeId", {
                initialValue: current.itemTypeId,
                rules: [{required: true, message: "Please select the Item Type!"}]
              })(
                <Select placeholder={'Please select the Item Type'}
                        onSelect={(value) => this.handleItemTypeOnSelect(value)}>
                  {itemTypeOptionList.map((item: ItemTypeDataType) => {
                    return (
                      <Option value={item.id}>{item.s7Name}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
          <FormItem label={"Bit Address"} {...formLayout}>
            {
              getFieldDecorator("bitAddress", {
                initialValue: current.bitAddress,
                rules: [{required: this.state.bitAddressShow, message: "Please input the Bit Address"}]
              })(
                <InputNumber placeholder={'Bit Address'} disabled={!this.state.bitAddressShow}/>
              )
            }
          </FormItem>
          <FormItem label={"String Length"} {...formLayout}>
            {
              getFieldDecorator("stringLength", {
                initialValue: current.stringLength,
                rules: [{required: this.state.stringLengthShow, message: "Please input the String Length"}]
              })(
                <InputNumber placeholder={'String Length'} disabled={!this.state.stringLengthShow}/>
              )
            }
          </FormItem>
          <FormItem label={"IsArray?"} {...formLayout}>
            {
              getFieldDecorator("isArray", {
                initialValue: current.isArray || false,
                rules: [{required: true, message: "Please Select whether is array or not"}]
              })(
                <Radio.Group onChange={(e) => {
                  this.handleIsArrayOnChange(e.target.value);
                }}>
                  <Radio value={false}>Not Array</Radio>
                  <Radio value={true}>Is Array</Radio>
                </Radio.Group>
              )
            }
          </FormItem>
          <FormItem label={"Quantity"} {...formLayout}>
            {
              getFieldDecorator("quantity", {
                initialValue: current.quantity,
                rules: [{required: this.state.quantityShow, message: "Please input the Quantity"}]
              })(
                <InputNumber placeholder={'Quantity'} disabled={!this.state.quantityShow}/>
              )
            }
          </FormItem>
          <FormItem label={"Description"} {...formLayout}>
            {
              getFieldDecorator("description", {
                initialValue: current.description,
                rules: [{required: true, message: "Please input the Description"}]
              })(
                <Input type={"text"} placeholder={'Description'}/>
              )
            }
          </FormItem>
        </Form>
      )
    };

    const extraContent: React.ReactNode = (
      <Row>
        <Col span={6}>
          <Button type={"primary"} icon={"plus"} disabled={opcUaGroup.id === 0 || !('id' in opcUaGroup)}
                  onClick={this.showAddModal}>Add</Button>
        </Col>
        <Col span={6}>
          {state === 'offline' ?
            (<Button type={"primary"} onClick={this.handleOnline}>Online</Button>) :
            (<Button type={"danger"} onClick={this.handleOffline}>Offline</Button>)
          }
        </Col>
        <Col span={12}>
          <Search placeholder={"Please input key word to search"} onSearch={value => this.handleSearch(value)}/>
        </Col>
      </Row>
    );

    return (
      <>
        <Card
          title={"OPC UA Item List"}
          bordered={false}
          extra={extraContent}
        >
          <Table
            dataSource={itemModel.opcUaItemList}
            columns={columns}
          />
        </Card>
        <Modal
          title={"Edit Item Properties"}
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
        <Modal
          title={"Item <" + curveCurrent.fullName + "> Curve"}
          width={900}
          bodyStyle={{padding: '28px 0 0'}}
          destroyOnClose
          visible={this.state.curveVisible}
          onOk={() => {
            this.setState({
              curveVisible: false,
              curveCurrent: undefined
            })
          }}
          onCancel={() => {
            this.setState({
              curveVisible: false,
              curveCurrent: undefined
            })
          }}
        >
          <ItemCurve item={curveCurrent} visible={curveVisible}/>
        </Modal>
      </>
    );
  }

}

export default Form.create<ItemProps>()(Item);


