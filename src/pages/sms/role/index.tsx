import React from 'react';
import {Col, Row} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";

import RoleList from "@/pages/sms/role/components/RoleList";
import AlarmList from "@/pages/sms/role/components/AlarmList";

interface RoleProps {
}

interface RoleState {

}


class Role extends React.Component<RoleProps, RoleState> {

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <>
        <PageHeaderWrapper>
          <Row gutter={18}>
            <Col span={9}>
              <RoleList />
            </Col>
            <Col span={15}>
              <AlarmList />
            </Col>
          </Row>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default Role;
