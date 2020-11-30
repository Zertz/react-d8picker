import { useArgs } from "@storybook/client-api";
import * as React from "react";
import DatePicker from "../src";
import "../src/stylesheets/datepicker.scss";

export default {
  title: "react-d8picker/Basic",
  component: DatePicker,
  args: {
    onChange() {},
    selected: new Date(),
  },
};

const formatter = new Intl.DateTimeFormat("en", { month: "long" });

const Template = (args) => {
  const [{ selected }, updateArgs] = useArgs();

  return (
    <DatePicker
      {...args}
      onChange={(date) => updateArgs({ selected: date })}
      selected={selected}
    />
  );
};

export const Basic = Template.bind({});

Basic.args = {
  showWeekNumbers: false,
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
