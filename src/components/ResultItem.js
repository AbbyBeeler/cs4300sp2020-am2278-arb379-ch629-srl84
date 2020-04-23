import React from 'react'; 
import './ResultItem.css'

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
        if (a.length > 1) {
            time = parseInt(a[0]*60) + parseInt(a[1])
        }
        this.videoElement.currentTime = time
        if (!(inputTime === undefined)) this.videoElement.play();
        
    }
    render() {
        const {video, quotes, inputs} = this.props
        const quoteItems = quotes.map(quote => 
            <Quote
                speaker = {quote.speaker}
                time = {quote.time}
                text = {quote.text}
                updateTime = {this.handleUpdateTime}
                inputs={inputs}
            ></Quote>
        )
        return (
            <div>
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
        const {speaker, time, text, inputs} = this.props

        const regexp = new RegExp(`\\b(${inputs.join('|')})\\b`, 'gi');
        const words = text.split(regexp)

        const innertext = words.map((word,i) => {
            if (i%2 === 0) return <span>{word}</span>
            else return <span className="highlight">{word}</span>
        })
        return(
            <div onClick = {this.handleClick}>
                <p><strong>{speaker}</strong><span>{ ' (' + time + ') '}</span>
                <span className="quote-wrapper">{ innertext }</span>

                </p>
            </div>
        )
    }
    
}

export default ResultItem;