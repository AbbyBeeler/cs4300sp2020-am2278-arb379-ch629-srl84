import React from 'react'; 
import './ResultItem.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons'

class ResultItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTime: 0
        }
        this.videoElement = null; 
        this.setVideoElementRef = element => {
            this.videoElement = element
        }
        this.handleUpdateTime = this.handleUpdateTime.bind(this)
    }
    componentDidMount(){
        this.handleUpdateTime()
    }
    handleUpdateTime(inputTime) {
        let a;
        if (inputTime === undefined) {
            a = this.props.quotes[0].time.split(':')
        } else {
            a = inputTime.split(':')
        }
        
        let time = 0
        if (a.length === 2) {
            time = parseInt(a[0]*60) + parseInt(a[1])
        } else if (a.length === 3) {
            time = parseInt(a[0])*60*60 + parseInt(a[1])*60 + parseInt(a[2])
        }
        this.videoElement.currentTime = time
        if (!(inputTime === undefined)) this.videoElement.play();
        
    }
    render() {
        const {video, quotes, inputs, candidates} = this.props
        const quoteItems = quotes.map((quote,i) => {
            const polling = candidates.find((el) => el.name === quote.speaker)
            return (
                <Quote
                speaker = {quote.speaker}
                time = {quote.time}
                text = {quote.text}
                updateTime = {this.handleUpdateTime}
                inputs={inputs}
                candidate={quote.candidate}
                polling={polling}
                key={i}
            ></Quote>
            )
        }
            
        )
        return (
            <div className="result-item">
                <div className="video-wrapper">
                <video  width="500" controls ref={this.setVideoElementRef}>
                    <source src={video} type="video/mp4"></source>
                </video>
                </div>
                {quoteItems}
            </div>
        )
    }
}

class Quote extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(){
        this.props.updateTime(this.props.time)
    }
    render() {
        const {speaker, time, text, inputs, candidate, polling} = this.props

        const regexp = new RegExp(`\\b(${inputs.join('|')})\\b`, 'gi');
        const words = text.split(regexp)

        const innertext = words.map((word,i) => {
            if (i%2 === 0) return <span key={i}>{word}</span>
            else return <span key={i} className="highlight">{word}</span>
        })
        let picture; 
        let style;
        if (!candidate) {
            picture = null; 
            style = {
                backgroundColor: 'white', 
                padding: '10px', 
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
                // border: '2px solid rgba(0, 0, 0, 0.25)',
                // boxSizing: 'border-box',
                fontSize: '14px'
            }
        } else {
            picture = require('../../public/images/' + speaker.replace(/\s/g, '') + '.png')
            style = {
                width: '800px'
            }
        }


        return(
            <div className="quote">
                {candidate && <div className="candidate-info">
                    <img src={picture} alt="candidate"></img>
                    <div className="candidate-speaker">{speaker}</div>
                    {polling.pct_change && <div className="candidate-polling">
                        <FontAwesomeIcon icon={polling.pct_change > 0 ? faArrowUp : faArrowDown} color={polling.pct_change > 0 ? 'green' : 'red' }/>
                        <div className="candidate-percent">{`${polling.pct_change}%`}</div>
                    </div>}
                        </div> } 
                <div onClick = {this.handleClick} className="quote-wrapper" style={style}>
                    <div>{!candidate && <strong>{speaker}</strong>}<span>{ ' (' + time + ') '}</span>
                    <span className="quote-text">{ innertext }</span></div>

                </div>
            </div>
        )
    }
    
}

export default ResultItem;