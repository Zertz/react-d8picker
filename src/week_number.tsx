import classnames from "classnames";
import * as React from "react";

interface Props {
  ariaLabelPrefix?: string;
  weekNumber: number;
  onClick?: (event: any) => void;
}

export default class WeekNumber extends React.Component<Props> {
  handleClick = (event: any) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };

  render() {
    const { weekNumber, ariaLabelPrefix = "week ", onClick } = this.props;

    const weekNumberClasses = {
      "react-datepicker__week-number": true,
      "react-datepicker__week-number--clickable": !!onClick,
    };

    return (
      <div
        className={classnames(weekNumberClasses)}
        aria-label={`${ariaLabelPrefix} ${this.props.weekNumber}`}
        onClick={this.handleClick}
      >
        {weekNumber}
      </div>
    );
  }
}
