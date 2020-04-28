import React from 'react';
import './InputForm.css';

const types = ['topic', 'candidate', 'debate']
const colors = ['#29335C', '#DB2B39', '#F3A712']

class InputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topics: [], 
            candidates: [], 
            debates: [],
            candidateOptions: [],
            debateOptions: []
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.removeItem = this.removeItem.bind(this)
    }
    componentDidMount() {
        fetch('/candidates', {
            method: 'get',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            }
        }).then(res=> res.json()).then(data => {
            let candidates = data.candidates
            let debates = data.debates
            this.setState({
                candidateOptions: candidates, 
                debateOptions: debates
            })
        })
    }
    handleSubmit(event) {
        event.preventDefault();
        const {topics, candidates, debates} = this.state
        this.props.onSubmit(topics, candidates, debates)
    }
    handleKeyDown(msg) {
        this.setState({
            [msg.type]: [...new Set([...this.state[msg.type], msg.value])]
        })
        
    }
    removeItem(name, type) {
        let newItems;
        if (name === '') {
            newItems= this.state[type].slice(0, this.state[type].length - 1)
        } else {
            newItems = this.state[type].filter(el=> el !== name)
        }
        this.setState({
            [type]: newItems
        })
        
    }
    render() {
        const { debateOptions, candidateOptions, candidates, debates, topics } = this.state
        return (
            <div className="input-form-wrapper">
                    <InputDropdown placeholder="topics: climate change" removeItem={this.removeItem} type="topics" inputs={topics} onChange={this.handleChange} handleKeyDown={this.handleKeyDown}/>
                    <InputDropdown  placeholder="candidates: Bernie Sanders" removeItem={this.removeItem} type="candidates" options={candidateOptions} inputs={candidates} onChange={this.handleChange} handleKeyDown={this.handleKeyDown}/>
                    <InputDropdown placeholder="debates: New Hampshire Democratic Debate" removeItem={this.removeItem} type="debates" options={debateOptions} inputs={debates} onChange={this.handleChange} handleKeyDown={this.handleKeyDown}/>
                    <input className="button-add" type="button" onClick={this.handleSubmit} value="Search" ></input>
            </div>
        )
    }
}

class InputDropdown extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            value: '', 
            filteredOptions: [], 
            focused: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.removeItem = this.removeItem.bind(this)
        // this.handleBlur = this.handleBlur.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handlePlusClick = this.handlePlusClick.bind(this)
    }
    handleChange(event) {
        this.setState({
            value: event.target.value
        }, () => {
            console.log(this.state.value)
        })
    }
    handleKeyDown(event) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            console.log('this worked')
            if (this.state.value !== '') {
                const msg = {
                    type: this.props.type, 
                    value: this.state.value
                }
            this.props.handleKeyDown(msg)
            this.setState({
                value: ''
            })
        }
        } else if (event.key === 'Backspace' && this.state.value === '') {
            this.props.removeItem('', this.props.type)
        }
    }
    removeItem(name) {
        const {type} = this.props
        this.props.removeItem(name, type)
    }
    handleSelect(name) {
        this.setState({
            focused: false
        })
        const msg = {
            type: this.props.type, 
            value: name
        }
        this.props.handleKeyDown(msg)
        this.setState({
            value: ''
        })
    }
    handlePlusClick() {
        if (this.state.value !== '') {
            const msg = {
                type: this.props.type, 
                value: this.state.value
            }
            this.props.handleKeyDown(msg)
            this.setState({
                value: ''
            })
        }
        
    }
    handleFocus(){
        this.setState({
            focused: true
        })
    }
    render() {
        const {inputs, type, options} = this.props
        let placeholder = this.props.placeholder
        let filteredOptions;
        if (options) {
            if (this.state.value !== '') {
                filteredOptions = options.filter(el=>el.toLowerCase().includes(this.state.value.toLowerCase()))
            } else {
                filteredOptions = options
            } 
            if (inputs.length !== 0) {
                inputs.forEach(input=> {
                    filteredOptions = filteredOptions.filter(el=> el !== input)
                })
                
            }
        }
        if (inputs.length !== 0) {
            placeholder = ''
        }

        return (
            <div className="input-dropdown-wrapper">
                            <div className="text-input">
                            {
                                inputs.map(el=> {
                                    return <InputItem type={type.slice(0,type.length-1)} itemName = {el} removeItem={this.removeItem}/>
                                })
                            }
                            <input onFocus={this.handleFocus} onBlur={this.handleBlur} value = {this.state.value} placeholder={placeholder} className="input-candidate" type="text" onChange = {this.handleChange} onKeyDown={this.handleKeyDown} ></input>
                            <div className="plus-button" onClick={this.handlePlusClick}>+</div>
                            </div>
                            
                        {filteredOptions && <div className="input-dropdown" style={{display: this.state.focused ? 'block' : 'none'}}>
                            {
                                filteredOptions.map(el => {
                                    return <InputDropdownOption inputValue={this.state.value} item={el} handleSelect={this.handleSelect} />
                                })
                            }
                        </div>}
                        
                    </div>
        )
    }
}

class InputDropdownOption extends React.Component {
    constructor(props) {
        super(props)
        this.handleSelect = this.handleSelect.bind(this);
    }
    handleSelect() {
        console.log(this.props.item)
        this.props.handleSelect(this.props.item);
    }
    render() {
        
        return(
            <div onClick={this.handleSelect} className="input-dropdown-item"> {this.props.item}</div> 
        )
    }
}


class InputItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        const {itemName} = this.props
        this.props.removeItem(itemName)
    }
    render(){
        const { itemName, type } = this.props
        
        const style = {
            backgroundColor: colors[types.indexOf(type)]
        }

        return (
                <div style={style} className = "input-item_div_wrapper">
                    <div className="input-item_name">{itemName}</div>
                    <div className="input-item_delete" onClick={this.handleClick}>X</div>
                </div>
        )
    } 
}

export default InputForm;
