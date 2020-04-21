import React from 'react';
import './App.css';
import InputWrapper from './components/InputWrapper';
import OutputWrapper from './components/OutputWrapper';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {},
      output: []
    }
    this.sendInputInformation = this.sendInputInformation.bind(this)
    this.onClear = this.onClear.bind(this)
  }
  sendInputInformation(newInput) {
    console.log('input sent')
    this.setState({
      input: newInput
    }, ()=>{
      fetch('/search', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInput)
      }).then(res => res.json()).then(data => {
        this.setState({
          output: data['results']
        })
      })
    })
  }
  onClear() {
    this.setState({
      output: []
    })
  }
  render(){
    return (
    <div className="App">
      <h1 className="app-title">Shortened Debates.</h1>
      <p className="app-description">watch the important moments on the issues you are care about.</p>
      <InputWrapper onInputChange={this.sendInputInformation} onClear={this.onClear}/>
      <OutputWrapper outputs={this.state.output}></OutputWrapper>
    </div>
  );
}
}

export default App;
