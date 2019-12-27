import React from 'react';
import {Dispatch} from "redux";
import {ItemModelStateType} from "@/models/item";
import OpcUaGroupDataType from "@/pages/project/components/Group/opcUaGroup";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import {Button, Card, Col, Divider, Form, Input, Modal, Row, Select, Table} from "antd";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {FormComponentProps} from "antd/es/form";
import FormLayout from "@/models/formLayout";
import {ColumnProps} from "antd/es/table";
import ItemCategoryDataType from "@/pages/project/components/Item/opcUaItem";
import OpcUaItemDataType from "@/pages/project/components/Item/opcUaItem";
import ItemObjectDataType from "@/pages/project/components/Item/opcUaItem";
import ItemTypeDataType from "@/pages/project/components/Item/opcUaItem";

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

interface ItemProps extends FormComponentProps{
  dispatch?: Dispatch<any>;
  loading?: boolean;
  itemModel?: ItemModelStateType;
  opcUaConnection: Partial<OpcUaConnectionDataType>;
  opcUaGroup: Partial<OpcUaGroupDataType>;
}

interface ItemState {
  visible: boolean;
  formType: 'edit' | 'create' | undefined;
  current?: Partial<OpcUaGroupDataType>;
  selectedRowKeys: string[] | number[];
  intervalNumber: number;
  state: 'online' | 'offline';
}

@connect(({item, loading}: {item: ItemModelStateType, loading: LoadingDataType}) => {
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
    selectedRowKeys: [],
    intervalNumber: 0,
    state: 'offline',
  };

  componentDidMount(): void {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'item/fetchItemCategoryListByOpcUaNamespaceId',
      payload: {opcUaNamespaceId: this.props.opcUaConnection.opcUaNamespaceId}
    });
    dispatch({
      type: 'item/fetchItemObjectListByOpcUaNamespaceId',
      payload: {opcUaNamespaceId: this.props.opcUaConnection.opcUaNamespaceId}
    });
    dispatch({
      type: 'item/fetchItemTypeListByOpcUaNamespaceId',
      payload: {opcUaNamespaceId: this.props.opcUaConnection.opcUaNamespaceId}
    });

  }

  componentWillReceiveProps(nextProps: Readonly<ItemProps>, nextContext: any): void {
    if (this.props.opcUaGroup.id !== nextProps.opcUaGroup.id) {
      if (!this.props.dispatch) return;
      this.props.dispatch({
        type: 'item/fetchOpcUaItemListByGroupId',
        payload: {opcUaGroupId: nextProps.opcUaGroup.id},
      });
    }
  }

  showAddModal = () => {
    this.setState({
      visible: true,
      formType: "create",
      current: undefined
    });
  };

  showEditModal = (item: OpcUaItemDataType): void => {
    this.setState({
      visible: true,
      formType: "edit",
      current: item
    })
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

  handleOnline = () => {
    this.setState({
      state: 'online',
    })
  };

  handleOffline = () => {
    this.setState({
      state: 'offline',
    })
  };

  handleSearch = (value: string) => {
    this.setState({
      // TODO
    })
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {itemModel, opcUaConnection, opcUaGroup, form} = this.props;

    const {visible, current = {}, selectedRowKeys, state} = this.state;

    if (!itemModel) return;


    const formLaout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };

    const columns: ColumnProps<OpcUaItemDataType>[] = [
      {
        key: 'itemCategoryId',
        title: 'Category',
        dataIndex: 'itemCategoryId',
        render: (text, record) => {
          const itemCategory = itemModel.itemCategoryList.find((item: ItemCategoryDataType) => item.id === record.id);
          return itemCategory? itemCategory.name : '';
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
          const itemObject = itemModel.itemObjectList.find((item: ItemObjectDataType) => item.id === record.id);
          return itemObject? itemObject.name : '';
        }
      },
      {
        key: 'itemTypeId',
        title: 'Type',
        dataIndex: 'itemTypeId',
        render: (text, record) =>{
          const itemType = itemModel.itemTypeList.find((item: ItemTypeDataType) => item.id === record.id);
          return itemType? itemType.s7Name : '';
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
        key: 'action',
        title: 'Action',
        render: (text, record) => renderTableAction(record)
      }
    ];

    const renderTableAction = (item: OpcUaItemDataType): React.ReactNode => {
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


    const extraContent: React.ReactNode = (
      <Row>
        <Col span={6}>
          <Button type={"primary"} icon={"plus"} disabled={opcUaGroup.id === 0 || !('id' in opcUaGroup)} onClick={this.showAddModal}>Add</Button>
        </Col>
        <Col span={6}>
          {state === 'offline'?
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
      </>
    );
  }

}

export default Form.create<ItemProps>()(Item);


