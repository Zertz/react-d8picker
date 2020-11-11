import React from "react";
import PropTypes from "prop-types";
import Calendar from "./calendar";
import PopperComponent, { popperPlacementPositions } from "./popper_component";
import classnames from "classnames";
import {
  newDate,
  isDate,
  isBefore,
  isAfter,
  isEqual,
  setTime,
  getSeconds,
  getMinutes,
  getHours,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears,
  isDayDisabled,
  isDayInRange,
  getEffectiveMinDate,
  getEffectiveMaxDate,
  parseDate,
  safeDateFormat,
  getHightLightDaysMap,
  getYear,
  getMonth,
  registerLocale,
  setDefaultLocale,
  getDefaultLocale,
} from "./date_utils";
import onClickOutside from "react-onclickoutside";

export { default as CalendarContainer } from "./calendar_container";

export { registerLocale, setDefaultLocale, getDefaultLocale };

const outsideClickIgnoreClass = "react-datepicker-ignore-onclickoutside";
const WrappedCalendar = onClickOutside(Calendar);

// Compares dates year+month combinations
function hasPreSelectionChanged(date1, date2) {
  if (date1 && date2) {
    return (
      getMonth(date1) !== getMonth(date2) || getYear(date1) !== getYear(date2)
    );
  }

  return date1 !== date2;
}

/**
 * General datepicker component.
 */
const INPUT_ERR_1 = "Date input not valid.";

export default class DatePicker extends React.Component {
  static get defaultProps() {
    return {
      allowSameDay: false,
      dateFormat: "MM/dd/yyyy",
      dateFormatCalendar: "LLLL yyyy",
      onChange() {},
      disabled: false,
      onFocus() {},
      onBlur() {},
      onKeyDown() {},
      onInputClick() {},
      onSelect() {},
      onClickOutside() {},
      onMonthChange() {},
      onYearChange() {},
      onInputError() {},
      monthsShown: 1,
      readOnly: false,
      showTimeSelect: false,
      showPreviousMonths: false,
      showFullMonthYearPicker: false,
      strictParsing: false,
      timeIntervals: 30,
      timeCaption: "Time",
      previousMonthButtonLabel: "Previous Month",
      nextMonthButtonLabel: "Next Month",
      enableTabLoop: true,

      renderDayContents(date) {
        return date;
      },
      focusSelectedMonth: false,
      excludeScrollbar: true,
    };
  }

