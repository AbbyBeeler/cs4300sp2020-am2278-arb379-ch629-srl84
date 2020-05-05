import React from 'react'
import Chart from 'chart.js'
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
                pointRadius: 2,
                pointHoverRadius: 3,
                borderColor: colors[i], 
                fill: false, 
                borderWidth: 2, 
                hoverBorderWidth: 4,
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
                    bodyFontColor: 'black',
                    mode: 'index',
                    axis: 'y'
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