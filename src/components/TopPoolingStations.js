// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  LabelSeries
} from 'react-vis';

class TopPoolingStations extends React.Component {
  
    constructor(props) {
        super(props);

        this.state = {
            useCanvas: false    
        }

        this.chartData = {}
    } 

    sortProperties = (obj, sortedBy, isNumericSort, reverse) => {
        sortedBy = sortedBy || 1; // by default first key
        isNumericSort = isNumericSort || false; // by default text sort
        reverse = reverse || false; // by default no reverse
    
        var reversed = (reverse) ? -1 : 1;
    
        var sortable = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                sortable.push([key, obj[key]]);
            }
        }
        if (isNumericSort)
            sortable.sort(function (a, b) {
                return reversed * (a[1][sortedBy] - b[1][sortedBy]);
            });
        else
            sortable.sort(function (a, b) {
                var x = a[1][sortedBy],
                    y = b[1][sortedBy];
                return x < y ? reversed * -1 : x > y ? reversed : 0;
            });
        return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
    }

    generateChartData = () => {

        let chartData = {}
        console.log(this.props)

        Object.entries(this.props.news).forEach(([key, data]) => {
            //console.log(key)
            //console.log(data)

            let isForm = true
            if(Object.keys(data.fileInfo).length > 0){
                isForm = false
                console.log('NOT FORM')
            }

            if(isForm) {

                if(data.pollingStation === null || data.pollingStation === undefined ){
                    if(chartData.hasOwnProperty('нет данных')){
                        if (data.violations.length == 0){ 
                            chartData['нет данных'] += data.description.length
                        }else{
                            chartData['нет данных'] += data.violations.length
                        }
                    }else{
                        if (data.violations.length == 0){ 
                            chartData['нет данных'] = data.description.length
                        }else{
                            chartData['нет данных'] = data.violations.length
                        }                                      
                    }  
                }else{
                    if(chartData.hasOwnProperty([data.pollingStation])){
                        if (data.violations.length == 0){ 
                            chartData[data.pollingStation] += data.description.length
                        }else{
                            chartData[data.pollingStation] += data.violations.length
                        }
                    }else{
                        if (data.violations.length == 0){ 
                            chartData[data.pollingStation] = data.description.length
                        }else{
                            chartData[data.pollingStation] = data.violations.length
                        }                                      
                    }  
                }                             
            }                
        });

        this.chartData = chartData
        console.log("CHART CALC")
        console.log(chartData)
    }

  render() {

    this.generateChartData()

    let chartData = {}

    Object.entries(this.chartData).forEach(([x, y]) => {
        chartData[x] = {'x': x, 'y': y}        
    });

    console.log('LAST')
    console.log(chartData)

    const sortedData = this.sortProperties(chartData, 'y', true, true)

    let greenData = []

    sortedData.slice(0, 5).map(bar => (
        greenData.push(bar[1])
    ))

    console.log(greenData)

    console.log("CHART")
    console.log(this.props)

    let emptyData = greenData.length == 0

    const {useCanvas} = this.state;
    const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
    const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;
    return (
      <div>
          {!emptyData
          ? <XYPlot xType="ordinal" width={350} height={200} xDistance={100}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <BarSeries className="vertical-bar-series-example" data={greenData} />
                </XYPlot>
          : <div></div>
        }        
      </div>
    );
  }
}

export default TopPoolingStations;