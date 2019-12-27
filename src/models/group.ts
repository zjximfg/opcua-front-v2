import OpcUaGroupDataType from "@/pages/project/components/Group/opcUaGroup";
import {Effect} from "dva";
import {Reducer} from "redux";
import {
  createOpcUaGroupFetch, deleteGroupFetch,
  editOpcUaGroupFetch,
  groupListFetchByConnectionId,
  storagePeriodListFetch
} from "@/services/group";
import StoragePeriodDataType from "@/pages/project/components/Group/opcUaGroup";

export interface GroupModelStateType {
  groupList: Array<OpcUaGroupDataType>;
  storagePeriodList: Array<StoragePeriodDataType>;
  selectedGroup: Partial<OpcUaGroupDataType>;
}

export interface GroupModelType {
  namespace: string;
  state: GroupModelStateType;
  effects: {
    groupListFetchByConnectionId: Effect;
    storagePeriodListFetch: Effect;
    deleteGroupFetch: Effect;
    editOpcUaGroupFetch: Effect;
    createOpcUaGroupFetch: Effect;
  };
  reducers: {
    queryGroupList: Reducer<GroupModelStateType>;
    queryStoragePeriodList: Reducer<GroupModelStateType>;
    setSelectedGroup: Reducer<GroupModelStateType>;
  }
}

const GroupModel: GroupModelType = {
  namespace: 'group',
  state: {
    groupList: [],
    storagePeriodList: [],
    selectedGroup: {},
  },
  effects: {
    * groupListFetchByConnectionId({payload}, {call, put}) {
      const response = yield call(groupListFetchByConnectionId, payload);
      yield put({
        type: 'queryGroupList',
        payload: response,
      });
    },
    * storagePeriodListFetch({payload}, {call, put}) {
      const response = yield call(storagePeriodListFetch);
      yield put({
        type: 'queryStoragePeriodList',
        payload: response,
      });
    },
    * deleteGroupFetch({payload, callback}, {call}) {
      yield call(deleteGroupFetch, payload);
      if (callback) callback();
    },
    * editOpcUaGroupFetch({payload, callback}, {call}) {
      yield call(editOpcUaGroupFetch, payload);
      if (callback) callback();
    },
    * createOpcUaGroupFetch({payload, callback}, {call}) {
      yield call(createOpcUaGroupFetch, payload);
      if (callback) callback();
    }
  },
  reducers: {
    queryGroupList(state = state, action) {
      return {
        ...state,
        groupList: action.payload
      }
    },
    queryStoragePeriodList(state = state, action) {
      return {
        ...state,
        storagePeriodList: action.payload
      }
    },
    setSelectedGroup(state = state, action) {
      return {
        ...state,
        selectedGroup: action.payload
      }
    }
  },
};


export default GroupModel;
