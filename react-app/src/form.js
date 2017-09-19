import React from 'react';

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      code: '',
      getResponse: '',
      validCode: false,
      message: '',
      numAttending: 'none',
    };

    this.updateCode = this.updateCode.bind(this);
    this.updateAttending = this.updateAttending.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.updateNumAttending = this.updateNumAttending.bind(this);
    this.getData = this.getData.bind(this);
    this.putData = this.putData.bind(this);
  }

  updateCode(event) {
    this.setState({
      code: event.target.value,
    });
  }

  updateAttending(event) {
    this.setState({
      attending: event.target.value === 'attending',
    });
  }

  updateNumAttending(event) {
    this.setState({
      numAttending: event.target.value,
    })
  }

  updateMessage(event) {
    this.setState({
      message: event.target.value,
    })
  }

  getData(event) {
    const self = this;

    event.preventDefault();

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        const getResponse = JSON.parse(this.response);
        self.setState({
          getResponse,
          validCode: true,
        });
      }
    };
    xhttp.open('GET', 'https://0zf2icy391.execute-api.us-east-1.amazonaws.com/dev/data/' + this.state.code, true);
    xhttp.send();
  }

  putData(event) {
    const self = this;

    event.preventDefault();

    let numAttending = this.state.numAttending;
    if (this.state.attending === false) {
      numAttending = 0;
    }

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        const putResponse = JSON.parse(this.response);

        self.setState({
          putResponse,
        });
      }
    };
    xhttp.open('PUT', 'https://0zf2icy391.execute-api.us-east-1.amazonaws.com/dev/data', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
      code: Number(this.state.code),
      numAttending: Number(numAttending),
      message: this.state.message,
    }));
  }

  renderAttendingDropDown(numAllowed) {
    const options = [
      <option key="none" value="none">-</option>
    ];
    for (let i=0; i<numAllowed; i++) {
      options.push(<option key={i} value={i+1}>{i+1}</option>);
    }
    return options;
  }

  render() {
    if (this.state.validCode) {
      return (
        <form onSubmit={this.putData}>
          <p>Hello {this.state.getResponse.name}</p>
          <p>
            <input type="radio" value="attending" checked={this.state.attending === true} onClick={this.updateAttending}/>Attending
            <input type="radio" value="notAttending" checked={this.state.attending === false} onClick={this.updateAttending} />Not Attending
          </p>
          {this.state.attending && (
            <div>
              How many will be attending?
              <select value={this.state.numAttending} onChange={this.updateNumAttending}>
                {this.renderAttendingDropDown(this.state.getResponse.numAllowed)}
              </select>
            </div>
          )}
          <textarea value={this.state.message} onChange={this.updateMessage} />
          <input type="submit" value="Submit" />
        </form>
      )
    } else {
      return (
        <form onSubmit={this.getData}>
          <p>enter your code: <input type="text" value={this.state.code} onChange={this.updateCode} autoFocus="true" /></p>
          <input type="submit" name="Submit"/>
        </form>
      );
    }
  }
}

export default Form;
