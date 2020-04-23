import './OutputWrapper.css'
import Anime from 'react-anime'
import React from 'react';
import DebateItem from './DebateItem'

class OutputWrapper extends React.Component {

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
            >
            </DebateItem>
        )

        if (!this.props.loading && !this.props.outputs) {
            debateItems = <div className="no-results">{'No results'}</div>
        }

        let animeProps = {
            opacity: [0,1],
            translateY: [-64,0], 
            delay: (el,i) => i*200
        }
        return (
            <div className="output-wrapper">
                {this.props.loading &&  <LoadingSpinner/> }
                { !this.props.loading && <Anime {...animeProps}>
                 {debateItems} </Anime>}
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