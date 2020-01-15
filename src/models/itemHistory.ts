import {ItemHistoryDataType} from "@/pages/history/itemHistory/itemHistory";
import {Effect} from "dva";
import {Reducer} from "redux";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import OpcUaGroupDataType from "@/pages/project/components/Group/opcUaGroup";
import OpcUaItemDataType from "@/pages/project/components/Item/opcUaItem";
import {fetchConnectionList, fetchGroupList, fetchItemHistoryPage, fetchItemList} from "@/services/itemHistory";

export interface ItemHistoryModelStateType {
  itemHistoryList: Array<ItemHistoryDataType>;
  total: number;
  connectionList: Array<OpcUaConnectionDataType>;
  groupList: Array<OpcUaGroupDataType>;
  itemList: Array<OpcUaItemDataType>;
}

export interface ItemHistoryModelType {
  namespace: string;
  state: ItemHistoryModelStateType;
  effects: {
    fetchItemHistoryPage: Effect;
    fetchConnectionList: Effect;
    fetchGroupList: Effect;
    fetchItemList: Effect;
  };
  reducers: {
    queryItemHistoryPage: Reducer<ItemHistoryModelStateType>;
    queryConnectionList: Reducer<ItemHistoryModelStateType>;
    queryGroupList: Reducer<ItemHistoryModelStateType>;
    queryItemList: Reducer<ItemHistoryModelStateType>;
  }
}

const ItemHistoryModel: ItemHistoryModelType = {
  namespace: 'itemHistory',
  state: {
    itemHistoryList: [],
    connectionList: [],
    groupList: [],
    itemList: [],
  },
  effects: {
    * fetchItemHistoryPage({payload}, {call, put}) {
      const response = yield call(fetchItemHistoryPage, payload);
      yield put({
        type: 'queryItemHistoryPage',
        payload: response,
      })
    },
    * fetchConnectionList({payload}, {call, put}) {
      const response = yield call(fetchConnectionList);
      yield put({
        type: 'queryConnectionList',
        payload: response,
      });
    },
    * fetchGroupList({payload}, {call, put}) {
      const response = yield call(fetchGroupList);
      yield put({
        type: 'queryGroupList',
        payload: response,
      })
    },
    * fetchItemList({payload}, {call, put}) {
      const response = yield call(fetchItemList, payload);
      yield put({
        type: 'queryItemList',
        payload: response,
      })
    }
  },
  reducers: {
    queryItemHistoryPage(state = state, action) {
      return {
        ...state,
        itemHistoryList: action.payload.list,
        total: action.payload.total,
      }
    },
    queryConnectionList(state = state, action) {
      return {
        ...state,
        connectionList: action.payload,
      }
    },
    queryGroupList(state = state, action) {
      return {
        ...state,
        groupList: action.payload,
      }
    },
    queryItemList(state = state, action) {
      return {
        ...state,
        itemList: action.payload,
      }
    }
  },
};

export default ItemHistoryModel;
