import classnames from "classnames";
import * as React from "react";
import CalendarContainer from "./calendar_container";
import {
  add,
  getEffectiveMaxDate,
  getEffectiveMinDate,
  getFormattedWeekdayInLocale,
  getMonth,
  getStartOfWeek,
  getWeekdayMinInLocale,
  getWeekdayShortInLocale,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  monthDisabledAfter,
  monthDisabledBefore,
  newDate,
  setMonth,
  setYear,
  yearDisabledAfter,
  yearDisabledBefore,
} from "./date_utils";
import Month from "./month";
import Time from "./time";
import { RenderDayProps, RenderHeaderProps } from "./types";

interface Props {
  arrowProps?: Record<string, any>;
  chooseDayAriaLabelPrefix?: string;
  className?: string;
  children?: React.ReactNode;
  container?: () => void;
  dateFormat: string | string[];
  disabledDayAriaLabelPrefix?: string;
  endDate?: Date;
  filterDate?: () => void;
  formatWeekNumber?: (date: Date) => number;
  highlightDates?: Map<string, string[]>;
  injectTimes?: any[];
  inline?: boolean;
  locale?: { locale: any };
  maxDate?: Date;
  minDate?: Date;
  monthsShown?: number;
  monthSelectedIn?: number;
  onClickOutside: (event: any) => void;
  onMonthChange?: (date: Date) => void;
  onYearChange?: (date: Date) => void;
  onSelect: (
    day: Date,
    event?: any,
    monthSelectedIn?: number,
    close?: boolean
  ) => void;
  onWeekSelect?: () => void;
  showTimeSelect?: boolean;
  showFullMonthYearPicker?: boolean;
  showTimeSelectOnly?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  onTimeChange?: () => void;
  minTime?: Date;
  maxTime?: Date;
  filterTime?: () => void;
  timeCaption?: string;
  openToDate?: Date;
  peekNextMonth?: boolean;
  previousYearAriaLabel?: string;
  preSelection?: Date;
  selected?: Date;
  selectsRange?: boolean;
  showPreviousMonths?: boolean;
  showWeekNumbers?: boolean;
  startDate?: Date;
  useWeekdaysShort?: boolean;
  formatWeekDay?: () => void;
  weekLabel?: string;
  renderHeader?: (props: RenderHeaderProps) => React.ReactNode;
  renderDay?: (props: RenderDayProps) => React.ReactNode;
  onMonthMouseLeave?: () => void;
  handleOnKeyDown?: () => void;
  isInputFocused?: boolean;
  weekAriaLabelPrefix?: string;
  setPreSelection?: (day: Date) => void;
}

interface State {
  date: Date;
  selectingDate: Date | null;
  monthContainer: HTMLDivElement;
}

export default class Calendar extends React.Component<Props, State> {
  static defaultProps = {
    monthsShown: 1,
    monthSelectedIn: 0,
    timeCaption: "Time",
    weekLabel: "#",
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      date: this.getDateInView(),
      selectingDate: null,
      monthContainer: null,
    };
  }

  assignMonthContainer: unknown;
  containerRef: React.RefObject<HTMLDivElement> = React.createRef();
  monthContainer: HTMLDivElement;

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
    const minDate = getEffectiveMinDate({ minDate: this.props.minDate });
    const maxDate = getEffectiveMaxDate({ maxDate: this.props.maxDate });
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

  handleDayClick = (day: Date, event: any, monthSelectedIn: number) => {
    this.props.onSelect(day, event, monthSelectedIn, true);
    this.props.setPreSelection && this.props.setPreSelection(day);
  };

  handleMonthMouseLeave = () => {
    this.setState({ selectingDate: null });
    this.props.onMonthMouseLeave && this.props.onMonthMouseLeave();
  };

  handleYearChange = (date) => {
    if (this.props.onYearChange) {
      this.props.onYearChange(date);
    }

    this.props.onSelect(date);
    this.props.setPreSelection && this.props.setPreSelection(date);
  };

  handleMonthChange = (date) => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(date);
    }

    this.props.onSelect(date);
    this.props.setPreSelection && this.props.setPreSelection(date);
  };

  handleMonthYearChange = (date) => {
    this.handleYearChange(date);
    this.handleMonthChange(date);
  };

  changeYear = (year: number) => {
    this.setState(
      ({ date }) => ({
        date: setYear(date, year),
      }),
      () => this.handleYearChange(this.state.date)
    );
  };

  changeMonth = (month: number) => {
    this.setState(
      ({ date }) => ({
        date: setMonth(date, month),
      }),
      () => this.handleMonthChange(this.state.date)
    );
  };

  changeMonthYear = (monthYear: Date) => {
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
          {this.props.weekLabel}
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

  renderHeader = (
    headerArgs: { monthDate: Date; i: number } = {
      monthDate: undefined,
      i: undefined,
    }
  ) => {
    const { monthDate, i } = headerArgs;

    if (i !== 0 && i !== undefined) {
      return null;
    }

    const prevMonthButtonDisabled = monthDisabledBefore(this.state.date, {
      minDate: this.props.minDate,
    });

    const nextMonthButtonDisabled = monthDisabledAfter(this.state.date, {
      maxDate: this.props.maxDate,
    });

    const prevYearButtonDisabled = yearDisabledBefore(this.state.date, {
      minDate: this.props.minDate,
    });

    const nextYearButtonDisabled = yearDisabledAfter(this.state.date, {
      maxDate: this.props.maxDate,
    });

    return (
      <div
        className={`react-datepicker__header react-datepicker__header--custom ${
          this.props.showTimeSelect
            ? "react-datepicker__header--has-time-select"
            : ""
        }`}
      >
        {this.props.renderHeader &&
          this.props.renderHeader({
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
            day={monthDate}
            onDayClick={this.handleDayClick}
            handleOnKeyDown={this.props.handleOnKeyDown}
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
            renderDay={this.props.renderDay}
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
    return (
      <div ref={this.containerRef}>
        <CalendarContainer
          className={classnames("react-datepicker", this.props.className, {
            "react-datepicker--time-only": this.props.showTimeSelectOnly,
          })}
          arrowProps={this.props.arrowProps}
        >
          {this.renderMonths()}
          {this.renderYears()}
          {this.renderTimeSection()}
          {this.props.children}
        </CalendarContainer>
      </div>
    );
  }
}
