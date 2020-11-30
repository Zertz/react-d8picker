import classnames from "classnames";
import * as React from "react";
import onClickOutside from "react-onclickoutside";
import Calendar from "./calendar";
import {
  add,
  getDefaultLocale,
  getEffectiveMaxDate,
  getEffectiveMinDate,
  getHightLightDaysMap,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
  isAfter,
  isBefore,
  isDate,
  isDayDisabled,
  isDayInRange,
  isEqual,
  newDate,
  parseDate,
  setDefaultLocale,
  setTime,
} from "./date_utils";
import PopperComponent from "./popper_component";
import { RenderDayProps, RenderHeaderProps, RenderInputProps } from "./types";

export { default as CalendarContainer } from "./calendar_container";
export { setDefaultLocale, getDefaultLocale };

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

interface Props {
  ariaLabelClose?: string;
  children?: React.ReactNode;
  chooseDayAriaLabelPrefix?: string;
  className?: string;
  dateFormat?: string | any[];
  dateFormatCalendar?: string;
  disabledDayAriaLabelPrefix?: string;
  disabled?: boolean;
  endDate?: Date;
  filterDate?: () => void;
  formatWeekNumber?: () => void;
  highlightDates?: any[];
  id?: string;
  injectTimes?: any[];
  inline?: boolean;
  locale?: { locale?: {} };
  maxDate?: Date;
  minDate?: Date;
  monthsShown?: number;
  name?: string;
  onBlur?: (event: any) => void;
  onChange?: (date: Date | [Date, Date], e?: any) => void;
  onSelect?: (date: Date, event: any) => void;
  onWeekSelect?: () => void;
  onClickOutside?: (event: any) => void;
  onFocus?: (event: any) => void;
  onInputClick?: () => void;
  onKeyDown?: (event: any) => void;
  onMonthChange?: () => void;
  onYearChange?: () => void;
  onInputError?: (error: { code: number; msg: string }) => void;
  open?: boolean;
  openToDate?: Date;
  peekNextMonth?: boolean;
  readOnly?: boolean;
  required?: boolean;
  selected?: Date;
  selectsRange?: boolean;
  showPreviousMonths?: boolean;
  showWeekNumbers?: boolean;
  startDate?: Date;
  startOpen?: boolean;
  timeCaption?: string;
  title?: string;
  useWeekdaysShort?: boolean;
  formatWeekDay?: () => void;
  value: string;
  weekLabel?: string;
  showFullMonthYearPicker?: boolean;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  minTime?: Date;
  maxTime?: Date;
  filterTime?: () => void;
  focusSelectedMonth?: boolean;
  onMonthMouseLeave?: () => void;
  enableTabLoop?: boolean;
  weekAriaLabelPrefix?: string;
  // Popper props
  popperContainer?: () => void;
  popperClassName?: string;
  popperModifiers?: {};
  popperPlacement?: any;
  popperProps?: {};
  // Render props
  renderDay?: (props: RenderDayProps) => React.ReactNode;
  renderHeader?: (props: RenderHeaderProps) => void;
  renderInput?: (props: RenderInputProps) => React.ReactNode;
}

interface State {
  focused: boolean;
  highlightDates: Map<string, string[]>;
  lastPreSelectChange: any;
  monthSelectedIn: any;
  open: boolean;
  preSelection: Date;
  preventFocus: boolean;
}

export default class DatePicker extends React.Component<Props, State> {
  static defaultProps = {
    dateFormat: "MM/dd/yyyy",
    dateFormatCalendar: "LLLL yyyy",
    disabled: false,
    enableTabLoop: true,
    focusSelectedMonth: false,
    monthsShown: 1,
    onBlur: () => undefined,
    onChange: () => undefined,
    onClickOutside: () => undefined,
    onFocus: () => undefined,
    onInputClick: () => undefined,
    onInputError: () => undefined,
    onKeyDown: () => undefined,
    onMonthChange: () => undefined,
    onSelect: () => undefined,
    onYearChange: () => undefined,
    readOnly: false,
    showTimeSelect: false,
    showPreviousMonths: false,
    showFullMonthYearPicker: false,
    timeCaption: "Time",
    timeIntervals: 30,
    // Render props
    renderInput({ className, setRef, value, ...props }: RenderInputProps) {
      return (
        <input
          {...props}
          className={`${className} react-datepicker__input`}
          ref={setRef}
          value={value?.toString() || ""}
        />
      );
    },
  };

  constructor(props) {
    super(props);
    this.state = this.calcInitialState();
  }

  calendar = null;
  input: HTMLInputElement = null;
  inputFocusTimeout = null;
  preventFocusTimeout = null;

  componentDidUpdate(prevProps: Props) {
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
  }

  componentWillUnmount() {
    this.clearPreventFocusTimeout();
  }

  getPreSelection = () => this.props.openToDate || newDate();

