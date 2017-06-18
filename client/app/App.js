import React, { Component } from 'react';
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      shortenedUrl: '',
      error: ''
    }
    this.onChange = this.onChange.bind(this);
    this.validUrl = this.validUrl.bind(this);
  }

  onChange(event ){
    const value = event.target.value;

    this.setState({
      url: value
    })
  }

  validUrl(text){
    const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if(!re.test(text)){
      return true;
    }
  }

  shorten(e) {
    e.preventDefault() 
    const url = this.state.url;
    let text = this.refs.text;


    axios.get('http://localhost:8080/shorten?url=' + url)
      .then(response => {
        
        this.setState({
          shortenedUrl: response.data.shortUrl,
          error: response.data.error
        })
      })
      text.value=""
  }

  render() {
    let { url, error, shortenedUrl } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h2>RTR Link Shortner</h2>
        </div>
        <form onSubmit={ (e) => this.shorten(e) }>
          <input 
            className={this.validUrl(url) ? 'error' : ''}
            type="text" 
            ref="text" 
            onChange={this.onChange}/>
          <button type="submit" disabled={this.validUrl(url)}>Shorten</button>
        </form>
        <div className="show-link">
          {error ? <p className="error">{error}</p> : null }
          <a href={shortenedUrl} target="_blank">{shortenedUrl} </a>
        </div>
      </div>
    );
  }
}

module.exports = App;
