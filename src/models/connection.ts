import OpcUaNamespaceDataType from "@/pages/project/connection/opcUaConnection";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import {Effect} from "dva";
import {Reducer} from "redux";
import {
  createOpcUaConnectionFetch, deleteOpcUaConnectionFetch,
  editOpcUaConnectionFetch, opcUaConnectionFetchById, opcUaConnectionListFetch,
  opcUaNamespaceListFetchByProtocolId
} from "@/services/connection";

export interface ConnectionModelStateType {
  opcUaNamespaceList: Array<OpcUaNamespaceDataType>;
  opcUaConnectionList: Array<OpcUaConnectionDataType>;
  opcUaConnection: OpcUaConnectionDataType;
}

export interface ConnectionModelType {
  namespace: string;
  state: ConnectionModelStateType;
  effects: {
    opcUaNamespaceListFetchByProtocolId: Effect;
    opcUaConnectionListFetch: Effect;
    deleteOpcUaConnectionFetch: Effect;
    editOpcUaConnectionFetch: Effect;
    createOpcUaConnectionFetch: Effect;
    opcUaConnectionFetchById: Effect;
  },
  reducers: {
    queryOpcUaNamespaceList: Reducer<ConnectionModelStateType>;
    queryOpcUaConnectionList: Reducer<ConnectionModelStateType>;
    queryOpcUaConnection: Reducer<ConnectionModelStateType>;
  }
}

const ConnectionModel: ConnectionModelType = {
  namespace: 'connection',
  state: {
    opcUaNamespaceList: [],
    opcUaConnectionList: [],
    opcUaConnection: {},
  },
  effects: {
    * opcUaNamespaceListFetchByProtocolId({payload}, {call, put}) {
      const response = yield call(opcUaNamespaceListFetchByProtocolId, payload);
      yield put({
        type: 'queryOpcUaNamespaceList',
        payload: response,
      });
    },
    * opcUaConnectionListFetch({payload}, {call, put}) {
      const response = yield call(opcUaConnectionListFetch, payload);
      yield put({
        type: 'queryOpcUaConnectionList',
        payload: response,
      })
    },
    * deleteOpcUaConnectionFetch({payload, callback}, {call}) {
      yield call(deleteOpcUaConnectionFetch, payload);
      if (callback) callback();
    },
    * editOpcUaConnectionFetch({payload, callback}, {call}) {
      yield call(editOpcUaConnectionFetch, payload);
      if (callback) callback();
    },
    * createOpcUaConnectionFetch({payload, callback}, {call}) {
      yield call(createOpcUaConnectionFetch, payload);
      if (callback) callback();
    },
    * opcUaConnectionFetchById({payload}, {call, put}) {
      const response = yield call(opcUaConnectionFetchById, payload);
      yield put({
        type: 'queryOpcUaConnection',
        payload: response,
      })
    }
  },
  reducers: {
    queryOpcUaNamespaceList(state = state, action) {
      return {
        ...state,
        opcUaNamespaceList: action.payload,
      };
    },
    queryOpcUaConnectionList(state = state, action) {
      return {
        ...state,
        opcUaConnectionList: action.payload,
      };
    },
    queryOpcUaConnection(state = state, action) {
      return {
        ...state,
        opcUaConnection: action.payload,
      };
    }
  }
};

export default ConnectionModel;
