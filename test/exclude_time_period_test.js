import React from "react";
import { mount } from "enzyme";
import * as utils from "../src/date_utils";
import DatePicker from "../src";

describe("DatePicker", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should only display times between minTime and maxTime", () => {
    const now = utils.newDate();
    const datePicker = mount(
      <DatePicker
        showTimeSelect
        selected={now}
        onChange={() => null}
        minTime={utils.setTime(now, { hours: 17, minutes: 0 })}
        maxTime={utils.setTime(now, { hours: 18, minutes: 0 })}
      />
    );
    const times = datePicker.find("li.react-datepicker__time-list-item");
    expect(times).to.exist;
  });
});
