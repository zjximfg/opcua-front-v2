import {Effect} from "dva";
import {Reducer} from "redux";
import {itemCurveDataFetch} from "@/services/itemCurve";

export interface ItemCurveModelStateType {
  itemCurveData: Array<ItemCurveDataType>
}

export interface ItemCurveModelType {
  namespace: string;
  state: ItemCurveModelStateType;
  effects: {
    itemCurveDataFetch: Effect;
  };
  reducers: {
    getItemCurveData: Reducer<ItemCurveModelStateType>;
  };
}

const ItemCurveModel: ItemCurveModelType = {
  namespace: 'itemCurve',
  state: {
    itemCurveData: [],
  },
  effects: {
    * itemCurveDataFetch({payload}, {call, put}) {
      const response = yield call(itemCurveDataFetch, payload);
      yield put({
        type: 'getItemCurveData',
        payload: response,
      })
    },
  },
  reducers: {
    getItemCurveData(state = state, action) {
      return {
        ...state,
        itemCurveData: action.payload
      }
    },
  },
};

export default ItemCurveModel;
