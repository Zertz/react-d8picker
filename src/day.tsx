import * as React from "react";
import classnames from "classnames";
import {
  getDay,
  getMonth,
  getDate,
  newDate,
  isSameDay,
  isDayDisabled,
  isDayExcluded,
  isDayInRange,
  isEqual,
  isBefore,
  isAfter,
  getDayOfWeekCode,
  formatDate,
} from "./date_utils";
import { RenderDayProps } from "./types";

interface Props {
  ariaLabelPrefixWhenEnabled?: string;
  ariaLabelPrefixWhenDisabled?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
  day: Date;
  endDate?: Date;
  filterDate?: () => void;
  handleOnKeyDown?: (event: any) => void;
  highlightDates?: Map<unknown, unknown>;
  inline?: boolean;
  isInputFocused?: boolean;
  maxDate?: Date;
  minDate?: Date;
  month?: number;
  monthShowsDuplicateDaysEnd?: boolean;
  monthShowsDuplicateDaysStart?: boolean;
  onClick: (event: any) => void;
  preSelection?: Date;
  renderDay?: (props: RenderDayProps) => React.ReactNode;
  selected?: any;
  selectingDate?: Date;
  selectsRange?: boolean;
  startDate?: Date;
}

export default class Day extends React.Component<Props> {
  static defaultProps = {
    renderDay({ day, setRef, ...props }: RenderDayProps) {
      return (
        <div {...props} ref={setRef}>
          {day}
        </div>
      );
    },
  };

  dayEl: HTMLDivElement = null;

  componentDidMount() {
    this.handleFocusDay();
  }

  componentDidUpdate(prevProps: Props) {
    this.handleFocusDay(prevProps);
  }

  handleClick = (event: any) => {
    if (!this.isDisabled()) {
      event.persist();

      this.props.onClick(event);
    }
  };

  handleOnKeyDown = (event: any) => {
    const eventKey = event.key;
    if (eventKey === " ") {
      event.preventDefault();
      event.key = "Enter";
    }

    this.props.handleOnKeyDown(event);
  };

  isSameDay = (other: Date) => isSameDay(this.props.day, other);

  isKeyboardSelected = () =>
    !this.isSameDay(this.props.selected) &&
    this.isSameDay(this.props.preSelection);

  isDisabled = () =>
    isDayDisabled(this.props.day, {
      minDate: this.props.minDate,
      maxDate: this.props.maxDate,
      filterDate: this.props.filterDate,
    });

  isExcluded = () => isDayExcluded();

  getHighLightedClass = () => {
    const { day, highlightDates } = this.props;

    if (!highlightDates) {
      return false;
    }

    // Looking for className in the Map of {'day string, 'className'}
    const dayStr = formatDate(day, "MM.dd.yyyy");

    return highlightDates.get(dayStr);
  };

  isInRange = () => {
    const { day, startDate, endDate } = this.props;

    if (!startDate || !endDate) {
      return false;
    }

    return isDayInRange(day, startDate, endDate);
  };

  isInSelectingRange = () => {
    const { day, selectsRange, selectingDate, startDate, endDate } = this.props;

    if (!selectsRange || !selectingDate || this.isDisabled()) {
      return false;
    }

    if (
      endDate &&
      (isBefore(selectingDate, endDate) || isEqual(selectingDate, endDate))
    ) {
      return isDayInRange(day, selectingDate, endDate);
    }

    if (
      startDate &&
      (isAfter(selectingDate, startDate) || isEqual(selectingDate, startDate))
    ) {
      return isDayInRange(day, startDate, selectingDate);
    }

    if (
      selectsRange &&
      startDate &&
      !endDate &&
      (isAfter(selectingDate, startDate) || isEqual(selectingDate, startDate))
    ) {
      return isDayInRange(day, startDate, selectingDate);
    }

    return false;
  };

  isSelectingRangeStart = () => {
    if (!this.isInSelectingRange()) {
      return false;
    }

    const { day, startDate } = this.props;

    return isSameDay(day, startDate);
  };

  isSelectingRangeEnd = () => {
    if (!this.isInSelectingRange()) {
      return false;
    }

    const { day, endDate } = this.props;

    return isSameDay(day, endDate);
  };

  isRangeStart = () => {
    const { day, startDate, endDate } = this.props;

    if (!startDate || !endDate) {
      return false;
    }

    return isSameDay(startDate, day);
  };

