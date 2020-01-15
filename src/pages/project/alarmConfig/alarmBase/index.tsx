import React from 'react';
import {Col, Row} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import AlarmCategory from "@/pages/project/alarmConfig/alarmBase/components/AlarmCategory";
import AlarmLevel from "@/pages/project/alarmConfig/alarmBase/components/AlarmLevel";

interface AlarmBaseProps {
  loading: boolean;
}

interface AlarmBaseState {

}

class AlarmBase extends React.Component<AlarmBaseProps, AlarmBaseState> {
  state: AlarmBaseState = {

  };


  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    return (
      <>
        <PageHeaderWrapper>
          <Row gutter={18}>
            <Col span={12}>
              <AlarmCategory/>
            </Col>
            <Col span={12}>
              <AlarmLevel/>
            </Col>
          </Row>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default AlarmBase;
