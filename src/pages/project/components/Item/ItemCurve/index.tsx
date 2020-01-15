import React from 'react';
import {Dispatch} from "redux";
import {ItemCurveModelStateType} from "@/models/itemCurve";
import OpcUaItemDataType from "@/pages/project/components/Item/opcUaItem";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {Chart, Tooltip, Axis, Geom } from 'bizcharts';

interface ItemCurveProps {
  dispatch?: Dispatch<any>;
  itemCurveModel?: ItemCurveModelStateType;
  item: Partial<OpcUaItemDataType>;
  visible: boolean;
}

interface ItemCurveState {
  intervalNumber: NodeJS.Timeout | null;
}
@connect(({itemCurve, loading}: {itemCurve: ItemCurveModelStateType, loading: LoadingDataType})=>{
  return {
    itemCurveModel: itemCurve,
    loading: loading.models.itemCurve,
  }
})
class ItemCurve extends React.Component<ItemCurveProps, ItemCurveState> {

  state: ItemCurveState = {
    intervalNumber: null,
  };

  componentDidMount(): void {
    if (this.state.intervalNumber !== null) {
      clearInterval(this.state.intervalNumber);
    }
    if (!this.props.item.id) return;
    this.setState({
      intervalNumber: setInterval(() => {
        if (!this.props.item.id) return;
        this.getCurveData(this.props.item.id)
      }, 2 * 1000),
    });
  };

  componentWillReceiveProps(nextProps: Readonly<ItemCurveProps>, nextContext: any): void {
    if (!this.props.visible && nextProps.visible) {
      if (this.state.intervalNumber !== null) {
        clearInterval(this.state.intervalNumber);
      }
      this.setState({
        intervalNumber: setInterval(() => {
          if (!nextProps.item.id) return;
          this.getCurveData(nextProps.item.id)
        }, 2 * 1000),
      });
    }
  }

  componentWillUnmount(): void {
    if (this.state.intervalNumber !== null) {
      clearInterval(this.state.intervalNumber);
    }
    this.setState({
      intervalNumber: null
    })
  }

  getCurveData = (itemId: number): void => {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'itemCurve/itemCurveDataFetch',
      payload: {itemId: itemId}
    });
  };


  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {itemCurveModel} = this.props;

    if (!itemCurveModel) return;

    const scale = {
      time:{
        tickCount: 12,
      },
      value: {
        type: "linear",
        tickCount: 3,
      },
      type: {
        type: "cat"
      }
    };

    return (
      <Chart  height={500} data={itemCurveModel.itemCurveData} scale={scale} forceFit>
        <Axis name="time" />
        <Axis name="value" />
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom type="line" position="time*value" size={2} shape={"smooth"}/>
        <Geom
          type="point"
          position="time*value"
          size={2}
          shape="smooth"
          style={{
            stroke: "#fff",
            lineWidth: 1
          }}
        />
      </Chart>
    )
  };
}

export default ItemCurve;
