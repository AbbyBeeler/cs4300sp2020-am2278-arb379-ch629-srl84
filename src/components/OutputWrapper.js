import './OutputWrapper.css'
import Anime from 'react-anime'
import React from 'react';
import DebateItem from './DebateItem'

class OutputWrapper extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            animeProps: undefined
        }
    }
    handleModalOpen = (index) => {
        this.props.handleModalOpen(index)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.loading === false && this.props.loading===false && this.state.animeProps) {
            this.setState({
                animeProps: undefined
            })
        } else if (prevProps.loading === false && this.props.loading === true){
            this.setState({
                animeProps: {
                    opacity: [0,1],
                    translateY: [-64,0], 
                    delay: (el,i) => i*200
                }
            })

        }
    }
    render() {
        let input = Object.keys(this.props.inputs).length !== 0 && Object.values(this.props.inputs).flat()
        if (this.props.queryWords) input = input.concat(this.props.queryWords)
        let debateItems = this.props.outputs && this.props.outputs.map((output, i) => 
            <DebateItem
                title = {output.title}
                date = {output.date}
                description = {output.description}
                results = {output.results}
                key={i}
                inputs={input}
                candidates={output.candidates}
                isPolling={output.is_polling}
                handleModalOpen={this.handleModalOpen}
                index={i}
            >
            </DebateItem>
        )

        if (!this.props.loading && !this.props.outputs) {
            debateItems = <div className="no-results">{'No results'}</div>
        }
        let anime;
        if (this.state.animeProps) {
            anime = <Anime {...this.state.animeProps}>{debateItems}</Anime>
        } else {
            anime = debateItems
        }
        
        return (
            <div className="output-wrapper">
                {this.props.loading &&  <LoadingSpinner/> }
                { !this.props.loading && anime}
            </div>
        )
    }
}

function LoadingSpinner(props) {
    return (
        <div className="sk-chase">
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
        </div>
    )
}

export default OutputWrapper 