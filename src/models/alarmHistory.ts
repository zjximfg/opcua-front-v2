import {AlarmHistoryDataType} from "@/pages/history/alarmHistory/alarmHistory";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import {Effect} from "dva";
import AlarmDataType from "@/pages/project/components/Alarm/alarm";
import {Reducer} from "redux";
import {fetchAlarmHistoryPage, fetchAlarmList, fetchConnectionList} from "@/services/alarmHistory";

export interface AlarmHistoryModelStateType {
  alarmHistoryList: Array<AlarmHistoryDataType>;
  total: number;
  connectionList: Array<OpcUaConnectionDataType>;
  alarmList: Array<AlarmDataType>;
}

export interface AlarmHistoryModelType {
  namespace: string;
  state: AlarmHistoryModelStateType;
  effects: {
    fetchAlarmHistoryPage: Effect;
    fetchConnectionList: Effect;
    fetchAlarmList: Effect;
  },
  reducers: {
    queryAlarmHistoryPage: Reducer<AlarmHistoryModelStateType>;
    queryConnectionList: Reducer<AlarmHistoryModelStateType>;
    queryAlarmList: Reducer<AlarmHistoryModelStateType>;
  },
}

const AlarmHistoryModel: AlarmHistoryModelType = {
  namespace: 'alarmHistory',
  state: {
    alarmHistoryList: [],
    total: 0,
    connectionList: [],
    alarmList: [],
  },
  effects: {
    * fetchAlarmHistoryPage({payload}, {call, put}) {
      const response = yield call(fetchAlarmHistoryPage, payload);
      yield put({
        type: 'queryAlarmHistoryPage',
        payload: response,
      })
    },
    * fetchConnectionList({payload}, {call, put}) {
      const response = yield call(fetchConnectionList);
      yield put({
        type: 'queryConnectionList',
        payload: response,
      })
    },
    * fetchAlarmList({payload}, {call, put}) {
      const response = yield call(fetchAlarmList, payload);
      yield put({
        type: 'queryAlarmList',
        payload: response,
      })
    }
  },
  reducers: {
    queryAlarmHistoryPage(state = state, action) {
      return {
        ...state,
        alarmHistoryList: action.payload.list,
        total: action.payload.total,
      }
    },
    queryConnectionList(state = state, action) {
      return {
        ...state,
        connectionList: action.payload,
      }
    },
    queryAlarmList(state = state, action) {
      return {
        ...state,
        alarmList: action.payload,
      }
    }
  }
};

export default AlarmHistoryModel;
