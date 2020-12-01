import * as React from "react";

interface Props {
  onChange?: (time: Date) => void;
  timeString?: string;
}

interface State {
  time: string;
}

export default class inputTime extends React.Component<Props, State> {
  state = {
    time: this.props.timeString,
  };

  onTimeChange = (time: string) => {
    this.setState({ time });

    const date = new Date();

    date.setHours(Number(time.split(":")[0]));
    date.setMinutes(Number(time.split(":")[1]));

    this.props.onChange(date);
  };

  renderTimeInput = () => {
    const { time } = this.state;
    const { timeString } = this.props;

    return (
      <input
        type="time"
        className="react-datepicker-time__input"
        placeholder="Time"
        name="time-input"
        required
        value={time}
        onChange={(ev) => {
          this.onTimeChange(ev.target.value || timeString);
        }}
      />
    );
  };

  render() {
    return (
      <div className="react-datepicker__input-time-container">
        <div className="react-datepicker-time__input-container">
          <div className="react-datepicker-time__input">
            {this.renderTimeInput()}
          </div>
        </div>
      </div>
    );
  }
}
