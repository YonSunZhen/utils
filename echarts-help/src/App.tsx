import React from 'react';
import logo from './logo.svg';
import * as echarts from 'echarts';
import './App.css';

class App extends React.Component {

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('main') as any);
    myChart.setOption({
      title: {
          text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
      }]
  });
  }

  render() {
    return (
      <div id="main" className="App">
        
      </div>
    );
  }
  
}

export default App;
