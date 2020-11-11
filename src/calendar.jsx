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
  addMonths,
  subMonths,
  getStartOfWeek,
  getStartOfToday,
  addDays,
  formatDate,
  setYear,
  getYear,
  isBefore,
  addYears,
  subYears,
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
      previousMonthButtonLabel: "Previous Month",
      nextMonthButtonLabel: "Next Month",
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
    dayClassName: PropTypes.func,
    weekDayClassName: PropTypes.func,
    disabledDayAriaLabelPrefix: PropTypes.string,
    monthClassName: PropTypes.func,
    timeClassName: PropTypes.func,
    endDate: PropTypes.instanceOf(Date),
    excludeDates: PropTypes.array,
    filterDate: PropTypes.func,
    formatWeekNumber: PropTypes.func,
    highlightDates: PropTypes.instanceOf(Map),
    includeDates: PropTypes.array,
    includeTimes: PropTypes.array,
    injectTimes: PropTypes.array,
    inline: PropTypes.bool,
    locale: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ locale: PropTypes.object }),
    ]),
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    monthsShown: PropTypes.number,
    monthSelectedIn: PropTypes.number,
    nextMonthAriaLabel: PropTypes.string,
    nextYearAriaLabel: PropTypes.string,
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
    excludeTimes: PropTypes.array,
    filterTime: PropTypes.func,
    timeCaption: PropTypes.string,
    openToDate: PropTypes.instanceOf(Date),
    peekNextMonth: PropTypes.bool,
    previousMonthAriaLabel: PropTypes.string,
    previousYearAriaLabel: PropTypes.string,
    preSelection: PropTypes.instanceOf(Date),
    selected: PropTypes.instanceOf(Date),
    selectsRange: PropTypes.bool,
    showPreviousMonths: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    startDate: PropTypes.instanceOf(Date),
    todayButton: PropTypes.string,
    useWeekdaysShort: PropTypes.bool,
    formatWeekDay: PropTypes.func,
    weekLabel: PropTypes.string,
    previousMonthButtonLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    nextMonthButtonLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
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
        date: addMonths(date, 1),
      }),
      () => this.handleMonthChange(this.state.date)
    );
  };

  decreaseMonth = () => {
    this.setState(
      ({ date }) => ({
        date: subMonths(date, 1),
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

    this.props.setPreSelection && this.props.setPreSelection(date);
  };

  handleMonthChange = (date) => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(date);
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
        const day = addDays(startOfWeek, offset);
        const weekDayName = this.formatWeekday(day, this.props.locale);

        const weekDayClassName = this.props.weekDayClassName
          ? this.props.weekDayClassName(day)
          : undefined;

        return (
          <div
            key={offset}
            className={classnames(
              "react-datepicker__day-name",
              weekDayClassName
            )}
          >
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
        date: subYears(date, 1),
      }),
      () => this.handleYearChange(this.state.date)
    );
  };

  renderPreviousButton = () => {
    if (this.props.renderCustomHeader) {
      return;
    }

    let allPrevDaysDisabled;
    switch (true) {
      default:
        allPrevDaysDisabled = monthDisabledBefore(this.state.date, this.props);
        break;
    }

    if (this.props.showTimeSelectOnly) {
      return;
    }

    const classes = [
      "react-datepicker__navigation",
      "react-datepicker__navigation--previous",
    ];

    let clickHandler = this.decreaseMonth;

    if (allPrevDaysDisabled) {
      classes.push("react-datepicker__navigation--previous--disabled");
      clickHandler = null;
    }

    const { previousMonthAriaLabel = "Previous Month" } = this.props;

    return (
      <button
        type="button"
        className={classes.join(" ")}
        onClick={clickHandler}
        aria-label={previousMonthAriaLabel}
      >
        {this.props.previousMonthButtonLabel}
      </button>
    );
  };

  increaseYear = () => {
    this.setState(
      ({ date }) => ({
        date: addYears(date, 1),
      }),
      () => this.handleYearChange(this.state.date)
    );
  };

  renderNextButton = () => {
    if (this.props.renderCustomHeader) {
      return;
    }

    let allNextDaysDisabled;
    switch (true) {
      default:
        allNextDaysDisabled = monthDisabledAfter(this.state.date, this.props);
        break;
    }

    if (this.props.showTimeSelectOnly) {
      return;
    }

    const classes = [
      "react-datepicker__navigation",
      "react-datepicker__navigation--next",
    ];
    if (this.props.showTimeSelect) {
      classes.push("react-datepicker__navigation--next--with-time");
    }
    if (this.props.todayButton) {
      classes.push("react-datepicker__navigation--next--with-today-button");
    }

    let clickHandler = this.increaseMonth;

    if (allNextDaysDisabled) {
      classes.push("react-datepicker__navigation--next--disabled");
      clickHandler = null;
    }

    const { nextMonthAriaLabel = "Next Month" } = this.props;

    return (
      <button
        type="button"
        className={classes.join(" ")}
        onClick={clickHandler}
        aria-label={nextMonthAriaLabel}
      >
        {this.props.nextMonthButtonLabel}
      </button>
    );
  };

  renderCurrentMonth = (date = this.state.date) => {
    const classes = ["react-datepicker__current-month"];

    return (
      <div className={classes.join(" ")}>
        {formatDate(date, this.props.dateFormat, this.props.locale)}
      </div>
    );
  };

  renderTodayButton = () => {
    if (!this.props.todayButton || this.props.showTimeSelectOnly) {
      return;
    }
    return (
      <div
        className="react-datepicker__today-button"
        onClick={(e) => this.props.onSelect(getStartOfToday(), e)}
      >
        {this.props.todayButton}
      </div>
    );
  };

  renderDefaultHeader = ({ monthDate }) => (
    <div
      className={`react-datepicker__header ${
        this.props.showTimeSelect
          ? "react-datepicker__header--has-time-select"
          : ""
      }`}
    >
      {this.renderCurrentMonth(monthDate)}
      <div className="react-datepicker__day-names">
        {this.header(monthDate)}
      </div>
    </div>
  );

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
      <div className="react-datepicker__header react-datepicker__header--custom">
        {this.props.renderCustomHeader({
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

  renderYearHeader = () => {
    const { date } = this.state;
    return (
      <div className="react-datepicker__header react-datepicker-year-header">
        {getYear(date)}
      </div>
    );
  };

  renderHeader = (headerArgs) => {
    switch (true) {
      case this.props.renderCustomHeader !== undefined && headerArgs.i === 0:
        return this.renderCustomHeader(headerArgs);
      default:
        return this.renderDefaultHeader(headerArgs);
    }
  };

  renderMonths = () => {
    if (this.props.showTimeSelectOnly) {
      return;
    }

    var monthList = [];
    var monthsToSubtract = this.props.showPreviousMonths
      ? this.props.monthsShown - 1
      : 0;
    var fromMonthDate = subMonths(this.state.date, monthsToSubtract);
    for (var i = 0; i < this.props.monthsShown; ++i) {
      var monthsToAdd = i - this.props.monthSelectedIn;
      var monthDate = addMonths(fromMonthDate, monthsToAdd);
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
            dayClassName={this.props.dayClassName}
            monthClassName={this.props.monthClassName}
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
            excludeDates={this.props.excludeDates}
            highlightDates={this.props.highlightDates}
            selectingDate={this.state.selectingDate}
            includeDates={this.props.includeDates}
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
          timeClassName={this.props.timeClassName}
          format={this.props.timeFormat}
          includeTimes={this.props.includeTimes}
          intervals={this.props.timeIntervals}
          minTime={this.props.minTime}
          maxTime={this.props.maxTime}
          excludeTimes={this.props.excludeTimes}
          filterTime={this.props.filterTime}
          timeCaption={this.props.timeCaption}
          todayButton={this.props.todayButton}
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
          {this.renderPreviousButton()}
          {this.renderNextButton()}
          {this.renderMonths()}
          {this.renderYears()}
          {this.renderTodayButton()}
          {this.renderTimeSection()}
          {this.props.children}
        </Container>
      </div>
    );
  }
}