  calcInitialState = () => {
    const defaultPreSelection = this.getPreSelection();
    const minDate = getEffectiveMinDate({ minDate: this.props.minDate });
    const maxDate = getEffectiveMaxDate({ maxDate: this.props.maxDate });
    const boundedPreSelection =
      minDate && isBefore(defaultPreSelection, minDate)
        ? minDate
        : maxDate && isAfter(defaultPreSelection, maxDate)
        ? maxDate
        : defaultPreSelection;
    return {
      focused: false,
      // transforming highlighted days (perhaps nested array)
      // to flat Map for faster access in <Day />
      highlightDates: getHightLightDaysMap(this.props.highlightDates),
      lastPreSelectChange: undefined,
      monthSelectedIn: undefined,
      open: this.props.startOpen || false,
      preSelection: this.props.selected
        ? this.props.selected
        : boundedPreSelection,
      preventFocus: false,
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

  setOpen = (open: boolean, skipSetBlur = false) => {
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

  handleChange = (event: any) => {
    const date = parseDate(
      event.target.value,
      this.props.dateFormat,
      this.props.locale
    );
    this.setState({
      lastPreSelectChange: PRESELECT_CHANGE_VIA_INPUT,
    });
    if (date || !event.target.value) {
      this.setSelected(date, event, true);
    }
  };

  handleSelect = (
    date: Date,
    event: any,
    monthSelectedIn?: any,
    close?: boolean
  ) => {
    // Preventing onFocus event to fix issue
    // https://github.com/Hacker0x01/react-datepicker/issues/628
    this.setState({ open: !close, preventFocus: true }, () => {
      this.preventFocusTimeout = setTimeout(
        () => this.setState({ preventFocus: false }),
        50
      );
      return this.preventFocusTimeout;
    });
    this.setSelected(date, event, false, monthSelectedIn);
    if (this.props.showTimeSelect) {
      this.setPreSelection(date);
    }
  };

  setSelected = (
    date: Date | null,
    event?: any,
    keepInput?: boolean,
    monthSelectedIn?: any
  ) => {
    const changedDate = date;

    if (
      changedDate !== null &&
      isDayDisabled(changedDate, {
        minDate: this.props.minDate,
        maxDate: this.props.maxDate,
        filterDate: this.props.filterDate,
      })
    ) {
      return;
    }
    const { onChange, selectsRange, startDate, endDate } = this.props;

    if (!isEqual(this.props.selected, changedDate) || selectsRange) {
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
          this.setState({ monthSelectedIn });
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
    const changedDate = setTime(selected, {
      hour: getHours(time),
      minute: getMinutes(time),
    });

    this.setState({
      preSelection: changedDate,
    });

    this.props.onChange(changedDate);
    this.setOpen(false);
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
          this.handleSelect(copy, event, undefined, true);
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

  // keyDown events passed down to <Day />
  onDayKeyDown = (event) => {
    this.props.onKeyDown(event);
    const eventKey = event.key;

    const copy = newDate(this.state.preSelection);
    if (eventKey === "Enter") {
      event.preventDefault();
      this.handleSelect(copy, event, undefined, true);
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
          newSelection = add(copy, { days: -1 });
          break;
        case "ArrowRight":
          newSelection = add(copy, { days: 1 });
          break;
        case "ArrowUp":
          newSelection = add(copy, { weeks: -1 });
          break;
        case "ArrowDown":
          newSelection = add(copy, { weeks: 1 });
          break;
        case "PageUp":
          newSelection = add(copy, { months: -1 });
          break;
        case "PageDown":
          newSelection = add(copy, { months: 1 });
          break;
        case "Home":
          newSelection = add(copy, { years: -1 });
          break;
        case "End":
          newSelection = add(copy, { years: 1 });
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
        filterDate={this.props.filterDate}
        onClickOutside={this.handleCalendarClickOutside}
        formatWeekNumber={this.props.formatWeekNumber}
        highlightDates={this.state.highlightDates}
        injectTimes={this.props.injectTimes}
        inline={this.props.inline}
        peekNextMonth={this.props.peekNextMonth}
        showPreviousMonths={this.props.showPreviousMonths}
        showWeekNumbers={this.props.showWeekNumbers}
        weekLabel={this.props.weekLabel}
        outsideClickIgnoreClass={outsideClickIgnoreClass}
        monthsShown={this.props.monthsShown}
        monthSelectedIn={this.state.monthSelectedIn}
        onMonthChange={this.props.onMonthChange}
        onYearChange={this.props.onYearChange}
        showTimeSelect={this.props.showTimeSelect}
        showTimeSelectOnly={this.props.showTimeSelectOnly}
        onTimeChange={this.handleTimeChange}
        timeFormat={this.props.timeFormat}
        timeIntervals={this.props.timeIntervals}
        minTime={this.props.minTime}
        maxTime={this.props.maxTime}
        filterTime={this.props.filterTime}
        timeCaption={this.props.timeCaption}
        renderHeader={this.props.renderHeader}
        popperProps={this.props.popperProps}
        renderDay={this.props.renderDay}
        onMonthMouseLeave={this.props.onMonthMouseLeave}
        showFullMonthYearPicker={this.props.showFullMonthYearPicker}
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

    return this.props.renderInput({
      className,
      disabled: this.props.disabled,
      id: this.props.id,
      name: this.props.name,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onClick: this.onInputClick,
      onFocus: this.handleFocus,
      onKeyDown: this.onInputKeyDown,
      readOnly: this.props.readOnly,
      required: this.props.required,
      setRef: (input: HTMLInputElement) => {
        this.input = input;
      },
      title: this.props.title,
      value: this.props.selected,
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
