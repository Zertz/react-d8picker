import * as React from "react";
import * as utils from "./date_utils";
import { RenderDayProps } from "./types";
import Week from "./week";

interface Props {
  ariaLabelPrefix?: string;
  chooseDayAriaLabelPrefix?: string;
  disabledDayAriaLabelPrefix?: string;
  day: Date;
  endDate?: Date;
  orderInDisplay?: number;
  filterDate?: () => void;
  formatWeekNumber?: (date: Date) => number;
  highlightDates?: Map<unknown, unknown>;
  inline?: boolean;
  locale?: { locale: {} };
  maxDate?: Date;
  minDate?: Date;
  onDayClick?: (day: Date, event: any, orderInDisplay: number) => void;
  onMouseLeave?: () => void;
  onWeekSelect?: () => void;
  peekNextMonth?: boolean;
  preSelection?: Date;
  setPreSelection?: (day: Date) => void;
  selected?: Date;
  selectingDate?: Date;
  selectsRange?: boolean;
  showWeekNumbers?: boolean;
  startDate?: Date;
  renderDay?: (props: RenderDayProps) => React.ReactNode;
  showFullMonthYearPicker?: boolean;
  handleOnKeyDown?: () => void;
  isInputFocused?: boolean;
  weekAriaLabelPrefix?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
  monthShowsDuplicateDaysEnd?: boolean;
  monthShowsDuplicateDaysStart?: boolean;
}

export default class Month extends React.Component<Props> {
  MONTH_REFS = Array(12)
    .fill(0)
    .map(() => React.createRef());

  handleDayClick = (day: Date, event: any) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event, this.props.orderInDisplay);
    }
  };

  handleMouseLeave = () => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave();
    }
  };

  isWeekInMonth = (startOfWeek: Date) => {
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

      if (breakAfterNextPush) {
        break;
      }

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
