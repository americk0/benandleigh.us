import React from 'react';

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      code: '',
      data: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      code: event.target.value,
    });
  }

  handleSubmit(event) {
    const self = this;

    event.preventDefault();

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        self.setState({
          data: this.response,
        });
      }
    }
    xhttp.open('GET', 'https://0zf2icy391.execute-api.us-east-1.amazonaws.com/dev/data/' + this.state.code, true);
    xhttp.send();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>enter your code: <input type="text" value={this.state.code} onChange={this.handleChange} /></p>
        <input type="submit" name="Submit"/>
        <hr />
        debug
        <br />
        <textarea value={this.state.data}></textarea>
      </form>
    );
  }
}

export default Form;
