import AlarmCategoryDataType from "@/pages/project/alarmConfig/alarmBase/components/AlarmCategory/alarmCategory";
import {Effect} from "dva";
import {Reducer} from "redux";
import {
  createAlarmCategoryFetch,
  deleteAlarmCategoryFetch,
  editAlarmCategoryFetch,
  fetchAlarmCategoryList
} from "@/services/alarmCategory";

export interface AlarmCategoryModelStateType {
  alarmCategoryList: Array<AlarmCategoryDataType>;
}

export interface AlarmCategoryModelType {
  namespace: string;
  state: AlarmCategoryModelStateType;
  effects: {
    fetchAlarmCategoryList: Effect;
    deleteAlarmCategoryFetch: Effect;
    editAlarmCategoryFetch: Effect;
    createAlarmCategoryFetch: Effect;
  };
  reducers: {
    queryAlarmCategoryList: Reducer<AlarmCategoryModelStateType>;
  };
}

const AlarmCategoryModel: AlarmCategoryModelType = {
  namespace: 'alarmCategory',
  state: {
    alarmCategoryList: [],
  },
  effects: {
    * fetchAlarmCategoryList({payload}, {call, put}) {
      const response = yield call(fetchAlarmCategoryList);
      yield put({
        type: 'queryAlarmCategoryList',
        payload: response,
      })
    },
    * deleteAlarmCategoryFetch({payload, callback}, {call}) {
      yield call(deleteAlarmCategoryFetch, payload);
      if (callback) callback();
    },
    * editAlarmCategoryFetch({payload, callback}, {call}) {
      yield call(editAlarmCategoryFetch, payload);
      if (callback) callback();
    },
    *createAlarmCategoryFetch({payload, callback}, {call}) {
      yield call(createAlarmCategoryFetch, payload);
      if (callback) callback();
    }
  },
  reducers: {
    queryAlarmCategoryList(state = state, action) {
      return {
        ...state,
        alarmCategoryList: action.payload,
      }
    }
  }
};

export default AlarmCategoryModel;
