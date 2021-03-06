import React from "react";
import PropTypes from "prop-types";
import Day from "./day";
import WeekNumber from "./week_number";
import * as utils from "./date_utils";

export default class Week extends React.Component {
  static propTypes = {
    ariaLabelPrefix: PropTypes.string,
    day: PropTypes.instanceOf(Date).isRequired,
    disabledDayAriaLabelPrefix: PropTypes.string,
    chooseDayAriaLabelPrefix: PropTypes.string,
    endDate: PropTypes.instanceOf(Date),
    filterDate: PropTypes.func,
    formatWeekNumber: PropTypes.func,
    highlightDates: PropTypes.instanceOf(Map),
    inline: PropTypes.bool,
    locale: PropTypes.shape({ locale: PropTypes.object }),
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    month: PropTypes.number,
    onDayClick: PropTypes.func,
    onDayMouseEnter: PropTypes.func,
    onWeekSelect: PropTypes.func,
    preSelection: PropTypes.instanceOf(Date),
    selected: PropTypes.instanceOf(Date),
    selectingDate: PropTypes.instanceOf(Date),
    selectsRange: PropTypes.bool,
    showWeekNumber: PropTypes.bool,
    startDate: PropTypes.instanceOf(Date),
    setOpen: PropTypes.func,
    renderDayContents: PropTypes.func,
    handleOnKeyDown: PropTypes.func,
    isInputFocused: PropTypes.bool,
    containerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
    monthShowsDuplicateDaysEnd: PropTypes.bool,
    monthShowsDuplicateDaysStart: PropTypes.bool,
  };

  handleDayClick = (day, event) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event);
    }
  };

  handleDayMouseEnter = (day) => {
    if (this.props.onDayMouseEnter) {
      this.props.onDayMouseEnter(day);
    }
  };

  handleWeekClick = (day, weekNumber, event) => {
    if (typeof this.props.onWeekSelect === "function") {
      this.props.onWeekSelect(day, weekNumber, event);
    }
    if (this.props.setOpen) {
      this.props.setOpen(false);
    }
  };

  formatWeekNumber = (date) => {
    if (this.props.formatWeekNumber) {
      return this.props.formatWeekNumber(date);
    }
    return utils.getWeek(date, this.props.locale);
  };

  renderDays = () => {
    const startOfWeek = utils.getStartOfWeek(this.props.day, this.props.locale);
    const days = [];
    const weekNumber = this.formatWeekNumber(startOfWeek);
    if (this.props.showWeekNumber) {
      const onClickAction = this.props.onWeekSelect
        ? this.handleWeekClick.bind(this, startOfWeek, weekNumber)
        : undefined;
      days.push(
        <WeekNumber
          key="W"
          weekNumber={weekNumber}
          onClick={onClickAction}
          ariaLabelPrefix={this.props.ariaLabelPrefix}
        />
      );
    }
    return days.concat(
      [0, 1, 2, 3, 4, 5, 6].map((offset) => {
        const day = utils.add(startOfWeek, { days: offset });
        return (
          <Day
            ariaLabelPrefixWhenEnabled={this.props.chooseDayAriaLabelPrefix}
            ariaLabelPrefixWhenDisabled={this.props.disabledDayAriaLabelPrefix}
            key={day.valueOf()}
            day={day}
            month={this.props.month}
            onClick={this.handleDayClick.bind(this, day)}
            onMouseEnter={this.handleDayMouseEnter.bind(this, day)}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            highlightDates={this.props.highlightDates}
            selectingDate={this.props.selectingDate}
            filterDate={this.props.filterDate}
            preSelection={this.props.preSelection}
            selected={this.props.selected}
            selectsRange={this.props.selectsRange}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            renderDayContents={this.props.renderDayContents}
            handleOnKeyDown={this.props.handleOnKeyDown}
            isInputFocused={this.props.isInputFocused}
            containerRef={this.props.containerRef}
            inline={this.props.inline}
            monthShowsDuplicateDaysEnd={this.props.monthShowsDuplicateDaysEnd}
            monthShowsDuplicateDaysStart={
              this.props.monthShowsDuplicateDaysStart
            }
          />
        );
      })
    );
  };

  render() {
    return <div className="react-datepicker__week">{this.renderDays()}</div>;
  }
}
