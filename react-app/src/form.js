import React from 'react';

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      code: '',
      getResponse: '',
      putResponse: '',
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
        <div className="fullwidth rsvpbg">
          <div className="grid-container fadeInUp">
            <section id="rsvp-form">
              <div className="grid-x grid-padding-x">
                <div className="large-8 small-12 large-offset-2 cell">
                  <div className="form-wrap">
                    <h1 className="text-center">Hi, <span className="name">{this.state.getResponse.name}</span></h1>
                    <form onSubmit={this.putData}>
                      <div className="response">
                        <div className="radio-button">
                          <input id="radio1" type="radio" value="attending" checked={this.state.attending === true} onClick={this.updateAttending} /><label htmlFor="radio1"><span><span></span></span>Accepts with Pleasure</label>
                        </div>
                        <div className="radio-button">
                          <input id="radio2" type="radio" value="notAttending" checked={this.state.attending === false} onClick={this.updateAttending} /><label htmlFor="radio2"><span><span></span></span>Declines with Regret</label>
                        </div>
                      </div>
                      {this.state.attending && (
                        <div>
                          How many will be attending?
                          <select value={this.state.numAttending} onChange={this.updateNumAttending}>
                            {this.renderAttendingDropDown(this.state.getResponse.numAllowed)}
                          </select>
                        </div>
                      )}
                      <label htmlFor="message">Your Message / Special Request / Cat Fun Fact</label>
                      <textarea id="message" value={this.state.message} onChange={this.updateMessage}></textarea>
                      <div className="button-wrap"><button type="submit" value="Submit">Submit</button></div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      );
    } else {
      return (
        <div className="fullwidth rsvpbg">
          <div className="grid-container">
            <section id="rsvp" className="fadeInUp">
              <div className="grid-x grid-padding-x">
                <div className="large-4 small-12 large-offset-4 cell">
                  <div className="form-wrap">
                    <h1>RSVP</h1>
                    <h4>Please enter the 6-digit code from the back of your invitation.</h4>
                    <form onSubmit={this.getData}>
                      <input type="text" id="code" value={this.state.code} onChange={this.updateCode} />
                      <div className="button-wrap"><button type="submit" value="Submit">Submit</button></div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      );
    }
    // if (this.state.validCode) {
    //   return (
    //     <form onSubmit={this.putData}>
    //       <p>Hello {this.state.getResponse.name}</p>
    //       <p>
    //         <input type="radio" value="attending" checked={this.state.attending === true} onClick={this.updateAttending}/>Attending
    //         <input type="radio" value="notAttending" checked={this.state.attending === false} onClick={this.updateAttending} />Not Attending
    //       </p>
    //       {this.state.attending && (
    //         <div>
    //           How many will be attending?
    //           <select value={this.state.numAttending} onChange={this.updateNumAttending}>
    //             {this.renderAttendingDropDown(this.state.getResponse.numAllowed)}
    //           </select>
    //         </div>
    //       )}
    //       <textarea value={this.state.message} onChange={this.updateMessage} />
    //       <input type="submit" value="Submit" />
    //     </form>
    //   )
    // } else {
    //   return (
    //     <form onSubmit={this.getData}>
    //       <p>enter your code: <input type="text" value={this.state.code} onChange={this.updateCode} autoFocus="true" /></p>
    //       <input type="submit" name="Submit"/>
    //     </form>
    //   );
    // }
  }
}

export default Form;
