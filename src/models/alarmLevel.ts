import {Effect} from "dva";
import {Reducer} from "redux";
import AlarmLevelDataType from "@/pages/project/alarmConfig/alarmBase/components/AlarmLevel/alarmLevel";
import {
  createAlarmLevelFetch,
  deleteAlarmLevelFetch,
  editAlarmLevelFetch,
  fetchAlarmLevelList
} from "@/services/alarmLevel";

export interface AlarmLevelModelStateType {
  alarmLevelList: Array<AlarmLevelDataType>;
}

export interface AlarmLevelModelType {
  namespace: string;
  state: AlarmLevelModelStateType;
  effects: {
    fetchAlarmLevelList: Effect;
    deleteAlarmLevelFetch: Effect;
    editAlarmLevelFetch: Effect;
    createAlarmLevelFetch: Effect;
  };
  reducers: {
    queryAlarmLevelList: Reducer<AlarmLevelModelStateType>;
  };
}

const AlarmLevelModel: AlarmLevelModelType = {
  namespace: 'alarmLevel',
  state: {
    alarmLevelList: [],
  },
  effects: {
    fetchAlarmLevelList: function* ({payload}, {call, put}) {
      const response = yield call(fetchAlarmLevelList);
      yield put({
        type: 'queryAlarmLevelList',
        payload: response,
      })
    },
    * deleteAlarmLevelFetch({payload, callback}, {call}) {
      yield call(deleteAlarmLevelFetch, payload);
      if (callback) callback();
    },
    * editAlarmLevelFetch({payload, callback}, {call}) {
      yield call(editAlarmLevelFetch, payload);
      if (callback) callback();
    },
    * createAlarmLevelFetch({payload, callback}, {call}) {
      yield call(createAlarmLevelFetch, payload);
      if (callback) callback();
    }
  },
  reducers: {
    queryAlarmLevelList(state = state, action) {
      return {
        ...state,
        alarmLevelList: action.payload,
      }
    }
  }
};

export default AlarmLevelModel;