  static propTypes = {
    allowSameDay: PropTypes.bool,
    ariaLabelClose: PropTypes.string,
    ariaLabelledBy: PropTypes.string,
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    calendarClassName: PropTypes.string,
    children: PropTypes.node,
    chooseDayAriaLabelPrefix: PropTypes.string,
    className: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    dateFormatCalendar: PropTypes.string,
    dayClassName: PropTypes.func,
    weekDayClassName: PropTypes.func,
    disabledDayAriaLabelPrefix: PropTypes.string,
    monthClassName: PropTypes.func,
    timeClassName: PropTypes.func,
    disabled: PropTypes.bool,
    endDate: PropTypes.instanceOf(Date),
    excludeDates: PropTypes.array,
    filterDate: PropTypes.func,
    formatWeekNumber: PropTypes.func,
    highlightDates: PropTypes.array,
    id: PropTypes.string,
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
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    onWeekSelect: PropTypes.func,
    onClickOutside: PropTypes.func,
    onFocus: PropTypes.func,
    onInputClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    onMonthChange: PropTypes.func,
    onYearChange: PropTypes.func,
    onInputError: PropTypes.func,
    open: PropTypes.bool,
    openToDate: PropTypes.instanceOf(Date),
    peekNextMonth: PropTypes.bool,
    placeholderText: PropTypes.string,
    popperContainer: PropTypes.func,
    popperClassName: PropTypes.string, // <PopperComponent/> props
    popperModifiers: PropTypes.object, // <PopperComponent/> props
    popperPlacement: PropTypes.oneOf(popperPlacementPositions), // <PopperComponent/> props
    popperProps: PropTypes.object,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    selected: PropTypes.instanceOf(Date),
    selectsRange: PropTypes.bool,
    showPreviousMonths: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    strictParsing: PropTypes.bool,
    startDate: PropTypes.instanceOf(Date),
    startOpen: PropTypes.bool,
    tabIndex: PropTypes.number,
    timeCaption: PropTypes.string,
    title: PropTypes.string,
    todayButton: PropTypes.node,
    useWeekdaysShort: PropTypes.bool,
    formatWeekDay: PropTypes.func,
    value: PropTypes.string,
    weekLabel: PropTypes.string,
    showFullMonthYearPicker: PropTypes.bool,
    showTimeSelect: PropTypes.bool,
    showTimeSelectOnly: PropTypes.bool,
    timeFormat: PropTypes.string,
    timeIntervals: PropTypes.number,
    minTime: PropTypes.instanceOf(Date),
    maxTime: PropTypes.instanceOf(Date),
    excludeTimes: PropTypes.array,
    filterTime: PropTypes.func,
    clearButtonTitle: PropTypes.string,
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
    wrapperClassName: PropTypes.string,
    focusSelectedMonth: PropTypes.bool,
    onDayMouseEnter: PropTypes.func,
    onMonthMouseLeave: PropTypes.func,
    excludeScrollbar: PropTypes.bool,
    enableTabLoop: PropTypes.bool,
    weekAriaLabelPrefix: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = this.calcInitialState();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.inline &&
      hasPreSelectionChanged(prevProps.selected, this.props.selected)
    ) {
      this.setPreSelection(this.props.selected);
    }
    if (
      this.state.monthSelectedIn !== undefined &&
      prevProps.monthsShown !== this.props.monthsShown
    ) {
      this.setState({ monthSelectedIn: 0 });
    }
    if (prevProps.highlightDates !== this.props.highlightDates) {
      this.setState({
        highlightDates: getHightLightDaysMap(this.props.highlightDates),
      });
    }
    if (
      !prevState.focused &&
      !isEqual(prevProps.selected, this.props.selected)
    ) {
      this.setState({ inputValue: null });
    }
  }

  componentWillUnmount() {
    this.clearPreventFocusTimeout();
  }

  getPreSelection = () => this.props.openToDate || newDate();

  calcInitialState = () => {
    const defaultPreSelection = this.getPreSelection();
    const minDate = getEffectiveMinDate(this.props);
    const maxDate = getEffectiveMaxDate(this.props);
    const boundedPreSelection =
      minDate && isBefore(defaultPreSelection, minDate)
        ? minDate
        : maxDate && isAfter(defaultPreSelection, maxDate)
        ? maxDate
        : defaultPreSelection;
    return {
      open: this.props.startOpen || false,
      preventFocus: false,
      preSelection: this.props.selected
        ? this.props.selected
        : boundedPreSelection,
      // transforming highlighted days (perhaps nested array)
      // to flat Map for faster access in day.jsx
      highlightDates: getHightLightDaysMap(this.props.highlightDates),
      focused: false,
    };
  };

  clearPreventFocusTimeout = () => {
    if (this.preventFocusTimeout) {
      clearTimeout(this.preventFocusTimeout);
    }
  };

  setFocus = () => {
    if (this.input && this.input.focus) {
      this.input.focus({ preventScroll: true });
    }
  };

  setBlur = () => {
    if (this.input && this.input.blur) {
      this.input.blur();
    }

    this.cancelFocusInput();
  };

  setOpen = (open, skipSetBlur = false) => {
    this.setState(
      {
        open: open,
        preSelection:
          open && this.state.open
            ? this.state.preSelection
            : this.calcInitialState().preSelection,
        lastPreSelectChange: PRESELECT_CHANGE_VIA_NAVIGATE,
      },
      () => {
        if (!open) {
          this.setState(
            (prev) => ({
              focused: skipSetBlur ? prev.focused : false,
            }),
            () => {
              !skipSetBlur && this.setBlur();

              this.setState({ inputValue: null });
            }
          );
        }
      }
    );
  };
  inputOk = () => isDate(this.state.preSelection);

  isCalendarOpen = () =>
    this.props.open === undefined
      ? this.state.open && !this.props.disabled && !this.props.readOnly
      : this.props.open;

  handleFocus = (event) => {
    if (!this.state.preventFocus) {
      this.props.onFocus(event);
      if (!this.props.readOnly) {
        this.setOpen(true);
      }
    }
    this.setState({ focused: true });
  };

  cancelFocusInput = () => {
    clearTimeout(this.inputFocusTimeout);
    this.inputFocusTimeout = null;
  };

  deferFocusInput = () => {
    this.cancelFocusInput();
    this.inputFocusTimeout = setTimeout(() => this.setFocus(), 1);
  };

  handleBlur = (event) => {
    if (!this.state.open) {
      this.props.onBlur(event);
    }

    this.setState({ focused: false });
  };

  handleCalendarClickOutside = (event) => {
    if (!this.props.inline) {
      this.setOpen(false);
    }
    this.props.onClickOutside(event);
  };

  handleChange = (...allArgs) => {
    let event = allArgs[0];
    this.setState({
      inputValue: event.target.value,
      lastPreSelectChange: PRESELECT_CHANGE_VIA_INPUT,
    });
    const date = parseDate(
      event.target.value,
      this.props.dateFormat,
      this.props.locale,
      this.props.strictParsing
    );
    if (date || !event.target.value) {
      this.setSelected(date, event, true);
    }
  };

  handleSelect = (date, event, monthSelectedIn) => {
    // Preventing onFocus event to fix issue
    // https://github.com/Hacker0x01/react-datepicker/issues/628
    this.setState({ preventFocus: true }, () => {
      this.preventFocusTimeout = setTimeout(
        () => this.setState({ preventFocus: false }),
        50
      );
      return this.preventFocusTimeout;
    });
    this.setSelected(date, event, false, monthSelectedIn);
    if (this.props.showTimeSelect) {
      this.setPreSelection(date);
    } else if (!this.props.inline && !this.props.selectsRange) {
      this.setOpen(false);
    }
  };

  setSelected = (date, event, keepInput, monthSelectedIn) => {
    let changedDate = date;

    if (changedDate !== null && isDayDisabled(changedDate, this.props)) {
      return;
    }
    const { onChange, selectsRange, startDate, endDate } = this.props;

    if (
      !isEqual(this.props.selected, changedDate) ||
      this.props.allowSameDay ||
      selectsRange
    ) {
      if (changedDate !== null) {
        if (
          this.props.selected &&
          (!keepInput ||
            (!this.props.showTimeSelect && !this.props.showTimeSelectOnly))
        ) {
          changedDate = setTime(changedDate, {
            hour: getHours(this.props.selected),
            minute: getMinutes(this.props.selected),
            second: getSeconds(this.props.selected),
          });
        }
        if (!this.props.inline) {
          this.setState({
            preSelection: changedDate,
          });
        }
        if (!this.props.focusSelectedMonth) {
          this.setState({ monthSelectedIn: monthSelectedIn });
        }
      }
      if (selectsRange) {
        const noRanges = !startDate && !endDate;
        const hasStartRange = startDate && !endDate;
        const isRangeFilled = startDate && endDate;
        if (noRanges) {
          onChange([changedDate, null], event);
        } else if (hasStartRange) {
          if (isBefore(changedDate, startDate)) {
            onChange([changedDate, null], event);
          } else {
            onChange([startDate, changedDate], event);
            this.setOpen(false);
          }
        }
        if (isRangeFilled) {
          onChange([changedDate, null], event);
        }
      } else {
        onChange(changedDate, event);
      }
    }

    if (!keepInput) {
      this.props.onSelect(changedDate, event);
      this.setState({ inputValue: null });
    }
  };

  setPreSelection = (date) => {
    const hasMinDate = typeof this.props.minDate !== "undefined";
    const hasMaxDate = typeof this.props.maxDate !== "undefined";
    let isValidDateSelection = true;
    if (date) {
      if (hasMinDate && hasMaxDate) {
        isValidDateSelection = isDayInRange(
          date,
          this.props.minDate,
          this.props.maxDate
        );
      } else if (hasMinDate) {
        isValidDateSelection = isAfter(date, this.props.minDate);
      } else if (hasMaxDate) {
        isValidDateSelection = isBefore(date, this.props.maxDate);
      }
    }
    if (isValidDateSelection) {
      this.setState({
        preSelection: date,
      });
    }
  };

  handleTimeChange = (time) => {
    const selected = this.props.selected
      ? this.props.selected
      : this.getPreSelection();
    let changedDate = setTime(selected, {
      hour: getHours(time),
      minute: getMinutes(time),
    });

    this.setState({
      preSelection: changedDate,
    });

    this.props.onChange(changedDate);
    this.setOpen(false);
    this.setState({ inputValue: null });
  };

  onInputClick = () => {
    if (!this.props.disabled && !this.props.readOnly) {
      this.setOpen(true);
    }

    this.props.onInputClick();
  };

  onInputKeyDown = (event) => {
    this.props.onKeyDown(event);
    const eventKey = event.key;

    if (!this.state.open && !this.props.inline) {
      if (
        eventKey === "ArrowDown" ||
        eventKey === "ArrowUp" ||
        eventKey === "Enter"
      ) {
        this.onInputClick();
      }
      return;
    }

    // if calendar is open, these keys will focus the selected day
    if (this.state.open) {
      if (eventKey === "ArrowDown" || eventKey === "ArrowUp") {
        event.preventDefault();
        const selectedDay =
          this.calendar.componentNode &&
          this.calendar.componentNode.querySelector(
            '.react-datepicker__day[tabindex="0"]'
          );
        selectedDay && selectedDay.focus({ preventScroll: true });

        return;
      }

      const copy = newDate(this.state.preSelection);
      if (eventKey === "Enter") {
        event.preventDefault();
        if (
          this.inputOk() &&
          this.state.lastPreSelectChange === PRESELECT_CHANGE_VIA_NAVIGATE
        ) {
          this.handleSelect(copy, event);
        } else {
          this.setOpen(false);
        }
      } else if (eventKey === "Escape") {
        event.preventDefault();

        this.setOpen(false);
      }

      if (!this.inputOk()) {
        this.props.onInputError({ code: 1, msg: INPUT_ERR_1 });
      }
    }
  };

  // keyDown events passed down to day.jsx
  onDayKeyDown = (event) => {
    this.props.onKeyDown(event);
    const eventKey = event.key;

    const copy = newDate(this.state.preSelection);
    if (eventKey === "Enter") {
      event.preventDefault();
      this.handleSelect(copy, event);
    } else if (eventKey === "Escape") {
      event.preventDefault();

      this.setOpen(false);
      if (!this.inputOk()) {
        this.props.onInputError({ code: 1, msg: INPUT_ERR_1 });
      }
    } else {
      let newSelection;
      switch (eventKey) {
        case "ArrowLeft":
          newSelection = subDays(copy, 1);
          break;
        case "ArrowRight":
          newSelection = addDays(copy, 1);
          break;
        case "ArrowUp":
          newSelection = subWeeks(copy, 1);
          break;
        case "ArrowDown":
          newSelection = addWeeks(copy, 1);
          break;
        case "PageUp":
          newSelection = subMonths(copy, 1);
          break;
        case "PageDown":
          newSelection = addMonths(copy, 1);
          break;
        case "Home":
          newSelection = subYears(copy, 1);
          break;
        case "End":
          newSelection = addYears(copy, 1);
          break;
      }
      if (!newSelection) {
        if (this.props.onInputError) {
          this.props.onInputError({ code: 1, msg: INPUT_ERR_1 });
        }
        return;
      }
      event.preventDefault();
      this.setState({ lastPreSelectChange: PRESELECT_CHANGE_VIA_NAVIGATE });
      this.setSelected(newSelection);
      this.setPreSelection(newSelection);
    }
  };

  // handle generic key down events in the popper that do not adjust or select dates
  // ex: while focusing prev and next month buttons
  onPopperKeyDown = (event) => {
    const eventKey = event.key;
    if (eventKey === "Escape") {
      // close the popper and refocus the input
      // stop the input from auto opening onFocus
      // close the popper
      // setFocus to the input
      // allow input auto opening onFocus
      event.preventDefault();
      this.setState(
        {
          preventFocus: true,
        },
        () => {
          this.setOpen(false);
          setTimeout(() => {
            this.setFocus();
            this.setState({ preventFocus: false });
          });
        }
      );
    }
  };

  onClearClick = (event) => {
    if (event) {
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
    this.props.onChange(null, event);
    this.setState({ inputValue: null });
  };

  clear = () => {
    this.onClearClick();
  };

  renderCalendar = () => {
    if (!this.props.inline && !this.isCalendarOpen()) {
      return null;
    }
    return (
      <WrappedCalendar
        ref={(elem) => {
          this.calendar = elem;
        }}
        locale={this.props.locale}
        chooseDayAriaLabelPrefix={this.props.chooseDayAriaLabelPrefix}
        disabledDayAriaLabelPrefix={this.props.disabledDayAriaLabelPrefix}
        weekAriaLabelPrefix={this.props.weekAriaLabelPrefix}
        setOpen={this.setOpen}
        dateFormat={this.props.dateFormatCalendar}
        useWeekdaysShort={this.props.useWeekdaysShort}
        formatWeekDay={this.props.formatWeekDay}
        selected={this.props.selected}
        preSelection={this.state.preSelection}
        onSelect={this.handleSelect}
        onWeekSelect={this.props.onWeekSelect}
        openToDate={this.props.openToDate}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        selectsRange={this.props.selectsRange}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        excludeDates={this.props.excludeDates}
        filterDate={this.props.filterDate}
        onClickOutside={this.handleCalendarClickOutside}
        formatWeekNumber={this.props.formatWeekNumber}
        highlightDates={this.state.highlightDates}
        includeDates={this.props.includeDates}
        includeTimes={this.props.includeTimes}
        injectTimes={this.props.injectTimes}
        inline={this.props.inline}
        peekNextMonth={this.props.peekNextMonth}
        showPreviousMonths={this.props.showPreviousMonths}
        showWeekNumbers={this.props.showWeekNumbers}
        todayButton={this.props.todayButton}
        weekLabel={this.props.weekLabel}
        outsideClickIgnoreClass={outsideClickIgnoreClass}
        monthsShown={this.props.monthsShown}
        monthSelectedIn={this.state.monthSelectedIn}
        onMonthChange={this.props.onMonthChange}
        onYearChange={this.props.onYearChange}
        dayClassName={this.props.dayClassName}
        weekDayClassName={this.props.weekDayClassName}
        monthClassName={this.props.monthClassName}
        timeClassName={this.props.timeClassName}
        showTimeSelect={this.props.showTimeSelect}
        showTimeSelectOnly={this.props.showTimeSelectOnly}
        onTimeChange={this.handleTimeChange}
        timeFormat={this.props.timeFormat}
        timeIntervals={this.props.timeIntervals}
        minTime={this.props.minTime}
        maxTime={this.props.maxTime}
        excludeTimes={this.props.excludeTimes}
        filterTime={this.props.filterTime}
        timeCaption={this.props.timeCaption}
        className={this.props.calendarClassName}
        previousMonthButtonLabel={this.props.previousMonthButtonLabel}
        nextMonthButtonLabel={this.props.nextMonthButtonLabel}
        renderCustomHeader={this.props.renderCustomHeader}
        popperProps={this.props.popperProps}
        renderDayContents={this.props.renderDayContents}
        onDayMouseEnter={this.props.onDayMouseEnter}
        onMonthMouseLeave={this.props.onMonthMouseLeave}
        showFullMonthYearPicker={this.props.showFullMonthYearPicker}
        excludeScrollbar={this.props.excludeScrollbar}
        handleOnKeyDown={this.onDayKeyDown}
        isInputFocused={this.state.focused}
        setPreSelection={this.setPreSelection}
      >
        {this.props.children}
      </WrappedCalendar>
    );
  };

  renderDateInput = () => {
    const className = classnames(this.props.className, {
      [outsideClickIgnoreClass]: this.state.open,
    });

    const customInput = <input type="text" />;
    const customInputRef = "ref";
    const inputValue =
      typeof this.props.value === "string"
        ? this.props.value
        : typeof this.state.inputValue === "string"
        ? this.state.inputValue
        : safeDateFormat(this.props.selected, this.props);

    return React.cloneElement(customInput, {
      [customInputRef]: (input) => {
        this.input = input;
      },
      value: inputValue,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onClick: this.onInputClick,
      onFocus: this.handleFocus,
      onKeyDown: this.onInputKeyDown,
      id: this.props.id,
      name: this.props.name,
      autoFocus: this.props.autoFocus,
      placeholder: this.props.placeholderText,
      disabled: this.props.disabled,
      autoComplete: this.props.autoComplete,
      className: classnames(customInput.props.className, className),
      title: this.props.title,
      readOnly: this.props.readOnly,
      required: this.props.required,
      tabIndex: this.props.tabIndex,
      "aria-labelledby": this.props.ariaLabelledBy,
    });
  };

  render() {
    const calendar = this.renderCalendar();

    if (this.props.inline) {
      return calendar;
    }

    return (
      <PopperComponent
        className={this.props.popperClassName}
        wrapperClassName={this.props.wrapperClassName}
        hidePopper={!this.isCalendarOpen()}
        popperModifiers={this.props.popperModifiers}
        targetComponent={
          <div className="react-datepicker__input-container">
            {this.renderDateInput()}
          </div>
        }
        popperContainer={this.props.popperContainer}
        popperComponent={calendar}
        popperPlacement={this.props.popperPlacement}
        popperProps={this.props.popperProps}
        popperOnKeyDown={this.onPopperKeyDown}
        enableTabLoop={this.props.enableTabLoop}
      />
    );
  }
}

const PRESELECT_CHANGE_VIA_INPUT = "input";
const PRESELECT_CHANGE_VIA_NAVIGATE = "navigate";
