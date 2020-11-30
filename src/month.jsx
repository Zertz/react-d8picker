import React from "react";
import PropTypes from "prop-types";
import Week from "./week";
import * as utils from "./date_utils";

export default class Month extends React.Component {
  static propTypes = {
    ariaLabelPrefix: PropTypes.string,
    chooseDayAriaLabelPrefix: PropTypes.string,
    disabledDayAriaLabelPrefix: PropTypes.string,
    day: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date),
    orderInDisplay: PropTypes.number,
    filterDate: PropTypes.func,
    formatWeekNumber: PropTypes.func,
    highlightDates: PropTypes.instanceOf(Map),
    inline: PropTypes.bool,
    locale: PropTypes.shape({ locale: PropTypes.object }),
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    onDayClick: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onWeekSelect: PropTypes.func,
    peekNextMonth: PropTypes.bool,
    preSelection: PropTypes.instanceOf(Date),
    setPreSelection: PropTypes.func,
    selected: PropTypes.instanceOf(Date),
    selectingDate: PropTypes.instanceOf(Date),
    selectsRange: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    startDate: PropTypes.instanceOf(Date),
    renderDay: PropTypes.func,
    showFullMonthYearPicker: PropTypes.bool,
    handleOnKeyDown: PropTypes.func,
    isInputFocused: PropTypes.bool,
    weekAriaLabelPrefix: PropTypes.string,
    containerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
    monthShowsDuplicateDaysEnd: PropTypes.bool,
    monthShowsDuplicateDaysStart: PropTypes.bool,
  };

  MONTH_REFS = Array(12)
    .fill()
    .map(() => React.createRef());

  handleDayClick = (day, event) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event, this.props.orderInDisplay);
    }
  };

  handleMouseLeave = () => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave();
    }
  };

  isWeekInMonth = (startOfWeek) => {
    const day = this.props.day;
    const endOfWeek = utils.add(startOfWeek, { days: 6 });
    return (
      utils.isSameMonth(startOfWeek, day) || utils.isSameMonth(endOfWeek, day)
    );
  };

  renderWeeks = () => {
    const weeks = [];
    let currentWeekStart = utils.getStartOfWeek(
      utils.getStartOfMonth(this.props.day),
      this.props.locale
    );
    let i = 0;
    let breakAfterNextPush = false;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      weeks.push(
        <Week
          ariaLabelPrefix={this.props.weekAriaLabelPrefix}
          chooseDayAriaLabelPrefix={this.props.chooseDayAriaLabelPrefix}
          disabledDayAriaLabelPrefix={this.props.disabledDayAriaLabelPrefix}
          key={i}
          day={currentWeekStart}
          month={utils.getMonth(this.props.day)}
          onDayClick={this.handleDayClick}
          onWeekSelect={this.props.onWeekSelect}
          formatWeekNumber={this.props.formatWeekNumber}
          locale={this.props.locale}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          inline={this.props.inline}
          highlightDates={this.props.highlightDates}
          selectingDate={this.props.selectingDate}
          filterDate={this.props.filterDate}
          preSelection={this.props.preSelection}
          selected={this.props.selected}
          selectsRange={this.props.selectsRange}
          showWeekNumber={this.props.showWeekNumbers}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          renderDay={this.props.renderDay}
          handleOnKeyDown={this.props.handleOnKeyDown}
          isInputFocused={this.props.isInputFocused}
          containerRef={this.props.containerRef}
          monthShowsDuplicateDaysEnd={this.props.monthShowsDuplicateDaysEnd}
          monthShowsDuplicateDaysStart={this.props.monthShowsDuplicateDaysStart}
        />
      );

      if (breakAfterNextPush) break;

      i++;
      currentWeekStart = utils.add(currentWeekStart, { weeks: 1 });

      // If one of these conditions is true, we will either break on this week
      // or break on the next week
      const isNonFixedAndOutOfMonth = !this.isWeekInMonth(currentWeekStart);

      if (isNonFixedAndOutOfMonth) {
        if (this.props.peekNextMonth) {
          breakAfterNextPush = true;
        } else {
          break;
        }
      }
    }

    return weeks;
  };

  getClassNames = () => {
    return "react-datepicker__month";
  };

  render() {
    const { day, ariaLabelPrefix = "month " } = this.props;
    return (
      <div
        className={this.getClassNames()}
        onMouseLeave={this.handleMouseLeave}
        aria-label={`${ariaLabelPrefix} ${utils.formatDate(day, "yyyy-MM")}`}
      >
        {this.renderWeeks()}
      </div>
    );
  }
}
