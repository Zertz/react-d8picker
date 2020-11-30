import { useArgs } from "@storybook/client-api";
import * as React from "react";
import DatePicker from "../src";
import "../src/stylesheets/datepicker.scss";

export default {
  title: "react-d8picker/Basic",
  component: DatePicker,
  args: {
    onChange() {},
    monthsShown: 1,
    selected: new Date(),
    selectsRange: false,
    showWeekNumbers: false,
  },
};

const formatter = new Intl.DateTimeFormat("en", { month: "long" });

const Template = (args) => {
  const [{ endDate, selected, startDate }, updateArgs] = useArgs();

  return (
    <DatePicker
      {...args}
      endDate={endDate}
      onChange={(date) =>
        updateArgs(
          Array.isArray(date)
            ? { startDate: date[0] || startDate, endDate: date[1] || endDate }
            : { selected: date }
        )
      }
      selected={selected}
      startDate={startDate}
    />
  );
};

export const Basic = Template.bind({});

export const RangeProps = Template.bind({});

RangeProps.args = {
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  monthsShown: 2,
  selectsRange: true,
  startDate: new Date(),
};

export const RenderProps = Template.bind({});

RenderProps.args = {
  onChange() {},
  renderDay: function Day({ day, onClick, setRef, ...props }) {
    return (
      <div
        {...props}
        onClick={(e) => {
          e.persist();

          alert("You clicked a day!");

          onClick(e);
        }}
        ref={setRef}
      >
        {day}
      </div>
    );
  },
  renderHeader: function Header(props) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={props.decreaseMonth}>&larr;</button>
        {formatter.format(props.date)}
        <button onClick={props.increaseMonth}>&rarr;</button>
      </div>
    );
  },
  renderInput: function Input({ setRef, value, ...props }) {
    return (
      <input
        {...props}
        ref={setRef}
        type="text"
        value={value.toLocaleString()}
      />
    );
  },
  selected: new Date(),
  showWeekNumbers: false,
};
