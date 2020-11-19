import Month from "./month";
import Time from "./time";
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import CalendarContainer from "./calendar_container";
import {
  newDate,
  setMonth,
  getMonth,
  add,
  getStartOfWeek,
  getStartOfToday,
  setYear,
  getYear,
  isBefore,
  isAfter,
  getFormattedWeekdayInLocale,
  getWeekdayShortInLocale,
  getWeekdayMinInLocale,
  isSameDay,
  monthDisabledBefore,
  monthDisabledAfter,
  yearDisabledBefore,
  yearDisabledAfter,
  getEffectiveMinDate,
  getEffectiveMaxDate,
} from "./date_utils";

export default class Calendar extends React.Component {
  static get defaultProps() {
    return {
      monthsShown: 1,
      monthSelectedIn: 0,
      timeCaption: "Time",
    };
  }

  static propTypes = {
    arrowProps: PropTypes.object,
    chooseDayAriaLabelPrefix: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    container: PropTypes.func,
    dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
      .isRequired,
    disabledDayAriaLabelPrefix: PropTypes.string,
    endDate: PropTypes.instanceOf(Date),
    filterDate: PropTypes.func,
    formatWeekNumber: PropTypes.func,
    highlightDates: PropTypes.instanceOf(Map),
    injectTimes: PropTypes.array,
    inline: PropTypes.bool,
    locale: PropTypes.shape({ locale: PropTypes.object }),
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    monthsShown: PropTypes.number,
    monthSelectedIn: PropTypes.number,
    onClickOutside: PropTypes.func.isRequired,
    onMonthChange: PropTypes.func,
    onYearChange: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    onWeekSelect: PropTypes.func,
    showTimeSelect: PropTypes.bool,
    showFullMonthYearPicker: PropTypes.bool,
    showTimeSelectOnly: PropTypes.bool,
    timeFormat: PropTypes.string,
    timeIntervals: PropTypes.number,
    onTimeChange: PropTypes.func,
    minTime: PropTypes.instanceOf(Date),
    maxTime: PropTypes.instanceOf(Date),
    filterTime: PropTypes.func,
    timeCaption: PropTypes.string,
    openToDate: PropTypes.instanceOf(Date),
    peekNextMonth: PropTypes.bool,
    previousYearAriaLabel: PropTypes.string,
    preSelection: PropTypes.instanceOf(Date),
    selected: PropTypes.instanceOf(Date),
    selectsRange: PropTypes.bool,
    showPreviousMonths: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    startDate: PropTypes.instanceOf(Date),
    useWeekdaysShort: PropTypes.bool,
    formatWeekDay: PropTypes.func,
    weekLabel: PropTypes.string,
    renderCustomHeader: PropTypes.func,
    renderDayContents: PropTypes.func,
    onDayMouseEnter: PropTypes.func,
    onMonthMouseLeave: PropTypes.func,
    handleOnKeyDown: PropTypes.func,
    isInputFocused: PropTypes.bool,
    weekAriaLabelPrefix: PropTypes.string,
    setPreSelection: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.containerRef = React.createRef();

    this.state = {
      date: this.getDateInView(),
      selectingDate: null,
      monthContainer: null,
    };
  }

  componentDidMount() {
    // monthContainer height is needed in time component
    // to determine the height for the ul in the time component
    // setState here so height is given after final component
    // layout is rendered
    if (this.props.showTimeSelect) {
      this.assignMonthContainer = (() => {
        this.setState({ monthContainer: this.monthContainer });
      })();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.preSelection &&
      !isSameDay(this.props.preSelection, prevProps.preSelection)
    ) {
      this.setState({
        date: this.props.preSelection,
      });
    } else if (
      this.props.openToDate &&
      !isSameDay(this.props.openToDate, prevProps.openToDate)
    ) {
      this.setState({
        date: this.props.openToDate,
      });
    }
  }

  handleClickOutside = (event) => {
    this.props.onClickOutside(event);
  };

  setClickOutsideRef = () => {
    return this.containerRef.current;
  };

  getDateInView = () => {
    const { preSelection, selected, openToDate } = this.props;
    const minDate = getEffectiveMinDate(this.props);
    const maxDate = getEffectiveMaxDate(this.props);
    const current = newDate();
    const initialDate = openToDate || selected || preSelection;
    if (initialDate) {
      return initialDate;
    } else {
      if (minDate && isBefore(current, minDate)) {
        return minDate;
      } else if (maxDate && isAfter(current, maxDate)) {
        return maxDate;
      }
    }
    return current;
  };

