import * as React from "react";
import * as utils from "./date_utils";
import Day from "./day";
import { RenderDayProps } from "./types";
import WeekNumber from "./week_number";

interface Props {
  ariaLabelPrefix?: string;
  day: Date;
  disabledDayAriaLabelPrefix?: string;
  chooseDayAriaLabelPrefix?: string;
  endDate?: Date;
  filterDate?: () => void;
  formatWeekNumber?: (date: Date) => number;
  highlightDates?: Map<string, string[]>;
  inline?: boolean;
  locale?: { locale: any };
  maxDate?: Date;
  minDate?: Date;
  month?: number;
  onDayClick?: (day: Date, event: any) => void;
  onWeekSelect?: (day: Date, weekNumber: number, event: any) => void;
  preSelection?: Date;
  selected?: Date;
  selectingDate?: Date;
  selectsRange?: boolean;
  showWeekNumber?: boolean;
  startDate?: Date;
  setOpen?: (open: boolean) => void;
  renderDay?: (props: RenderDayProps) => React.ReactNode;
  handleOnKeyDown?: () => void;
  isInputFocused?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
  monthShowsDuplicateDaysEnd?: boolean;
  monthShowsDuplicateDaysStart?: boolean;
}

export default class Week extends React.Component<Props> {
  handleDayClick = (day: Date, event: any) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event);
    }
  };

  handleWeekClick = (day: Date, weekNumber: number, event: any) => {
    if (this.props.onWeekSelect) {
      this.props.onWeekSelect(day, weekNumber, event);
    }

    if (this.props.setOpen) {
      this.props.setOpen(false);
    }
  };

  formatWeekNumber = (date: Date) => {
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
            renderDay={this.props.renderDay}
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
