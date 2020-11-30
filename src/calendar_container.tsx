import * as React from "react";

export default function CalendarContainer({
  className,
  children,
  arrowProps = {},
}: {
  className: string;
  children: React.ReactNode;
  arrowProps: Record<string, any>; // react-popper arrow props
}) {
  return (
    <div className={className}>
      <div className="react-datepicker__triangle" {...arrowProps} />
      {children}
    </div>
  );
}
