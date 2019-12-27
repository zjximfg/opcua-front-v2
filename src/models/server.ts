import {OpcUaServerDataType} from "@/pages/explorer/components/OpcUaServer/data";
import {Effect} from "dva";
import {Reducer} from "redux";
import {
  opcUaProtocolListFetch,
  opcUaServerFetch,
  restartServer,
  securityPolicyUriListFetch,
  updateOpcUaServer
} from "@/services/server";
import {OpcUaProtocolDataType} from "@/pages/explorer/protocol/data";
import SecurityPolicyUriDataType from "@/models/securityPolicyUri";

export interface ServerModelStateType {
  opcUaServer: OpcUaServerDataType;
  opcUaProtocolList: Array<OpcUaProtocolDataType>;
  securityPolicyUriList: Array<SecurityPolicyUriDataType>;
}

export interface ServerModelType {
  namespace: string;
  state: ServerModelStateType;
  effects: {
    opcUaServerFetch: Effect;
    updateOpcUaServer: Effect;
    restartServer: Effect;
    opcUaProtocolListFetch: Effect;
    securityPolicyUriListFetch: Effect;
  };
  reducers: {
    queryOpcUaServer: Reducer<ServerModelStateType>;
    queryOpcUaProtocolList: Reducer<ServerModelStateType>;
    querySecurityPolicyUriList: Reducer<ServerModelStateType>;
  };
}

const ServerModel: ServerModelType = {
  namespace: 'server',
  state: {
    opcUaServer: {
      id: 0,
      endpointUrl: '',
      serverName: '',
      fullName: '',
      opcUaProtocolId: 0,
      securityPolicyUri: '',
      securityMode: '',
      supportedFile: '',
      authenticationTypes: '',
      productUri: '',
      applicationUri: '',
      applicationName: '',
    },
    opcUaProtocolList: [],
    securityPolicyUriList: [],
  },
  effects: {
    * opcUaServerFetch({payload}, {call, put}) {
      const response = yield call(opcUaServerFetch);
      yield put({
        type: 'queryOpcUaServer',
        payload: response
      });
    },
    * updateOpcUaServer({payload, callback}, {call}) {
      console.log(payload)
      yield call(updateOpcUaServer, payload);
      if (!callback) return;
      callback();
    },
    * restartServer({payload}, {call}) {
      yield call(restartServer);
    },
    * opcUaProtocolListFetch({payload}, {call, put}) {
      const response = yield call(opcUaProtocolListFetch);
      yield put({
        type: 'queryOpcUaProtocolList',
        payload: response
      });
    },
    * securityPolicyUriListFetch({payload}, {call, put}) {
      const response = yield call(securityPolicyUriListFetch);
      yield put({
        type: 'querySecurityPolicyUriList',
        payload: response
      })
    }
  },
  reducers: {
    queryOpcUaServer(state = state, action) {
      return {
        ...state,
        opcUaServer: action.payload || state.opcUaServer,
      }
    },
    queryOpcUaProtocolList(state= state, action) {
      return {
        ...state,
        opcUaProtocolList: action.payload || state.opcUaProtocolList,
      }
    },
    querySecurityPolicyUriList(state = state, action) {
      return {
        ...state,
        securityPolicyUriList: action.payload || state.securityPolicyUriList
      }
    }
  }
};

export default ServerModel;
