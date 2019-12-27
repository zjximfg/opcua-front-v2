import {Effect} from "dva";
import {Reducer} from "redux";
import {
  getOpcUaNodeListByNodeId,
  getOpcUaRootNodeListByServer,
  getOpcUaServerList, monitorOpcUaDataValue, opcUaDataValueFetch
} from "@/services/explorer";
import {OpcUaServerDataType} from "@/pages/explorer/OpcUaServer/data";
import {OpcUaDataValueDataType} from "@/pages/explorer/OpcUaServer/OpcUaDataValue/data";


export interface ExplorerStateType {
  opcUaServerList: Array<OpcUaServerDataType>;
  opcUaNodeList: Array<any>;
  opcUaDataValue: OpcUaDataValueDataType;
}

export interface ExplorerModelType {
  namespace: string;
  state: ExplorerStateType;
  effects: {
    opcUaServerFetch: Effect;
    opcUaNodeFetch: Effect;
    opcUaRootNodeFetch: Effect;
    opcUaDataValueFetch: Effect;
    monitorOpcUaDataValue: Effect;
  };
  reducers: {
    getOpcUaServerList: Reducer<ExplorerStateType>;
    getOpcUaNodeListByNodeId: Reducer<ExplorerStateType>;
    getOpcUaDataValue: Reducer<ExplorerStateType>;
  }
}

const ExplorerModel: ExplorerModelType = {
  namespace: 'explorer',
  state: {
    currentOpcUaServerOrOpcUaNode: {},
    currentOpcUaProtocolName: '',
    selectedOpcUaVariableNode: {},
    opcUaDataValue: {},
  },
  effects: {
    * opcUaServerFetch({payload, callback}, {call, put}) {
      const response = yield call(getOpcUaServerList, payload);
      yield put({
        type: 'getOpcUaServerList',
        payload: response
      });
      if (!callback) return;
      callback(response);
    },
    * opcUaNodeFetch({payload, callback}, {call, put}) {
      const response = yield call(getOpcUaNodeListByNodeId, payload);
      yield put({
        type: 'getOpcUaNodeListByNodeId',
        payload: response
      });
      if (!callback) return;
      callback(response);
    },
    * opcUaRootNodeFetch({payload, callback}, {call, put}) {
      const response = yield call(getOpcUaRootNodeListByServer, payload);
      yield put({
        type: 'getOpcUaNodeListByNodeId',
        payload: response
      });
      if (!callback) return;
      callback(response);
    },
    * opcUaDataValueFetch({payload}, {call, put}) {
      const response = yield call(opcUaDataValueFetch, payload);
      yield put({
        type: 'getOpcUaDataValue',
        payload: response
      })
    },
    * monitorOpcUaDataValue({payload}, {call, put}) {
      const response = yield call(monitorOpcUaDataValue, payload)
    }
  },
  reducers: {
    getOpcUaServerList(state = state, action) {
      return {
        ...state,
        opcUaServerList: action.payload,
      }
    },
    getOpcUaNodeListByNodeId(state = state, action) {
      return {
        ...state,
        opcUaNodeList: action.action
      }
    },
    getOpcUaDataValue(state = state, action) {
      return {
        ...state,
        opcUaDataValue: action.payload
      }
    },
  }
};

export default ExplorerModel;
