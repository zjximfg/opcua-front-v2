import {MenuDataItem} from "@ant-design/pro-layout";
import {Effect} from "dva";
import {Reducer} from "redux";
import {getOpcUaProtocolList} from "@/services/protocol";
import {OpcUaProtocolDataType} from "@/pages/explorer/protocol/data";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import {opcUaConnectionListFetch} from "@/services/connection";

export interface MenuModelStateType {
  list: MenuDataItem[];
  opcUaProtocolList: Array<OpcUaProtocolDataType>;
}

export interface MenuModelType {
  namespace: string;
  state: MenuModelStateType;
  effects: {
    fetchExplorerMenuList: Effect;
    fetchProjectMenuList: Effect;
  }
  reducers: {
    addExplorerMenuList: Reducer<MenuModelStateType>;
    addProjectMenuList: Reducer<MenuModelStateType>;
  }
}

const MenuModel: MenuModelType = {
  namespace: "menu",
  state: {
    opcUaProtocolList: [],
    list: [
      {
        path: '/',
        redirect: '/explorer/protocol/1',
      },
      {
        path: '/explorer',
        name: 'Explorer',
        icon: 'global',
        // component: './explorer'
      },
      {
        path: '/project',
        name: 'Project',
        icon: 'project',
        children: [
          {
            path: '/project/server',
            name: 'Activated Opc UA Server',
            icon: 'setting',
            component: './project/server',
            exact: true
          },
          {
            path: '/project/connection',
            name: 'Activated Connections',
            icon: 'cluster',
            exact: true
          },
          {
            path: '/project/alarmConfig',
            name: 'Alarm Configuration',
            icon: 'file-text',
            children: [
              {
                path: '/project/alarmConfig/alarmBase',
                name: "Alarm Base Info.",
                icon: 'block',
                component: './project/alarmConfig/alarmBase'
              }
            ]
          },
        ]
      },
      {
        path: '/history',
        name: 'History',
        icon: 'database',
        children: [
          {
            path: '/history/itemHistory',
            name: "Opc Ua Item History",
            icon: 'block',
            component: './history/itemHistory',
          },
          {
            path: '/history/alarmHistory',
            name: "Opc Ua Alarm History",
            icon: 'block',
            component: './history/alarmHistory',
          }
        ]
      },
      {
        path: '/sms',
        name: 'SMS Alarm',
        icon: 'customer-service',
        children: [
          {
            path: '/sms/role',
            name: "SMS Role",
            icon: 'team',
            component: './sms/role',
          },
          {
            path: '/sms/smsUser',
            name: "SMS User",
            icon: 'user',
            component: './sms/smsUser',
          }
        ]
      },
      {
        component: './404',
      },
    ]
  },
  effects: {
    * fetchExplorerMenuList({payload}, {call, put}) {
      const response = yield call(getOpcUaProtocolList);
      yield put({
        type: 'addExplorerMenuList',
        payload: response,
      });
    },
    * fetchProjectMenuList({payload}, {call, put}) {
      const response = yield call(opcUaConnectionListFetch, payload);
      yield put({
        type: 'addProjectMenuList',
        payload: response,
      })
    }
  },
  reducers: {
    addExplorerMenuList(state = state, action) {
      let list = state.list;
      if (action.payload) {
        list[1].children = action.payload.map((item: OpcUaProtocolDataType) => {
          return {
            path: '/explorer/protocol/' + item.id,
            name: item.protocolName,
            icon: 'interaction',
            component: './explorer/protocol/id',
            exact: true
          }
        })
      }
      return {
        ...state,
        list: list,
        opcUaProtocolList: action.payload,
      }
    },
    addProjectMenuList(state = state, action) {
      let list = state.list;
      if (action.payload) {
        list[2].children[1].children = action.payload.map((item: OpcUaConnectionDataType) => {
          return {
            path: '/project/connection/' + item.id,
            name: item.connectionName,
            icon: 'branches',
            component: './project/connection/id',
            exact: true,
          }
        });
      }
      return {
        ...state,
        list: list
      }
    },
  }
};

export default MenuModel;
