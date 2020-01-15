import RoleDataType from "@/pages/sms/role/Role";
import {Effect} from "dva";
import {Reducer} from "redux";
import {
  createRoleFetch,
  deleteRoleFetch,
  editRoleFetch,
  fetchAllAlarmList,
  fetchRoleList, fetchSelectedKeysByRoleId,
  updateRoleAlarmListFetch
} from "@/services/role";
import AlarmDataType from "@/pages/project/components/Alarm/alarm";

export interface RoleModelStateType {
  roleList: Array<RoleDataType>;
  selectedRole: Partial<RoleDataType>;
  alarmList: Array<AlarmDataType>;
  // selectedAlarmListKeys: string[] | number[];
}

export interface RoleModelType {
  namespace: string;
  state: RoleModelStateType;
  effects: {
    fetchRoleList: Effect;
    deleteRoleFetch: Effect;
    editRoleFetch: Effect;
    createRoleFetch: Effect;
    fetchAllAlarmList: Effect;
    updateRoleAlarmListFetch: Effect;
    fetchSelectedKeysByRoleId: Effect;

  }
  reducers: {
    queryRoleList: Reducer<RoleModelStateType>;
    setSelectedRole: Reducer<RoleModelStateType>;
    queryAlarmList: Reducer<RoleModelStateType>;
    // querySelectedKeys: Reducer<RoleModelStateType>;
  }
}

const RoleModel: RoleModelType = {
  namespace: 'role',
  state: {
    roleList: [],
    selectedRole: {},
    alarmList: [],
    // selectedAlarmListKeys: [],
  },
  effects: {
    * fetchRoleList({payload}, {call, put}) {
      const response = yield call(fetchRoleList);
      yield put({
        type: 'queryRoleList',
        payload: response,
      })
    },
    * deleteRoleFetch({payload, callback}, {call}) {
      yield call(deleteRoleFetch, payload);
      if (callback) callback();
    },
    * editRoleFetch({payload, callback}, {call}) {
      yield call(editRoleFetch, payload);
      if (callback) callback();
    },
    * createRoleFetch({payload, callback}, {call}) {
      yield call(createRoleFetch, payload);
      if (callback) callback();
    },
    * fetchAllAlarmList({payload}, {call, put}) {
      const response = yield call(fetchAllAlarmList);
      yield put({
        type: 'queryAlarmList',
        payload: response,
      })
    },
    * updateRoleAlarmListFetch({payload, callback}, {call}) {
      yield call(updateRoleAlarmListFetch, payload);
      if (callback) callback();
    },
    * fetchSelectedKeysByRoleId({payload, callback}, {call, put}) {
      const response = yield call(fetchSelectedKeysByRoleId, payload);
      yield put({
        type: 'querySelectedKeys',
        payload: response,
      });
      if (callback) callback(response.map(item => item.alarmId))
    },
  },
  reducers: {
    queryRoleList(state = state, action) {
      return {
        ...state,
        roleList: action.payload,
      }
    },
    setSelectedRole(state = state, action) {
      return {
        ...state,
        selectedRole: action.payload
      }
    },
    queryAlarmList(state = state, action) {
      return {
        ...state,
        alarmList: action.payload,
      }
    },
    // querySelectedKeys(state = state, action) {
    //   return {
    //     ...state,
    //     selectedAlarmListKeys: action.payload.map(item => item.alarmId),
    //   }
    // }
  }
};

export default RoleModel;
