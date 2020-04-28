import React from 'react';
import './App.css';
import InputWrapper from './components/InputWrapper';
import OutputWrapper from './components/OutputWrapper';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {},
      output: [], 
      loading: false
    }
    this.sendInputInformation = this.sendInputInformation.bind(this)
    this.onClear = this.onClear.bind(this)
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
            loading: false
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
  render(){
    return (
    <div className="App">
       <p className="app-authors">Samantha Lee (srl84), Cayla Hamann (ch629), Alex Meyer (am2278), Abby Beeler (arb379)</p>
      <h1 className="app-title">Shortened Debates.</h1>
      <p className="app-description">watch the important moments on the issues you care most about.</p>
      <InputWrapper onInputChange={this.sendInputInformation} onClear={this.onClear}/>
      <OutputWrapper inputs={this.state.input} loading={this.state.loading} outputs={this.state.output}></OutputWrapper>
    </div>
  );
}
}

export default App;
