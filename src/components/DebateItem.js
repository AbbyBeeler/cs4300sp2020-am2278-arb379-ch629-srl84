import React from 'react'; 
import './DebateItem.css'
import ResultItem from './ResultItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faChevronRight } from '@fortawesome/free-solid-svg-icons'
import  Anime from 'react-anime'

class DebateItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openItem: false, 
            openModal: false
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }
    handleClick() {
        this.setState({
            openItem: !this.state.openItem
        })
    }
    handleModalOpen() {
        this.props.handleModalOpen(this.props.index)
    }
    render() {
        const { title, date, description, results, inputs, candidates, isPolling } = this.props;
        const resultItems = results.map((result) =>
            <ResultItem 
                video={result.video}
                quotes={result.quotes}
                inputs={inputs}
                candidates={candidates}
            ></ResultItem>
        )
        const degrees = this.state.openItem ? 90 : 0
        const animePropsIcon = {
            rotate: degrees
        }
        // const animePropsResults = {
        //     opacity: [0,1],
        //     duration: 1000
        // }
        return (
            <div className = "debate-item-wrapper">
                <div>
                    <div className="debate-title-wrapper" >
                        <div className="debate-beg">
                            <div className="debate-title" onClick={this.handleClick} >{title}</div>
                            <Anime {...animePropsIcon}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </Anime>
                        </div>
                        {isPolling && <div className="debate-polling" onClick = {this.handleModalOpen}>Polling Data</div> }
                    </div>
                    <div className="debate-date">{date}</div>
                    
                </div>
                
                {this.state.openItem && 
                    <div>
                        <div className="debate-description">{description}</div>
                        {resultItems}
                    </div>
                }
                
            </div>
        )
    }
}




export default DebateItem;