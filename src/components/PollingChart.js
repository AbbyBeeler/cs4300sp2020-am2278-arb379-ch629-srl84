import React from 'react'
import CanvasJSReact from './canvasjs.react';

//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class PollingChart extends React.Component {
  render () {
    const {candidates, title, date} = this.props

    let data = candidates && candidates.map((el) => {
        return {
            type: "spline", 
            name: el.name, 
            showInLegend: true, 
            markerSize: 0,
            dataPoints: el.polls && el.polls.map(poll => {
                let marker; 
                if (new Date(date) === new Date(poll.date)) {
                    marker = 5;
                } else marker = 0; 
                return {y: poll.pct, x: new Date(poll.date), markerSize: marker}
            })
        }
    })
    const options = {
        animationEnabled: true,	
        title:{
            text: title, 
            fontFamily: 'Montserrat'
        },
        legend: {
            horizontalAlign: "left", // "center" , "right"
            verticalAlign: "center",  // "top" , "bottom"
            fontSize: 12, 
            fontFamily: 'Hind', 
            fontWeight: 'lighter'
        },
        axisY : {
            title: "Poll Percentages",
            includeZero: false, 
            titleFontFamily: 'Hind', 
            labelFontFamily: 'Hind'
        },
        axisX: {
            titleFontFamily: 'Hind', 
            labelFontFamily: 'Hind' 
        },
        toolTip: {
            shared: true, 
            fontFamily: 'Hind'
        },
        data: data
    }
    return (
        <div>
            <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
        </div>
    )
  }
}



export default PollingChart