import React from 'react';
import {Card, Col, Row, Tree} from "antd";
import OpcUaNode from "@/pages/explorer/components/OpcUaNode";
import OpcUaDataValue from "@/pages/explorer/components/OpcUaDataValue";
import OpcUaServer from "@/pages/explorer/components/OpcUaServer";
import {TreeNode} from "antd/es/tree-select/interface";
import {Dispatch} from "redux";
import {ExplorerStateType} from "@/models/explorer";
import {AntTreeNode, AntTreeNodeSelectedEvent} from "antd/lib/tree";
import {OpcUaNodeDataType} from "@/pages/explorer/components/OpcUaNode/data";
import {OpcUaServerDataType} from "@/pages/explorer/components/OpcUaServer/data";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {match} from "react-router";
import {OpcUaProtocolDataType} from "@/pages/explorer/protocol/data";
import {MenuModelStateType} from "@/models/menu";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import opcImg from '@/assets/opc.jpg';


const {TreeNode, DirectoryTree} = Tree;

interface OpcUaProtocolProps {
  match: match<{ id: string }>;
  dispatch: Dispatch<any>;
  explorerModel: ExplorerStateType;
  menuModel: MenuModelStateType;
  loading: boolean;
}

interface OpcUaProtocolState {
  treeData: Array<TreeNode>;
  expandedKeys: string[];
  serverStyle: React.CSSProperties;
  nodeStyle: React.CSSProperties;
  currentOpcUaProtocol: Partial<OpcUaProtocolDataType>;
  currentOpcUaServerOrOpcUaNode: Partial<OpcUaServerDataType> | Partial<OpcUaNodeDataType>;
  selectedType: 'node' | 'server' | undefined,
  selectedOpcUaVariableNode: Partial<OpcUaNodeDataType>;
}

@connect(({explorer, menu, loading}: { explorer: ExplorerStateType, menu: MenuModelStateType, loading: LoadingDataType }) => {
  return {
    explorerModel: explorer,
    menuModel: menu,
    loading: loading.models.opcUaProtocol
  }
})
class OpcUaProtocol extends React.Component<OpcUaProtocolProps, OpcUaProtocolState> {

  state = {
    treeData: [
    ],
    expandedKeys: [],
    nodeStyle: {display: 'none'},
    serverStyle: {display: 'none'},
    currentOpcUaProtocol: {},
    currentOpcUaServerOrOpcUaNode: {},
    selectedType: undefined,
    selectedOpcUaVariableNode: {},
  };

  initData = (protocolId: string, opcUaProtocolList: OpcUaProtocolDataType[]) => {
    const {dispatch} = this.props;

    // 获取路由参数并从后端获取对应的

    const currentOpcUaProtocol = opcUaProtocolList.find(item => item.id === parseInt(protocolId));

    if (!currentOpcUaProtocol) return;
    dispatch({
      type: "explorer/opcUaServerFetch",
      payload: {opcUaProtocolId: protocolId},
      callback: (data: Array<OpcUaServerDataType>): void => {
        const components = data.map(item => {
          return {
            title: item.fullName,
            key: + new Date() + Math.random(),
            selectedType: 'server',
            object: item,
          }
        });
        this.setState({
          treeData: [
            {
              title: 'Local Ua server',
              key: '0',
              selectable: false,
              icon: "smile-o",
              children: components,
            },
          ]
        })
      }
    });
    this.setState({
      currentOpcUaProtocol: currentOpcUaProtocol,
      // 清空详细信息显示
      currentOpcUaServerOrOpcUaNode: {},
      // 复位tree的选择
      expandedKeys: []
    });

  };

