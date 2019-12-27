/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings, DefaultFooter,
} from '@ant-design/pro-layout';
import React, {useEffect} from 'react';
import Link from 'umi/link';
import {Dispatch} from 'redux';
import {connect} from 'dva';
import {formatMessage} from 'umi-plugin-react/locale';

import RightContent from '@/components/GlobalHeader/RightContent';
import {ConnectState} from '@/models/connect';
import logo from '@/assets/ST-logo_transparent.png';
// import logo from '@/assets/siemag-tecberg_k.jpg';
import styles from '@/layouts/CommonLayout.less';
import {MenuModelStateType} from "@/models/menu";
import {Icon} from "antd";
import {isAntDesignPro} from "@/utils/utils";


export interface CommonLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  menuModel: MenuModelStateType;
}

const defaultFooterDom = (
  <DefaultFooter
    copyright="2019 Tianjin SIEMAG TECBERG"
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <Icon type="github" />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const footerRender: CommonLayoutProps['footerRender'] = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }
  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const CommonLayout: React.FC<CommonLayoutProps> = props => {
  const {dispatch, settings, menuModel} = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'menu/fetchExplorerMenuList',
      });
    }
  }, []);
  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  return (
    <ProLayout
      className={styles.customLogo}
      logo={logo}
      title={"OpcUa Client Pro"}
      menuHeaderRender={(logoDom, titleDom) => (
        <div style={{width: 500}}>
          {logoDom}
          {titleDom}
        </div>
      )}
      layout="topmenu"
      // navTheme="light"
      disableMobile
      rightContentRender={() => <RightContent/>}
      contentStyle={{margin: 0}}
    >
      <ProLayout
        menuHeaderRender={false}
        {...props}
        {...settings}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ]}
        menuDataRender={() => {
          return menuModel.list;
        }}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={footerRender}
        layout={"sidemenu"}
        navTheme="light"
      >
        {props.children}
      </ProLayout>
    </ProLayout>
  );
};

export default connect(({global, settings, menu}: ConnectState) => ({
  menuModel: menu,
  collapsed: global.collapsed,
  settings,
}))(CommonLayout);
