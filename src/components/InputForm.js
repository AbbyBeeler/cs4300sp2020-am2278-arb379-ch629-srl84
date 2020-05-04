import React from 'react';
import './InputForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faPlus } from '@fortawesome/free-solid-svg-icons'

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
            focused: false, 
            canClose: true, 
            currrentKey: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handlePlusClick = this.handlePlusClick.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseOver = this.handleMouseOver.bind(this)
    }
    handleChange(event) {
        this.setState({
            value: event.target.value
        }, () => {
            const {options,inputs} = this.props
            if (options) {
                if (this.state.value !== '') {
                    this.setState({
                        filteredOptions: options.filter(el=>el.toLowerCase().includes(this.state.value.toLowerCase()))
                    }, () => {
                        if (inputs.length !== 0) {
                            inputs.forEach(input=> {
                                this.setState({
                                    filteredOptions: this.state.filteredOptions.filter(el=> el !== input)
                                })
                            })
                            
                        }
                    }) 
                } else {
                    this.setState({
                        filteredOptions: options
                    }, () => {
                        if (inputs.length !== 0) {
                            inputs.forEach(input=> {
                                this.setState({
                                    filteredOptions: this.state.filteredOptions.filter(el=> el !== input)
                                })
                            })
                            
                        }
                    })
                } 
                
            }
        })
    }
    handleKeyDown(event) {
        let msg;
        if ((event.key === 'Enter' || event.key === 'Tab') && ((this.state.filteredOptions && this.state.filteredOptions.length === 0) || (!this.state.filteredOptions))) {
            if (this.state.value !== '') {
                msg = {
                    type: this.props.type, 
                    value: this.state.value
                }
            this.props.handleKeyDown(msg)
            this.setState({
                value: ''
            })
        }
    }
        else if (event.key === 'Enter' && this.state.filteredOptions && this.state.filteredOptions.length > 0) {
            msg = {
                type: this.props.type, 
                value: this.state.filteredOptions[this.state.currentKey]
            }
            this.props.handleKeyDown(msg)
            this.setState({
                value: '', 
                filteredOptions: this.state.filteredOptions.filter(e=> e!==msg.value)
            })
        } else if (event.key === 'Backspace' && this.state.value === '') {
            this.props.removeItem('', this.props.type)
        } else if (event.key === 'ArrowDown' && (this.state.filteredOptions.length > this.state.currentKey)) {
                this.setState({
                    currentKey: this.state.currentKey + 1
                })  
        } else if (event.key === 'ArrowUp') {
            this.setState({
                currentKey: this.state.currentKey - 1
            })
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
            value: '', 
            filteredOptions: this.state.filteredOptions.filter(e=> e!==msg.value)
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
            focused: true, 
            currentKey: 0, 
            filteredOptions: this.props.options
        })
    }
    handleBlur(){
        if (this.state.canClose) {
            this.setState({
                focused: false, 
                currentKey: 0
            })
        }
        
    }
    handleMouseOver() {
        this.setState({
            canClose: false
        })
    }
    handleMouseLeave() {
        this.setState({
            canClose: true
        })
    }
    render() {
        const {inputs, type} = this.props
        const {filteredOptions} = this.state
        let placeholder = this.props.placeholder
        
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
                            <div className="plus-button" onClick={this.handlePlusClick}><FontAwesomeIcon className="plus-button-icon" icon={faPlus} /></div>
                            </div>
                            
                        {filteredOptions && <div id="dropdown" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave} className="input-dropdown" style={{display: this.state.focused ? 'block' : 'none'}}>
                            {
                                filteredOptions.map((el,i) => {
                                    let selectedItem = false;
                                    if (this.state.currentKey === i) {
                                        selectedItem = true
                                    }
                                    return <InputDropdownOption selectedItem={selectedItem} onClick ={(e) => e.stopPropagation()} inputValue={this.state.value} item={el} handleSelect={this.handleSelect} />
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
        this.props.handleSelect(this.props.item);
    }
    render() {
        
        return(
            <div style={{backgroundColor: this.props.selectedItem ? '#dadada' : ''}} onClick={this.handleSelect} className="input-dropdown-item"> {this.props.item}</div> 
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
