import OpcUaItemDataType from "@/pages/project/components/Item/opcUaItem";
import ItemCategoryDataType from "@/pages/project/components/Item/opcUaItem";
import ItemObjectDataType from "@/pages/project/components/Item/opcUaItem";
import ItemTypeDataType from "@/pages/project/components/Item/opcUaItem";
import {Effect} from "dva";
import {Reducer} from "redux";
import {
  createOpcUaItemFetch, deleteItemFetch,
  editOpcUaItemFetch,
  fetchItemCategoryListByOpcUaNamespaceId,
  fetchItemObjectListByOpcUaNamespaceId,
  fetchItemTypeListByOpcUaNamespaceId, fetchOnlineDataByGroupId, fetchOpcUaItemListByGroupId
} from "@/services/item";

export interface ItemModelStateType {
  opcUaItemList: Array<OpcUaItemDataType>;
  itemCategoryList: Array<ItemCategoryDataType>;
  itemObjectList: Array<ItemObjectDataType>;
  itemTypeList: Array<ItemTypeDataType>;
}

export interface ItemModelType {
  namespace: string;
  state: ItemModelStateType;
  effects: {
    fetchOpcUaItemListByGroupId: Effect;
    fetchItemCategoryListByOpcUaNamespaceId: Effect;
    fetchItemObjectListByOpcUaNamespaceId: Effect;
    fetchItemTypeListByOpcUaNamespaceId: Effect;
    editOpcUaItemFetch: Effect;
    createOpcUaItemFetch: Effect;
    deleteItemFetch: Effect;
    fetchOnlineDataByGroupId: Effect;
  },
  reducers: {
    queryOpcUaItemList: Reducer<ItemModelStateType>;
    queryItemCategoryList: Reducer<ItemModelStateType>;
    queryItemObjectList: Reducer<ItemModelStateType>;
    queryItemTypeList: Reducer<ItemModelStateType>;
    resetOpcUaItemList: Reducer<ItemModelStateType>;
  }
}

const ItemModel: ItemModelType = {
  namespace: 'item',
  state: {
    opcUaItemList: [],
    itemCategoryList: [],
    itemObjectList: [],
    itemTypeList: [],
  },
  effects: {
    * fetchOpcUaItemListByGroupId({payload}, {call, put}) {
      const response = yield call(fetchOpcUaItemListByGroupId, payload);
      yield put({
        type: 'queryOpcUaItemList',
        payload: response,
      });
    },
    * fetchItemCategoryListByOpcUaNamespaceId({payload}, {call, put}) {
      const response = yield call(fetchItemCategoryListByOpcUaNamespaceId, payload);
      yield put({
        type: 'queryItemCategoryList',
        payload: response,
      });
    },
    * fetchItemObjectListByOpcUaNamespaceId({payload, callback}, {call, put}) {
      const response = yield call(fetchItemObjectListByOpcUaNamespaceId, payload);
      yield put({
        type: 'queryItemObjectList',
        payload: response,
      });
      if (callback) callback(response);
    },
    * fetchItemTypeListByOpcUaNamespaceId({payload, callback}, {call, put}) {
      const response = yield call(fetchItemTypeListByOpcUaNamespaceId, payload);
      yield put({
        type: 'queryItemTypeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    * editOpcUaItemFetch({payload, callback}, {call}) {
      yield call(editOpcUaItemFetch, payload);
      if (callback) callback();
    },
    * createOpcUaItemFetch({payload, callback}, {call}) {
      yield call(createOpcUaItemFetch, payload);
      if (callback) callback();
    },
    * deleteItemFetch({payload, callback}, {call}) {
      yield call(deleteItemFetch, payload);
      if (callback) callback();
    },
    * fetchOnlineDataByGroupId({payload}, {call, put}) {
      const response = yield call(fetchOnlineDataByGroupId, payload);
      yield put({
        type: 'queryOpcUaItemList',
        payload: response,
      });
    }
  },
  reducers: {
    queryOpcUaItemList(state = state, action) {
      return {
        ...state,
        opcUaItemList: action.payload,
      }
    },
    queryItemCategoryList(state = state, action) {
      return {
        ...state,
        itemCategoryList: action.payload,
      }
    },
    queryItemObjectList(state = state, action) {
      return {
        ...state,
        itemObjectList: action.payload,
      }
    },
    queryItemTypeList(state = state, action) {
      return {
        ...state,
        itemTypeList: action.payload
      }
    },
    resetOpcUaItemList(state = state) {
      return {
        ...state,
        opcUaItemList: []
      }
    }
  },
};

export default ItemModel;
