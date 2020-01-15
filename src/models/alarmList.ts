import AlarmDataType from "@/pages/project/components/Alarm/alarm";
import {Effect} from "dva";
import {Reducer} from "redux";
import {fetchAlarmList, fetchSelectedKeysByRoleId} from "@/services/alarmList";

export interface AlarmListModelStateType {
  alarmList: Array<AlarmDataType>;
}

export interface AlarmListModelType {
  namespace: string;
  state: AlarmListModelStateType;
  effects: {
    fetchAlarmList: Effect;
  };
  reducers: {
    queryAlarmList: Reducer<AlarmListModelStateType>;
  }
}


const AlarmListModel: AlarmListModelType = {
  namespace: 'alarmList',
  state: {
    alarmList: [],
    selectedKeys: [],
  },
  effects: {
    * fetchAlarmList({payload}, {call, put}) {
      const response = yield call(fetchAlarmList, payload);
      yield put({
        type: 'queryAlarmList',
        payload: response,
      })
    },
  },
  reducers: {
    queryAlarmList(state = state, action) {
      return {
        ...state,
        alarmList: action.payload,
      }
    },
  }
};

export default AlarmListModel;


