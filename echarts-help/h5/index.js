class EchartHelp{

  _dataset;
  _dimension;
  _formattedData;
  _other;
  _title;

  constructor(params) {
    this._dataset = params.dataset;
    this._dimension = params.dimension;
    this._other = params.other;
    this._title = params.title;
    this._formattedData = this._formatData(this._dimension, this._dataset)
  }
  
  _genCommonConf() {
    const conf = {};
    const _title = this._title;
    conf.title = {text: _title, left: 'center'};
    // conf.animation = false;
    return conf;
  }

  genLineOrBarConf() {
    const _otherConf = {};
    const _commonConf = this._genCommonConf();
    _otherConf.xAxis = this._genXAxis()
    _otherConf.yAxis = this._genYAxis();
    _otherConf.series = this._genLineOrBarSeries(this._dataset);
    _otherConf.legend = this._genLegend({top: 30});
    const conf = Object.assign({}, _commonConf, _otherConf);
    return conf;
  }

  // 生成x轴相关配置
  _genXAxis() {
    const xAxisArr = [];
    const _objXAxis = {
      type: 'category',
      data: this._formattedData.xAxis,
      axisPointer: { type: 'shadow' },
      // axisTick: {
      //   // alignWithLabel: true, // x轴标注居中显示
      // },
      axisLabel: {
        // align: 'left'
      },
    };
    xAxisArr.push(_objXAxis);
    return xAxisArr;
  }

  // 生成y轴相关配置
  _genYAxis() {
    const yAxisArr = [];
    const _objYAxia = {
      type: 'value',
      name: '资源/人月',
      nameTextStyle: {
        color: 'white'
      },
      axisLine:  {
        show: true, // 坐标轴线
        lineStyle: {
          color: 'grey'
        }
      },
      axisLabel: { 
        textStyle: { // 坐标轴刻度文字
          color: 'white',
          fontSize: 13,
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    };
    yAxisArr.push(_objYAxia);
    return yAxisArr;
  }

  _genLineOrBarSeries(dataset) {
    console.log('debug2');
    console.log(dataset);
    let _seriesArr = [];
    this._dimension.forEach((_item) => {
      const _objSeries = {};
      _objSeries.type = _item.type; // 类型  bar||line
      _objSeries.name = _item.key; // 维度关键字
      _objSeries.label = {
        show: true, // 设置显示label
      };
      _objSeries.data = []; // 需要显示的数据
      dataset.forEach(_dataset => {
        const _data = _dataset.data;
        _data.forEach(_dataItem => {
          if(_dataItem.key === _item.key) {
            _objSeries.data?.push(_dataItem.value)
          }
        })
      });
      _objSeries.itemStyle = { // 设置条形图的颜色 ...
        normal: {
          // color: function(params) {
          //   const _color = dataset[params.dataIndex].data[params.seriesIndex].color
          //   if(_color) {
          //     return _color
          //   } else {
          //     return _item.color
          //   }
          //   // if(params.data < 10 && params.seriesName === '销量') {
          //   //   return dataset[params.dataIndex].data[params.seriesIndex].color
          //   // } else {
          //   //   return _item.color
          //   // }
          // }
          color: _item.color
        }
      }
      _seriesArr.push(_objSeries);
    });
    return _seriesArr;
  }

  _formatData(dimension, dataset) {
    const xAxis = [];
    dataset.forEach((dataItem) => {
      xAxis.push(dataItem.xAxisName);
    })
    return {
      xAxis
    }
  }

  _genLegend({top = 0}) {
    const legend = {
      top: top,
      orient: 'horizontal',
      selected: {}
    };
    const _selectedObj = {};
    this._dimension.forEach((_item) => {
      _selectedObj[_item.label] = _item.selected;
    })
    legend.selected = _selectedObj;
    return legend;
  }

} 