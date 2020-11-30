import * as React from "react";
import {
  add,
  formatDate,
  getHours,
  getMinutes,
  getStartOfDay,
  isBefore,
  isEqual,
  isTimeDisabled,
  isTimeInDisabledRange,
  newDate,
  setHours,
  setMinutes,
  timesToInjectAfter,
} from "./date_utils";

interface Props {
  format?: string;
  intervals?: number;
  timeCaption?: string;
  selected?: Date;
  openToDate?: Date;
  onChange?: (time: Date) => void;
  minTime?: Date;
  maxTime?: Date;
  filterTime?: () => void;
  monthRef?: HTMLDivElement;
  injectTimes?: any[];
  locale?: { locale: any };
  showTimeSelectOnly?: boolean;
}

interface State {
  height: number | null;
}

export default class Time extends React.Component<Props, State> {
  static defaultProps = {
    intervals: 30,
    timeCaption: "Time",
  };

  static calcCenterPosition = (
    listHeight: number,
    centerLiRef: HTMLLIElement
  ) => {
    return (
      centerLiRef.offsetTop - (listHeight / 2 - centerLiRef.clientHeight / 2)
    );
  };

  state = {
    height: null,
  };

  centerLi: HTMLLIElement = null;
  header: HTMLDivElement = null;
  list: HTMLUListElement = null;

  componentDidMount() {
    // code to ensure selected time will always be in focus within time window when it first appears
    this.list.scrollTop = Time.calcCenterPosition(
      this.props.monthRef
        ? this.props.monthRef.clientHeight - this.header.clientHeight
        : this.list.clientHeight,
      this.centerLi
    );

    if (this.props.monthRef && this.header) {
      this.setState({
        height: this.props.monthRef.clientHeight - this.header.clientHeight,
      });
    }
  }

  handleClick = (time) => {
    if (
      ((this.props.minTime || this.props.maxTime) &&
        isTimeInDisabledRange(time, {
          minTime: this.props.minTime,
          maxTime: this.props.maxTime,
        })) ||
      (this.props.filterTime &&
        isTimeDisabled(time, { filterTime: this.props.filterTime }))
    ) {
      return;
    }

    this.props.onChange(time);
  };

  liClasses = (time, currH, currM) => {
    let classes = ["react-datepicker__time-list-item"];

    if (
      this.props.selected &&
      currH === getHours(time) &&
      currM === getMinutes(time)
    ) {
      classes.push("react-datepicker__time-list-item--selected");
    }

    if (
      ((this.props.minTime || this.props.maxTime) &&
        isTimeInDisabledRange(time, {
          minTime: this.props.minTime,
          maxTime: this.props.maxTime,
        })) ||
      (this.props.filterTime &&
        isTimeDisabled(time, { filterTime: this.props.filterTime }))
    ) {
      classes.push("react-datepicker__time-list-item--disabled");
    }

    if (
      this.props.injectTimes &&
      (getHours(time) * 60 + getMinutes(time)) % this.props.intervals !== 0
    ) {
      classes.push("react-datepicker__time-list-item--injected");
    }

    return classes.join(" ");
  };

  renderTimes = () => {
    let times = [];
    const format = this.props.format ? this.props.format : "p";
    const intervals = this.props.intervals;

    const base = getStartOfDay(newDate(this.props.selected));
    const multiplier = 1440 / intervals;
    const sortedInjectTimes =
      this.props.injectTimes &&
      this.props.injectTimes.sort(function (a, b) {
        return a - b;
      });

    const activeDate =
      this.props.selected || this.props.openToDate || newDate();
    const currH = getHours(activeDate);
    const currM = getMinutes(activeDate);
    const activeTime = setHours(setMinutes(base, currM), currH);

    for (let i = 0; i < multiplier; i++) {
      const currentTime = add(base, { minutes: i * intervals });
      times.push(currentTime);

      if (sortedInjectTimes) {
        const timesToInject = timesToInjectAfter(
          base,
          currentTime,
          i,
          intervals,
          sortedInjectTimes
        );
        times = times.concat(timesToInject);
      }
    }

    return times.map((time, i) => (
      <li
        key={i}
        onClick={this.handleClick.bind(this, time)}
        className={this.liClasses(time, currH, currM)}
        ref={(li) => {
          if (isBefore(time, activeTime) || isEqual(time, activeTime)) {
            this.centerLi = li;
          }
        }}
      >
        {formatDate(time, format, this.props.locale)}
      </li>
    ));
  };

  render() {
    const { height } = this.state;

    return (
      <div className="react-datepicker__time-container">
        <div
          className={`react-datepicker__header react-datepicker__header--time ${
            this.props.showTimeSelectOnly
              ? "react-datepicker__header--time--only"
              : ""
          }`}
          ref={(header) => {
            this.header = header;
          }}
        >
          <div className="react-datepicker-time__header">
            {this.props.timeCaption}
          </div>
        </div>
        <div className="react-datepicker__time">
          <div className="react-datepicker__time-box">
            <ul
              className="react-datepicker__time-list"
              ref={(list) => {
                this.list = list;
              }}
              style={height ? { height } : {}}
            >
              {this.renderTimes()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
