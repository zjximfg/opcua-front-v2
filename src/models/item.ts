import OpcUaItemDataType from "@/pages/project/components/Item/opcUaItem";
import ItemCategoryDataType from "@/pages/project/components/Item/opcUaItem";
import ItemObjectDataType from "@/pages/project/components/Item/opcUaItem";
import ItemTypeDataType from "@/pages/project/components/Item/opcUaItem";
import {Effect} from "dva";
import {Reducer} from "redux";
import {
  fetchItemCategoryListByOpcUaNamespaceId,
  fetchItemObjectListByOpcUaNamespaceId,
  fetchItemTypeListByOpcUaNamespaceId, fetchOpcUaItemListByGroupId
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
  },
  reducers: {
    queryOpcUaItemList: Reducer<ItemModelStateType>;
    queryItemCategoryList: Reducer<ItemModelStateType>;
    queryItemObjectList: Reducer<ItemModelStateType>;
    queryItemTypeList: Reducer<ItemModelStateType>;
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
    * fetchItemObjectListByOpcUaNamespaceId({payload}, {call, put}) {
      const response = yield call(fetchItemObjectListByOpcUaNamespaceId, payload);
      yield put({
        type: 'queryItemObjectList',
        payload: response,
      });
    },
    * fetchItemTypeListByOpcUaNamespaceId({payload}, {call, put}) {
      const response = yield call(fetchItemTypeListByOpcUaNamespaceId, payload);
      yield put({
        type: 'queryItemTypeList',
        payload: response,
      });
    },
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
  },
};

export default ItemModel;
