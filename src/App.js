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
      animateOnce: false
    }
    this.sendInputInformation = this.sendInputInformation.bind(this)
    this.onClear = this.onClear.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleAnimate = this.handleAnimate.bind(this)
  }
  sendInputInformation(newInput) {
    this.setState({
      input: newInput, 
      loading: true
    }, ()=>{
      fetch('/search', {
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
            loading: false
          })
        } 
        else {
          this.setState({
            output: data['results'], 
            loading: false, 
            animateOnce: true
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
  render(){
    const {output, modalIndex} = this.state
    return (
    <div className="App">
       <p className="app-authors">Samantha Lee (srl84), Cayla Hamann (ch629), Alex Meyer (am2278), Abby Beeler (arb379)</p>
      <h1 className="app-title">Shortened Debates.</h1>
      <p className="app-description">watch the important moments on the issues you care most about.</p>
      <InputWrapper onInputChange={this.sendInputInformation} onClear={this.onClear}/>
      <OutputWrapper handleAnimate = {this.handleAnimate} handleModalOpen={this.handleModalOpen} inputs={this.state.input} loading={this.state.loading} outputs={this.state.output} animateOnce={this.state.animateOnce}></OutputWrapper>
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

export default App;
