import React from 'react';
import Select from 'react-select'
import './InputForm.css';

const options = [
    { value: 'blues', label: 'Blues' },
    { value: 'rock', label: 'Rock' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'orchestra', label: 'Orchestra' } 
  ];

class InputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topicValue: '', 
            candidateValue: '', 
            debateValue: '',
            candidateOptions: [],
            debateOptions: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount() {
        
        fetch('/candidates', {
            method: 'post',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            }
        }).then(res=> res.json).then(res => res.json()).then(data => {
            console.log(data)})
    }
    handleChange(event) {
        console.log(event)
    }
    handleSubmit(event) {
        event.preventDefault();
        const state = this.state
        this.props.onAddChange(state.topicValue, state.candidateValue, state.debateValue);
        this.setState({
            topicValue: '', 
            candidateValue: '', 
            debateValue: ''
        })
        
    }
    render() {
        return (
            <div>
                <form>
                    <Select onChange={this.handleChange} options={options}/>
                    <Select/>
                    <Select/>
                    <input className="button-add" type="button" onClick={this.handleSubmit} value="Search" ></input>
                </form>
                <div className="input-message">Separate by commas for multiple topics, candidates, or debates</div>
            </div>
        )
    }
}



export default InputForm;
