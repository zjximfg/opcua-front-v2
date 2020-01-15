import AlarmDataType from "@/pages/project/components/Alarm/alarm";
import ItemObjectDataType from "@/pages/project/components/Item/opcUaItem";
import {Effect} from "dva";
import {Reducer} from "redux";
import {fetchItemObjectListByOpcUaNamespaceId} from "@/services/item";
import {
  createAlarmFetch,
  deleteAlarmFetch,
  editAlarmFetch,
  fetchAlarmListByConnectionId,
  fetchOnlineDataByConnectionId
} from "@/services/alarm";

export interface AlarmModelStateType {
  alarmList: Array<AlarmDataType>;
  itemObjectList: Array<ItemObjectDataType>;
}

export interface AlarmModelType {
  namespace: string;
  state: AlarmModelStateType;
  effects: {
    fetchAlarmListByConnectionId: Effect;
    fetchOnlineDataByConnectionId: Effect;
    fetchItemObjectListByOpcUaNamespaceId: Effect;
    deleteAlarmFetch: Effect;
    createAlarmFetch: Effect;
    editAlarmFetch: Effect;
  };
  reducers: {
    queryAlarmList: Reducer<AlarmModelStateType>;
    resetAlarmList: Reducer<AlarmModelStateType>;
    queryItemObjectList: Reducer<AlarmModelStateType>;
  }
}

const AlarmModel: AlarmModelType = {
  namespace: 'alarm',
  state: {
    alarmList: [],
    itemObjectList: [],
  },
  effects: {
    * fetchAlarmListByConnectionId({payload}, {call, put}) {
      const response = yield call(fetchAlarmListByConnectionId, payload);
      yield put({
        type: 'queryAlarmList',
        payload: response,
      })
    },
    * fetchOnlineDataByConnectionId({payload}, {call, put}) {
      const response = yield call(fetchOnlineDataByConnectionId, payload);
      yield put({
        type: 'queryAlarmList',
        payload: response,
      })
    },
    * fetchItemObjectListByOpcUaNamespaceId({payload}, {call, put}) {
      const response = yield call(fetchItemObjectListByOpcUaNamespaceId, payload);
      yield put({
        type: 'queryItemObjectList',
        payload: response,
      });
    },
    * deleteAlarmFetch({payload, callback}, {call}) {
      yield call(deleteAlarmFetch, payload);
      if (callback) callback();
    },
    * createAlarmFetch({payload, callback}, {call}) {
      yield call(createAlarmFetch, payload);
      if (callback) callback();
    },
    * editAlarmFetch({payload, callback}, {call}) {
      yield call(editAlarmFetch, payload);
      if (callback) callback();
    }

  },
  reducers: {
    queryAlarmList(state = state, action) {
      return {
        ...state,
        alarmList: action.payload,
      }
    },
    resetAlarmList(state = state) {
      return {
        ...state,
        alarmList: [],
      }
    },
    queryItemObjectList(state = state, action) {
      return {
        ...state,
        itemObjectList: action.payload,
      }
    }
  }
};

export default AlarmModel;
