import React from 'react';
import './App.css';
import InputWrapper from './components/InputWrapper';
import OutputWrapper from './components/OutputWrapper';
import PollingChart from './components/PollingChart'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {},
      output: [], 
      loading: false, 
      openModal: false, 
      modalIndex: -1, 
      animateOnce: false, 
      queryWords: undefined, 
      enableQueryExpansion: true
    }
    this.sendInputInformation = this.sendInputInformation.bind(this)
    this.onClear = this.onClear.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleAnimate = this.handleAnimate.bind(this)
    this.handleEnable = this.handleEnable.bind(this);
  }
  sendInputInformation(newInput) {
    this.setState({
      input: newInput, 
      loading: true
    }, ()=>{
      let endpoint; 
      if (this.state.enableQueryExpansion) endpoint = '/search'
      else endpoint = 'exactsearch'
      fetch(endpoint, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInput)
      }).then(res => res.json()).then(data => {
        console.log(data)
        if (!this.state.loading) {
          this.setState({
            output: []
          })
        }
        else if (data['results'].length === 0) {
          this.setState({
            output: undefined, 
            loading: false, 
            queryWords: undefined
          })
        } 
        else {
          this.setState({
            output: data['results'], 
            loading: false, 
            animateOnce: true, 
            queryWords: data['query']
          })
        }
        
      })
    })
  }
  onClear() {
    this.setState({
      output: [], 
      loading: false
    })
  }
  handleModalOpen(index) {
    this.setState({
      openModal: true, 
      modalIndex: index
    })
  }
  handleModalClose() {
    this.setState({
      openModal: false, 
      modalIndex: -1
    })
  }
  handleAnimate() {
    this.setState({
      animateOnce: false
    })
  }
  handleEnable() {
    this.setState({
      enableQueryExpansion: !this.state.enableQueryExpansion
    }, () => {
      this.sendInputInformation(this.state.input)
    })
  }
  render(){
    const {output, modalIndex, queryWords, enableQueryExpansion} = this.state
    return (
    <div className="App">
       <p className="app-authors">Samantha Lee (srl84), Cayla Hamann (ch629), Alex Meyer (am2278), Abby Beeler (arb379)</p>
      <h1 className="app-title">Shortened Debates.</h1>
      <p className="app-description">watch the important moments on the issues you care most about.</p>
      <InputWrapper onInputChange={this.sendInputInformation} onClear={this.onClear}/>
      {queryWords && <QueryExpansion enable={enableQueryExpansion} handleEnable = {this.handleEnable} query={queryWords}/>}
      <OutputWrapper queryWords={queryWords} handleAnimate = {this.handleAnimate} handleModalOpen={this.handleModalOpen} inputs={this.state.input} loading={this.state.loading} outputs={this.state.output} animateOnce={this.state.animateOnce}></OutputWrapper>
      <Modal candidates={modalIndex>=0 && output[modalIndex].candidates} title={modalIndex>=0 && output[modalIndex].title} date={modalIndex>=0 && output[modalIndex].date} closeItem={this.handleModalClose} open={this.state.openModal} />
    </div>
  );
}
}

class Modal extends React.Component {
  constructor(props) {
      super(props); 
      this.handleClose = this.handleClose.bind(this)
  }
  handleClose() {
      this.props.closeItem(); 
  }
  render() {
      let style;
      if (this.props.open) {
          style = {
              display: 'block'
          }
      } else {
          style = {
              display: 'none'
          }
      }
      return (
          <div className="modal" style={style}>
              <div className="modal-content">
                <PollingChart title={this.props.title} candidates={this.props.candidates} date={this.props.date}/>
                  <input className="button-add" type="button" onClick={this.handleClose} value="Close"></input>
              </div>
             
          </div>
      )
  }
}

class QueryExpansion extends React.Component {
  constructor(props) {
    super(props); 
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.props.handleEnable();
  }
  render() {
    const text = this.props.query.reduce((acc, curVal)=> acc + ' ' + curVal + ',')

    const messageText = this.props.enable ? 'Showing results for related terms: ' : 'Related terms: '

    const buttonText = this.props.enable ? 'Disable Query Expansion' : 'Enable Query Expansion'

    return(
      <div className="query-expansion">
        <div>{messageText + text}</div>
        <div className="query-button" onClick = {this.handleClick}>{buttonText}</div>
      </div>
    )
  }
}

export default App;
