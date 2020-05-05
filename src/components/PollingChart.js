import React from 'react'
import Chart from 'chart.js'
import 'chartjs-plugin-annotation'
let myLineChart;

let colors  = ["#29335C", "#DB2B39", "#F3A712", "#065931", "#660068", "#DDC700", "#5569BC", "#FF7883", "#F2CA7B", "#19C472", "#E282E4", "#E282E4"];

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

class PollingChart extends React.Component {
    chartRef = React.createRef();
    componentDidMount() {
        this.buildChart();
    }
    componentDidUpdate() {
        this.buildChart();
    }
    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        
        const {candidates, title} = this.props
        if (typeof myLineChart !== "undefined") myLineChart.destroy();
        let x_data;
        const dataSets = candidates && candidates.map((el,i)=> {
            let dataPoints = el.polls.map(poll => poll.pct)
            x_data = el.polls.map(poll=>new Date(poll.date).getTime())
            return {
                label: el.name, 
                type: 'line',
                data: dataPoints,
                pointRadius: 3,
                pointHoverRadius: 5,
                borderColor: colors[i], 
                fill: false, 
                borderWidth: 2, 
                hoverBorderWidth: 4,
                lineTension: 0.1, 
                pointBackgroundColor: colors[i]
            } 
        })

        let needle = new Date(this.props.date).getTime()
        const closest = x_data && x_data.reduce((a, b) => {
            return Math.abs(b - needle) < Math.abs(a - needle) ? b : a;
        });

        let addValue = 0; 

        if (needle > closest) addValue = addValue+0.5
        if (needle < closest) addValue = addValue-0.5



        myLineChart = new Chart(myChartRef, {
            type: "line",
            data: {
                datasets: dataSets ? dataSets : [],
                labels: x_data
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 5,
                        left: 15,
                        right: 15,
                        bottom: 15
                    }
                }, 
                legend: {
                    display: true, 
                    position: 'left', 
                    labels: {
                        fontSize: 14, 
                        fontFamily: 'Hind', 
                        fontColor: 'black'
                    }
                }, 
                tooltips: {
                    titleFontSize: 0, 
                    titleFontStyle: 'normal', 
                    titleFontFamily: 'Hind', 
                    titleMarginBottom: 12,
                    titleFontColor: 'black', 
                    bodyFontSize: 14, 
                    bodyFontStyle: 'normal', 
                    bodyFontFamily: 'Hind', 
                    backgroundColor: '#E5E5E5', 
                    bodyFontColor: 'black',
                    mode: 'index',
                    axis: 'y'
                },
                annotation: {
                    annotations: [
                      {
                        drawTime: "afterDatasetsDraw",
                        id: "vline",
                        scaleID: "x-axis-0",
                        type: "line",
                        mode: "vertical",
                        value: x_data && x_data.indexOf(closest) + addValue,
                        borderColor: "black",
                        borderWidth: 4,
                        position: "top",
                        label: {
                          backgroundColor: "#4a4a4a",
                          content: "Debate",
                          enabled: true
                        }
                      }
                    ]
                },
                title: {
                    display: true,
                    text: title, 
                    fontSize: 24, 
                    fontFamily: 'Montserrat', 
                    fontColor: 'black'
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Polling', 
                            fontColor: 'black', 
                            fontSize: 16
                        },
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return value + '%';
                            }, 
                            min: 0
                        }
                        
                    }], 
                    xAxes: [{
                        ticks: {
                            callback: (utc) => {
                                let date = new Date(utc)
                                return `${months[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}`;
                            }
                          }
                    }]
                }

            }

        });
    }
    render () {
    return (
        <div>
            <canvas
                    id="myChart"
                    ref={this.chartRef}
                    height="500px"
                />
        </div>
    )
  }
}



export default PollingChart