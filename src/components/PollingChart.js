import React from 'react'
import Chart from 'chart.js'
let myLineChart;

let colors  = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

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
        let x_labels;
        const dataSets = candidates && candidates.map((el,i)=> {
            x_labels = el.polls.map(poll => {
                let date = new Date(poll.date)
                return `${months[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}`
            })
            const y_points = el.polls.map(poll=>poll.pct)
            return {
                label: el.name, 
                data: y_points, 
                pointBorderWidth: 1,
                pointHoverRadius: 3,
                borderColor: colors[i], 
                fill: false, 
                borderWidth: 2, 
                lineTension: 0.1, 
                pointBackgroundColor: colors[i]
            } 
        })


        myLineChart = new Chart(myChartRef, {
            type: "line",
            data: {
                datasets: dataSets ? dataSets : [], 
                labels: x_labels
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
                    titleFontSize: 12, 
                    titleFontStyle: 'normal', 
                    titleFontFamily: 'Hind', 
                    titleMarginBottom: 12,
                    titleFontColor: 'black', 
                    bodyFontSize: 14, 
                    bodyFontStyle: 'normal', 
                    bodyFontFamily: 'Hind', 
                    backgroundColor: '#E5E5E5', 
                    bodyFontColor: 'black'
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