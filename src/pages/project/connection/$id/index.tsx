import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {connect} from "dva";
import {Col, Form, Row} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {match} from "react-router";
import {Dispatch} from "redux";
import {ConnectionModelStateType} from "@/models/connection";
import LoadingDataType from "@/models/loading";
import Group from "@/pages/project/components/Group";
import Item from "@/pages/project/components/Item";
import {GroupModelStateType} from "@/models/group";

interface ConnectionProps extends FormComponentProps{
  match: match<{ id: string }>;
  dispatch: Dispatch<any>;
  loading: boolean;
  connectionModel: ConnectionModelStateType;
  groupModal: GroupModelStateType;
}

interface ConnectionState {
}

@connect(({connection, group, loading} : {connection: ConnectionModelStateType, group: GroupModelStateType, loading: LoadingDataType}) => {
  return {
    connectionModel: connection,
    groupModal: group,
    loading: loading.models.connection
  }
})
class Connection extends React.Component<ConnectionProps, ConnectionState> {

  componentDidMount(): void {
    const {dispatch} = this.props;
    const connectionId = this.props.match.params.id;
    dispatch({
      type: 'connection/opcUaConnectionFetchById',
      payload: {id: connectionId}
    });
  }

  componentWillReceiveProps(nextProps: Readonly<ConnectionProps>, nextContext: any): void {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      const {dispatch} = this.props;
      const connectionId = nextProps.match.params.id;
      dispatch({
        type: 'connection/opcUaConnectionFetchById',
        payload: {id: connectionId}
      });
    }
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {connectionModel, groupModal} = this.props;
    return (
      <>
        <PageHeaderWrapper>
          <Row gutter={18}>
            <Col span={8}>
              <Group opcUaConnection={connectionModel.opcUaConnection}/>
            </Col>
            <Col span={16}>
              <Item opcUaConnection={connectionModel.opcUaConnection} opcUaGroup={groupModal.selectedGroup}/>
            </Col>
          </Row>
        </PageHeaderWrapper>
      </>
    );
  }

}

export default Form.create<ConnectionProps>()(Connection);