  increaseMonth = () => {
    this.setState(
      ({ date }) => ({
        date: add(date, { months: 1 }),
      }),
      () => this.handleMonthChange(this.state.date)
    );
  };

  decreaseMonth = () => {
    this.setState(
      ({ date }) => ({
        date: add(date, { months: -1 }),
      }),
      () => this.handleMonthChange(this.state.date)
    );
  };

  handleDayClick = (day, event, monthSelectedIn) => {
    this.props.onSelect(day, event, monthSelectedIn);
    this.props.setPreSelection && this.props.setPreSelection(day);
  };

  handleDayMouseEnter = (day) => {
    this.setState({ selectingDate: day });
    this.props.onDayMouseEnter && this.props.onDayMouseEnter(day);
  };

  handleMonthMouseLeave = () => {
    this.setState({ selectingDate: null });
    this.props.onMonthMouseLeave && this.props.onMonthMouseLeave();
  };

  handleYearChange = (date) => {
    if (this.props.onYearChange) {
      this.props.onYearChange(date);
    }
    if (this.props.onSelect) {
      this.props.onSelect(date);
    }

    this.props.setPreSelection && this.props.setPreSelection(date);
  };

  handleMonthChange = (date) => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(date);
    }
    if (this.props.onSelect) {
      this.props.onSelect(date);
    }

    this.props.setPreSelection && this.props.setPreSelection(date);
  };

  handleMonthYearChange = (date) => {
    this.handleYearChange(date);
    this.handleMonthChange(date);
  };

  changeYear = (year) => {
    this.setState(
      ({ date }) => ({
        date: setYear(date, year),
      }),
      () => this.handleYearChange(this.state.date)
    );
  };

  changeMonth = (month) => {
    this.setState(
      ({ date }) => ({
        date: setMonth(date, month),
      }),
      () => this.handleMonthChange(this.state.date)
    );
  };

  changeMonthYear = (monthYear) => {
    this.setState(
      ({ date }) => ({
        date: setYear(setMonth(date, getMonth(monthYear)), getYear(monthYear)),
      }),
      () => this.handleMonthYearChange(this.state.date)
    );
  };

  header = (date = this.state.date) => {
    const startOfWeek = getStartOfWeek(date, this.props.locale);
    const dayNames = [];
    if (this.props.showWeekNumbers) {
      dayNames.push(
        <div key="W" className="react-datepicker__day-name">
          {this.props.weekLabel || "#"}
        </div>
      );
    }
    return dayNames.concat(
      [0, 1, 2, 3, 4, 5, 6].map((offset) => {
        const day = add(startOfWeek, { days: offset });
        const weekDayName = this.formatWeekday(day, this.props.locale);

        return (
          <div key={offset} className="react-datepicker__day-name">
            {weekDayName}
          </div>
        );
      })
    );
  };

  formatWeekday = (day, locale) => {
    if (this.props.formatWeekDay) {
      return getFormattedWeekdayInLocale(day, this.props.formatWeekDay, locale);
    }
    return this.props.useWeekdaysShort
      ? getWeekdayShortInLocale(day, locale)
      : getWeekdayMinInLocale(day, locale);
  };

  decreaseYear = () => {
    this.setState(
      ({ date }) => ({
        date: add(date, { years: -1 }),
      }),
      () => this.handleYearChange(this.state.date)
    );
  };

  increaseYear = () => {
    this.setState(
      ({ date }) => ({
        date: add(date, { years: 1 }),
      }),
      () => this.handleYearChange(this.state.date)
    );
  };

  renderCustomHeader = (headerArgs = {}) => {
    const { monthDate, i } = headerArgs;

    if (i !== 0 && i !== undefined) {
      return null;
    }

    const prevMonthButtonDisabled = monthDisabledBefore(
      this.state.date,
      this.props
    );

    const nextMonthButtonDisabled = monthDisabledAfter(
      this.state.date,
      this.props
    );

    const prevYearButtonDisabled = yearDisabledBefore(
      this.state.date,
      this.props
    );

    const nextYearButtonDisabled = yearDisabledAfter(
      this.state.date,
      this.props
    );

    return (
      <div
        className={`react-datepicker__header react-datepicker__header--custom ${
          this.props.showTimeSelect
            ? "react-datepicker__header--has-time-select"
            : ""
        }`}
      >
        {this.props.renderCustomHeader &&
          this.props.renderCustomHeader({
            ...this.state,
            changeMonth: this.changeMonth,
            changeYear: this.changeYear,
            decreaseMonth: this.decreaseMonth,
            increaseMonth: this.increaseMonth,
            decreaseYear: this.decreaseYear,
            increaseYear: this.increaseYear,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
            prevYearButtonDisabled,
            nextYearButtonDisabled,
          })}
        <div className="react-datepicker__day-names">
          {this.header(monthDate)}
        </div>
      </div>
    );
  };

  renderHeader = (headerArgs) => {
    return this.renderCustomHeader(headerArgs);
  };

  renderMonths = () => {
    if (this.props.showTimeSelectOnly) {
      return;
    }

    var monthList = [];
    var monthsToSubtract = this.props.showPreviousMonths
      ? this.props.monthsShown - 1
      : 0;
    var fromMonthDate = add(this.state.date, { months: monthsToSubtract * -1 });
    for (var i = 0; i < this.props.monthsShown; ++i) {
      var monthsToAdd = i - this.props.monthSelectedIn;
      var monthDate = add(fromMonthDate, { months: monthsToAdd });
      var monthKey = `month-${i}`;
      var monthShowsDuplicateDaysEnd = i < this.props.monthsShown - 1;
      var monthShowsDuplicateDaysStart = i > 0;
      monthList.push(
        <div
          key={monthKey}
          ref={(div) => {
            this.monthContainer = div;
          }}
          className="react-datepicker__month-container"
        >
          {this.renderHeader({ monthDate, i })}
          <Month
            chooseDayAriaLabelPrefix={this.props.chooseDayAriaLabelPrefix}
            disabledDayAriaLabelPrefix={this.props.disabledDayAriaLabelPrefix}
            weekAriaLabelPrefix={this.props.weekAriaLabelPrefix}
            onChange={this.changeMonthYear}
            day={monthDate}
            onDayClick={this.handleDayClick}
            handleOnKeyDown={this.props.handleOnKeyDown}
            onDayMouseEnter={this.handleDayMouseEnter}
            onMouseLeave={this.handleMonthMouseLeave}
            onWeekSelect={this.props.onWeekSelect}
            orderInDisplay={i}
            formatWeekNumber={this.props.formatWeekNumber}
            locale={this.props.locale}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            highlightDates={this.props.highlightDates}
            selectingDate={this.state.selectingDate}
            inline={this.props.inline}
            filterDate={this.props.filterDate}
            preSelection={this.props.preSelection}
            setPreSelection={this.props.setPreSelection}
            selected={this.props.selected}
            selectsRange={this.props.selectsRange}
            showWeekNumbers={this.props.showWeekNumbers}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            peekNextMonth={this.props.peekNextMonth}
            renderDayContents={this.props.renderDayContents}
            showFullMonthYearPicker={this.props.showFullMonthYearPicker}
            isInputFocused={this.props.isInputFocused}
            containerRef={this.containerRef}
            monthShowsDuplicateDaysEnd={monthShowsDuplicateDaysEnd}
            monthShowsDuplicateDaysStart={monthShowsDuplicateDaysStart}
          />
        </div>
      );
    }
    return monthList;
  };

  renderYears = () => {
    if (this.props.showTimeSelectOnly) {
      return;
    }
  };

  renderTimeSection = () => {
    if (
      this.props.showTimeSelect &&
      (this.state.monthContainer || this.props.showTimeSelectOnly)
    ) {
      return (
        <Time
          selected={this.props.selected}
          openToDate={this.props.openToDate}
          onChange={this.props.onTimeChange}
          format={this.props.timeFormat}
          intervals={this.props.timeIntervals}
          minTime={this.props.minTime}
          maxTime={this.props.maxTime}
          filterTime={this.props.filterTime}
          timeCaption={this.props.timeCaption}
          monthRef={this.state.monthContainer}
          injectTimes={this.props.injectTimes}
          locale={this.props.locale}
          showTimeSelectOnly={this.props.showTimeSelectOnly}
        />
      );
    }
  };

  render() {
    const Container = CalendarContainer;
    return (
      <div ref={this.containerRef}>
        <Container
          className={classnames("react-datepicker", this.props.className, {
            "react-datepicker--time-only": this.props.showTimeSelectOnly,
          })}
          arrowProps={this.props.arrowProps}
        >
          {this.renderMonths()}
          {this.renderYears()}
          {this.renderTimeSection()}
          {this.props.children}
        </Container>
      </div>
    );
  }
}