  componentWillReceiveProps(nextProps: Readonly<OpcUaProtocolProps>, nextContext: any): void {

    // // 获得 opcUaProtocolList 数据后第一次加载 初始化数据
    if (!this.props.menuModel.opcUaProtocolList.length) return;
    if (this.props.menuModel.opcUaProtocolList.length === 0 && nextProps.menuModel.opcUaProtocolList.length > 0) {
      this.initData(nextProps.match.params.id, nextProps.menuModel.opcUaProtocolList);
    }
    // 获取路由参数并从后端获取对应的
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.initData(nextProps.match.params.id, nextProps.menuModel.opcUaProtocolList);
    }
  }

  onLoadData = (treeNode: AntTreeNode): PromiseLike<void> =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      if (treeNode.props.dataRef.selectedType === 'server') {
        // 如果是服务器要展开 先连接在加载根node
        this.fetchNodeTreeById(treeNode, true);
      } else {
        this.fetchNodeTreeById(treeNode, false);
      }
      resolve();
    });


  fetchNodeTreeById = (treeNode: AntTreeNode, isRoot: boolean): void => {
    const dispatch = this.props.dispatch;
    if (!dispatch) return;

    // 生成baseKey
    if (!this.state.currentOpcUaProtocol || this.state.currentOpcUaProtocol === {} ) return;
    // const baseKey = "node" + this.state.currentOpcUaProtocol.id + treeNode.props.dataRef.object.opcUaServerId;
    let components = [];
    // 服务器
    if (isRoot) {
      dispatch({
        type: 'explorer/opcUaRootNodeFetch',
        payload: {opcUaServerId: treeNode.props.dataRef.object.id},
        callback: (data: Array<any>): void => {
          components = data.map((item: OpcUaNodeDataType) => {
            return {
              title: item.browseName,
              key: + new Date() + Math.random(),
              selectedType: 'node',
              object: item
            }
          });
          treeNode.props.dataRef.children = components;
          this.setState({
            treeData: [...this.state.treeData]
          });
        }
      });
    } else {
      // node
      dispatch({
        type: 'explorer/opcUaNodeFetch',
        payload: {
          opcUaServerId: treeNode.props.dataRef.object.opcUaServerId,
          namespaceIndex: treeNode.props.dataRef.object.namespaceIndex,
          identifier: treeNode.props.dataRef.object.identifier,
          nodeIdType: treeNode.props.dataRef.object.nodeIdType,
        },
        callback: (data: Array<any>): void => {
          components = data.map((item: OpcUaNodeDataType) => {
            return {
              title: item.browseName,
              // key: baseKey + item.nodeIdString,
              key: + new Date() + Math.random(),
              selectedType: 'node',
              object: item,
              isLeaf: item.nodeClass === 'Variable',
            }
          });
          treeNode.props.dataRef.children = components;
          this.setState({
            treeData: [...this.state.treeData]
          });
        }
      });
    }
  };

  handleOnTreeSelect = (selectedKeys: string[], e: AntTreeNodeSelectedEvent): void => {
    const dispatch = this.props.dispatch;
    // 修改全局属性 selectedType
    this.setState({
      serverStyle: e.node.props.dataRef.selectedType,
    });
    if (e.node.props.dataRef.key === "0") return;
    // 修改选中项
    this.setState({
      currentOpcUaServerOrOpcUaNode: e.node.props.dataRef.object,
    });
    if (e.node.props.dataRef.object.nodeClass === 'Variable') {
      // 设置最下方一个card的数据显示
      dispatch({
        type: "explorer/setSelectedOpcUaVariableNode",
        payload: e.node.props.dataRef.object
      });
      this.setState({
        selectedOpcUaVariableNode: e.node.props.dataRef.object,
      });
      dispatch({
        type: "explorer/opcUaDataValueFetch",
        payload: {
          opcUaServerId: e.node.props.dataRef.object.opcUaServerId,
          namespaceIndex: e.node.props.dataRef.object.namespaceIndex,
          identifier: e.node.props.dataRef.object.identifier,
          nodeIdType: e.node.props.dataRef.object.nodeIdType
        }
      })
    }
    // 显示server or node 的判断
    if (e.node.props.dataRef.selectedType === 'server') {
      this.setState({
        serverStyle: {display: 'block'}
      })
    } else {
      this.setState({
        serverStyle: {display: 'none'}
      })
    }
    if (e.node.props.dataRef.selectedType === 'node') {
      this.setState({
        nodeStyle: {display: 'block'}
      })
    } else {
      this.setState({
        nodeStyle: {display: 'none'}
      })
    }
  };

  handleOnExpand = (expandedKeys: string[]): void | PromiseLike<void> => {
    this.setState({
      expandedKeys: expandedKeys
    });
  };

  renderTreeNodes = (data: any): Array<any> =>
    data.map((item: any): any => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item}/>;
    });


  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const renderPageExtraContent = (): React.ReactNode => {
      //
      return (
        <img src={opcImg} alt="aaa" />
      )
    };

    return (
      <PageHeaderWrapper tabBarExtraContent={renderPageExtraContent()}>
        <Row gutter={16}>
          <Col span={9}>
            <Card title="Local Ua Server Explorer Tree" bordered={false}>
              <div>
                <DirectoryTree loadData={this.onLoadData} onSelect={this.handleOnTreeSelect}
                               expandedKeys={this.state.expandedKeys} onExpand={this.handleOnExpand}
                               style={{height: 266, overflow: 'auto'}}>
                  {this.renderTreeNodes(this.state.treeData)}
                </DirectoryTree>
              </div>
            </Card>
          </Col>
          <Col span={15}>
            <Card bordered={false} style={{height: 370}}>
              <OpcUaServer serverStyle={this.state.serverStyle}
                           currentOpcUaServerOrOpcUaNode={this.state.currentOpcUaServerOrOpcUaNode}/>
              <OpcUaNode nodeStyle={this.state.nodeStyle}
                         currentOpcUaServerOrOpcUaNode={this.state.currentOpcUaServerOrOpcUaNode}/>
            </Card>
          </Col>
        </Row>
        <Row style={{marginTop: 16}}>
          <OpcUaDataValue currentOpcUaProtocol={this.state.currentOpcUaProtocol}
                          currentOpcUaServerOrOpcUaNode={this.state.currentOpcUaServerOrOpcUaNode}
                          selectedOpcUaVariableNode={this.state.selectedOpcUaVariableNode}/>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default OpcUaProtocol;