  isRangeEnd = () => {
    const { day, startDate, endDate } = this.props;

    if (!startDate || !endDate) {
      return false;
    }

    return isSameDay(endDate, day);
  };

  isWeekend = () => {
    const weekday = getDay(this.props.day);

    return weekday === 0 || weekday === 6;
  };

  isOutsideMonth = () => {
    return (
      this.props.month !== undefined &&
      this.props.month !== getMonth(this.props.day)
    );
  };

  getClassNames = () => {
    return classnames(
      "react-datepicker__day",
      "react-datepicker__day--" + getDayOfWeekCode(this.props.day),
      {
        "react-datepicker__day--disabled": this.isDisabled(),
        "react-datepicker__day--excluded": this.isExcluded(),
        "react-datepicker__day--selected": this.isSameDay(this.props.selected),
        "react-datepicker__day--keyboard-selected": this.isKeyboardSelected(),
        "react-datepicker__day--range-start": this.isRangeStart(),
        "react-datepicker__day--range-end": this.isRangeEnd(),
        "react-datepicker__day--in-range": this.isInRange(),
        "react-datepicker__day--in-selecting-range": this.isInSelectingRange(),
        "react-datepicker__day--selecting-range-start": this.isSelectingRangeStart(),
        "react-datepicker__day--selecting-range-end": this.isSelectingRangeEnd(),
        "react-datepicker__day--today": this.isSameDay(newDate()),
        "react-datepicker__day--weekend": this.isWeekend(),
        "react-datepicker__day--outside-month": this.isOutsideMonth(),
      },
      this.getHighLightedClass()
    );
  };

  getAriaLabel = () => {
    const {
      day,
      ariaLabelPrefixWhenEnabled = "Choose",
      ariaLabelPrefixWhenDisabled = "Not available",
    } = this.props;

    const prefix =
      this.isDisabled() || this.isExcluded()
        ? ariaLabelPrefixWhenDisabled
        : ariaLabelPrefixWhenEnabled;

    return `${prefix} ${formatDate(day, "PPPP")}`;
  };

  getTabIndex = () => {
    const selectedDay = this.props.selected;
    const preSelectionDay = this.props.preSelection;

    const tabIndex =
      this.isKeyboardSelected() ||
      (this.isSameDay(selectedDay) && isSameDay(preSelectionDay, selectedDay))
        ? 0
        : -1;

    return tabIndex;
  };

  // various cases when we need to apply focus to the preselected day
  // focus the day on mount/update so that keyboard navigation works while cycling through months with up or down keys (not for prev and next month buttons)
  // prevent focus for these activeElement cases so we don't pull focus from the input as the calendar opens
  handleFocusDay = (prevProps?: Props) => {
    let shouldFocusDay = false;

    // only do this while the input isn't focused
    // otherwise, typing/backspacing the date manually may steal focus away from the input
    if (
      this.getTabIndex() === 0 &&
      !prevProps?.isInputFocused &&
      this.isSameDay(this.props.preSelection)
    ) {
      // there is currently no activeElement and not inline
      if (
        (!document.activeElement || document.activeElement === document.body) &&
        !this.props.inline
      ) {
        shouldFocusDay = true;
      }

      // the activeElement is in the container, and it is another instance of Day
      if (
        this.props.containerRef &&
        this.props.containerRef.current &&
        this.props.containerRef.current.contains(document.activeElement) &&
        document.activeElement.classList.contains("react-datepicker__day")
      ) {
        shouldFocusDay = true;
      }
    }

    if (shouldFocusDay) {
      this.dayEl.focus({ preventScroll: true });
    }
  };

  getDay = () => {
    const date = getDate(this.props.day);

    if (this.isOutsideMonth()) {
      if (this.props.monthShowsDuplicateDaysEnd && date < 10) {
        return null;
      }

      if (this.props.monthShowsDuplicateDaysStart && date > 20) {
        return null;
      }
    }

    return date;
  };

  render() {
    return this.props.renderDay({
      "aria-disabled": this.isDisabled(),
      "aria-label": this.getAriaLabel(),
      className: this.getClassNames(),
      day: this.getDay(),
      disabled: this.isDisabled(),
      onClick: this.handleClick,
      onKeyDown: this.handleOnKeyDown,
      role: "button",
      setRef: (ref: HTMLDivElement) => {
        this.dayEl = ref;
      },
      tabIndex: this.getTabIndex(),
    });
  }
}
