import React, { Component } from "react";
import DatePicker from "react-d8picker";

import "react-d8picker/dist/react-d8picker.css";

class App extends Component {
  state = {
    startDate: new Date(),
  };

  render() {
    const { startDate } = this.state;
    return <DatePicker selected={startDate} onChange={this.handleChange} />;
  }

  handleChange = (startDate) => {
    this.setState({
      startDate,
    });
  };
}

export default App;
