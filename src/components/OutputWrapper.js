import React from 'react';
import DebateItem from './DebateItem';
import Anime from 'react-anime';
import './OutputWrapper.css'

class OutputWrapper extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            animeProps: {opacity: [0,1],
                translateY: [-64,0], 
                delay: (el,i) => i*200}
        }
    }
    handleModalOpen = (index) => {
        this.props.handleModalOpen(index)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.loading !== this.props.loading) {
            this.setState({
                animeProps:{}
            })
        } 
    }
    render() {
        const input = Object.keys(this.props.inputs).length !== 0 && Object.values(this.props.inputs).flat()
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
        return (
            <div className="output-wrapper">
                {this.props.loading &&  <LoadingSpinner/> }
                { !this.props.loading && <Anime {...this.state.animeProps}>
                {debateItems}
        </Anime> }
            </div>
        )
    }
}

function LoadingSpinner(props) {
    return (
        <div class="sk-chase">
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
        </div>
    )
}

export default OutputWrapper