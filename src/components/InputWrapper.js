import React from 'react';
import InputForm from './InputForm';
import './InputWrapper.css';

class InputWrapper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            topics: [],
            candidates: [],
            debates: [], 
            errorOn: false
        }
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(topics, candidates, debates) {
        this.setState({
            topics: topics,
            candidates: candidates, 
            debates: debates
        }, () => {
            if (this.state.topics.length) {
                this.setState({
                    errorOn: false
                })
                this.props.onInputChange(
                    { 
                        topics: this.state.topics, 
                        candidates: this.state.candidates, 
                        debates: this.state.debates
                    }
                )
            }
            else {
                this.setState({
                    errorOn: true
                })
                this.props.onClear()
            }
        });
    }
    render(){
        return(
            <div>
            <InputForm 
                topics={this.state.topics} 
                candidates={this.state.candidates}
                debates={this.state.debates}
                onSubmit={this.onSubmit}>

            </InputForm>
            <ErrorMessage errorOn={this.state.errorOn}></ErrorMessage>
        </div>
        )
        
    }
}

function ErrorMessage(props) {
    if (props.errorOn) {
        return (
        <div className="error-message">
            Please insert at least 1 topic!
        </div>
    )
    }
    return null; 
}

export default InputWrapper;