import SmsUserDataType from "@/pages/sms/smsUser/smsUser";
import RoleDataType from "@/pages/sms/role/Role";
import {Effect} from "dva";
import {Reducer} from "redux";
import {
  createSmsUserFetch,
  deleteSmsUserFetch,
  editSmsUserFetch,
  fetchRoleList,
  fetchSmsUserPage
} from "@/services/smsUser";

export interface SmsUserModelStateType {
  smsUserList: Array<SmsUserDataType>;
  total: number;
  roleList: Array<RoleDataType>
}

export interface SmsUserModelType {
  namespace: string;
  state: SmsUserModelStateType;
  effects: {
    fetchSmsUserPage: Effect;
    fetchRoleList: Effect;
    editSmsUserFetch: Effect;
    createSmsUserFetch: Effect;
    deleteSmsUserFetch: Effect;
  };
  reducers: {
    querySmsUserPage: Reducer<SmsUserModelStateType>;
    queryRoleList: Reducer<SmsUserModelStateType>;
  }
}

const SmsUserModel: SmsUserModelType = {
  namespace: "smsUser",
  state: {
    smsUserList: [],
    roleList:[],
  },
  effects: {
    * fetchSmsUserPage({payload}, {call, put}) {
      const response = yield call(fetchSmsUserPage, payload);
      yield put({
        type: 'querySmsUserPage',
        payload: response,
      })
    },
    * fetchRoleList({payload}, {call, put}) {
      const response = yield call(fetchRoleList);
      yield put({
        type: 'queryRoleList',
        payload: response,
      })
    },
    * deleteSmsUserFetch({payload, callback}, {call}) {
      yield call(deleteSmsUserFetch, payload);
      if (callback) callback();
    },
    * editSmsUserFetch({payload, callback}, {call}) {
      yield call(editSmsUserFetch, payload);
      if (callback) callback();
    },
    * createSmsUserFetch({payload, callback}, {call}) {
      yield call(createSmsUserFetch, payload);
      if (callback) callback();
    }
  },
  reducers: {
    querySmsUserPage(state = state, action) {
      return {
        ...state,
        smsUserList: action.payload.list,
        total: action.payload.total,
      }
    },
    queryRoleList(state = state, {payload}) {
      return {
        ...state,
        roleList: payload
      }
    }
  }
};

export default SmsUserModel;
