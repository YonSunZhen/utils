import { EChartOption, EChartsSeriesType } from 'echarts';

// 重写对象中的每一个子项的类型
type IChartItems<T> = {
  [k in keyof T]: IChartItemInfo
};
export interface IChartItemInfo {
  label: string;
  color?: string;
  selected?: boolean;
}

export interface IChartParams<T> {
  title: string;
  type: EChartsSeriesType;
  dataset: IChartDataset<T>[];
  itemsConf: IChartItems<T>;
}

export interface IChartDataset<T> {
  xAxisName?: string;
  detail: T;
}

interface IFormattedData {
  xAxis?: string[];
  itemsArr: IFormattedItemsInfo[]
}

interface IFormattedItemsInfo {
  name: string;
  color?: string;
  label?: string;
  selected?: boolean;
}

// tslint:disable: forin
export class ChartHelp<T> {

  private _title: string;
  private _type: EChartsSeriesType;
  private _itemsConf: IChartItems<T>;
  private _dataset: IChartDataset<T>[];
  private _formattedData: IFormattedData;
  constructor(params: IChartParams<T>) {
    this._title = params.title;
    this._type = params.type;
    this._itemsConf = params.itemsConf;
    this._dataset = params.dataset;
    this._formattedData = this._formatData(this._itemsConf, this._dataset);
  }

  private _genCommonConf() {
    const conf: EChartOption = {};
    const _title = this._title;
    conf.title = {text: _title, left: 'center'};
    conf.animation = false;
    return conf;
  }

  genLineOrBarConf(params?: IChartParams<T>) {
    const _otherConf: EChartOption = {};
    const _commonConf = this._genCommonConf();
    _otherConf.color = this._formattedData.itemsArr.map(m => m.color as string);
    _otherConf.xAxis = this._genXAxis();
    _otherConf.yAxis = this._genYAxis();
    _otherConf.series = this._genLineOrBarSeries(this._dataset);
    _otherConf.legend = this._genLegend({top: 30});
    const conf = Object.assign({}, _commonConf, _otherConf);
    return conf;
  }

  genPieConf(params?: IChartParams<T>) {
    const _otherConf: EChartOption = {};
    const _commonConf = this._genCommonConf();
    _otherConf.series = this._genPieSeries(this._dataset);
    _otherConf.legend = this._genLegend({top: 20});
    const conf = Object.assign({}, _commonConf, _otherConf);
    return conf;
  }

  // 生成x轴相关配置
  private _genXAxis(): EChartOption.XAxis[] {
    const xAxisArr: EChartOption.XAxis[] = [];
    const _objXAxis: EChartOption.XAxis = {
      type: 'category',
      data: this._formattedData.xAxis,
      axisPointer: { type: 'shadow' },
      axisTick: {
        alignWithLabel: true, // x轴标注居中显示
      }
    };
    xAxisArr.push(_objXAxis);
    return xAxisArr;
  }

  // 生成y轴相关配置
  private _genYAxis(): EChartOption.YAxis[] {
    const yAxisArr: EChartOption.YAxis[] = [];
    const _objYAxia: EChartOption.YAxis = {
      type: 'value',
      name: '资源/人月',
      axisLabel: {
        formatter: '{value}'
      }
    };
    yAxisArr.push(_objYAxia);
    return yAxisArr;
  }


  private _genLineOrBarSeries(dataset: IChartDataset<any>[]) {
    let _seriesArr: EChartOption.Series[]  = [];
    const _itemsArr = this._formattedData.itemsArr;
    _itemsArr.forEach((_item) => {
      const _objSeries: EChartOption.SeriesLine = {};
      _objSeries.type = this._type;
      _objSeries.name = _item.name;
      _objSeries.label = {
        // show: true, // 设置显示label
      };
      _objSeries.data = [];
      dataset.forEach(_dataset => {
        _objSeries.data?.push(_dataset.detail[_item.name]);
      });
      _seriesArr.push(_objSeries);
    });
    return _seriesArr;
  }

  private _genPieSeries(dataset: IChartDataset<any>[]) {
    let _seriesArr: EChartOption.Series[]  = [];
    const _objSeries: EChartOption.SeriesLine = {};
    const _itemsArr = this._formattedData.itemsArr;
    _objSeries.type = this._type;
    _objSeries.label = {
      // show: true, // 设置显示label
    };
    _objSeries.data = [];
    const _dimensionVal = dataset[0].detail;
    _itemsArr.forEach((_item) => {
      const item: any = {
        value: _dimensionVal[_item.name] || 0,
        name: _item.name
      }
      _objSeries.data?.push(item);
    });
    _seriesArr.push(_objSeries);
    return _seriesArr;
  }

  private _formatData(itemsConf: IChartItems<T>, dataset: IChartDataset<T>[]): IFormattedData {
    const xAxis: string[] = [];
    const itemsArr: IFormattedItemsInfo[] = [];
    for(const key in itemsConf) {
      const _item: IFormattedItemsInfo = {
        name: key,
        color: itemsConf[key].color,
        label: itemsConf[key].label,
        selected: itemsConf[key].selected
      }
      itemsArr.push(_item);
    }
    dataset.forEach((dataItem) => {
      xAxis.push(dataItem.xAxisName as string);
    })
    return {
      itemsArr,xAxis
    }
  }

  private _genLegend({top = 0}) {
    const legend: EChartOption.Legend = {
      top: top,
      orient: 'horizontal',
      selected: {}
    };
    const _itemsArr = this._formattedData.itemsArr;
    const _selectedObj: any = {};
    _itemsArr.forEach((_item) => {
      _selectedObj[_item.label as string] = _item.selected;
    })
    legend.selected = _selectedObj;
    return legend;
  }


}
