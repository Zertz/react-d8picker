import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-dom/test-utils";
import { mount } from "enzyme";
import defer from "lodash/defer";
import DatePicker from "../src/index.jsx";
import Day from "../src/day";
import WeekNumber from "../src/week_number";
import TestWrapper from "./test_wrapper.jsx";
import PopperComponent from "../src/popper_component.jsx";
import * as utils from "../src/date_utils";
import Month from "../src/month.jsx";

function getKey(key) {
  switch (key) {
    case "Backspace":
      return { key, code: 8, which: 8 };
    case "Tab":
      return { key, code: 9, which: 9 };
    case "Enter":
      return { key, code: 13, which: 13 };
    case "Escape":
      return { key, code: 27, which: 27 };
    case "PageUp":
      return { key, keyCode: 33, which: 33 };
    case "PageDown":
      return { key, keyCode: 34, which: 34 };
    case "End":
      return { key, keyCode: 35, which: 35 };
    case "Home":
      return { key, keyCode: 36, which: 36 };
    case "ArrowLeft":
      return { key, code: 37, which: 37 };
    case "ArrowUp":
      return { key, code: 38, which: 38 };
    case "ArrowRight":
      return { key, code: 39, which: 39 };
    case "ArrowDown":
      return { key, code: 40, which: 40 };
    case "x":
      return { key, code: 88, which: 88 };
  }
  throw new Error("Unknown key :" + key);
}

function getSelectedDayNode(datePicker) {
  return (
    datePicker.calendar &&
    datePicker.calendar.componentNode.querySelector(
      '.react-datepicker__day[tabindex="0"]'
    )
  );
}

describe("DatePicker", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should show the calendar when focusing on the date input", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.focus(ReactDOM.findDOMNode(dateInput));
    expect(datePicker.calendar).to.exist;
  });

  it("should allow the user to supply a wrapper component for the popper", () => {
    var datePicker = mount(<DatePicker popperContainer={TestWrapper} />);

    const dateInput = datePicker.instance().input;
    TestUtils.Simulate.focus(ReactDOM.findDOMNode(dateInput));

    expect(datePicker.find(".test-wrapper").length).to.equal(1);
    expect(datePicker.instance().calendar).to.exist;
  });

  it("should pass a custom class to the popper container", () => {
    var datePicker = mount(<DatePicker popperClassName="some-class-name" />);
    var dateInput = datePicker.instance().input;
    TestUtils.Simulate.focus(ReactDOM.findDOMNode(dateInput));

    datePicker.update();
    const popper = datePicker.find(".react-datepicker-popper");
    expect(popper.length).to.equal(1);
    expect(popper.hasClass("some-class-name")).to.equal(true);
  });

  it("should show the calendar when clicking on the date input", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.click(ReactDOM.findDOMNode(dateInput));
    expect(datePicker.calendar).to.exist;
  });

  it("should not set open state when it is disabled and gets clicked", function () {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker disabled />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.click(ReactDOM.findDOMNode(dateInput));
    expect(datePicker.state.open).to.be.false;
  });

  it("should close the popper and return focus to the date input.", (done) => {
    // https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html
    // Date Picker Dialog | Escape | Closes the dialog and returns focus to the Choose Date button.
    var div = document.createElement("div");
    document.body.appendChild(div);
    var datePicker = ReactDOM.render(<DatePicker />, div);

    // user focuses the input field, the calendar opens
    var dateInput = div.querySelector("input");
    TestUtils.Simulate.focus(dateInput);

    // user may tab or arrow down to the current day (or some other element in the popper)
    var today = div.querySelector(".react-datepicker__day--today");
    today.focus();

    // user hits Escape
    TestUtils.Simulate.keyDown(today, getKey("Escape"));

    defer(() => {
      expect(datePicker.calendar).to.not.exist;
      expect(datePicker.state.preventFocus).to.be.false;
      expect(document.activeElement).to.equal(div.querySelector("input"));
      done();
    });
  });

  it("should keep the calendar shown when clicking the calendar", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.focus(ReactDOM.findDOMNode(dateInput));
    TestUtils.Simulate.click(ReactDOM.findDOMNode(datePicker.calendar));
    expect(datePicker.calendar).to.exist;
  });

  it("should not set open state when it is disabled and gets clicked", function () {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker disabled />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.click(ReactDOM.findDOMNode(dateInput));
    expect(datePicker.state.open).to.be.false;
  });

  it("should not set open state when it is readOnly and gets clicked", function () {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker readOnly />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.click(ReactDOM.findDOMNode(dateInput));
    expect(datePicker.state.open).to.be.false;
  });

  it("should hide the calendar when clicking a day on the calendar", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.focus(ReactDOM.findDOMNode(dateInput));
    var day = TestUtils.scryRenderedComponentsWithType(
      datePicker.calendar,
      Day
    )[0];
    TestUtils.Simulate.click(ReactDOM.findDOMNode(day));
    expect(datePicker.calendar).to.not.exist;
  });

  it("should hide the calendar when pressing enter in the date input", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.focus(ReactDOM.findDOMNode(dateInput));
    TestUtils.Simulate.keyDown(
      ReactDOM.findDOMNode(dateInput),
      getKey("Enter")
    );
    expect(datePicker.calendar).to.not.exist;
  });

  it("should hide the calendar when the pressing escape in the date input", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.focus(ReactDOM.findDOMNode(dateInput));
    TestUtils.Simulate.keyDown(
      ReactDOM.findDOMNode(dateInput),
      getKey("Escape")
    );
    expect(datePicker.calendar).to.not.exist;
  });

  it("should not apply the react-datepicker-ignore-onclickoutside class to the date input when closed", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker />);
    var dateInput = datePicker.input;
    expect(ReactDOM.findDOMNode(dateInput).className).to.not.contain(
      "react-datepicker-ignore-onclickoutside"
    );
  });

  it("should apply the react-datepicker-ignore-onclickoutside class to date input when open", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.focus(ReactDOM.findDOMNode(dateInput));
    expect(ReactDOM.findDOMNode(dateInput).className).to.contain(
      "react-datepicker-ignore-onclickoutside"
    );
  });

  it("should save time from the selected date during day change", () => {
    const selected = utils.newDate("2015-12-20 10:11:12");
    let date;

    var datePicker = TestUtils.renderIntoDocument(
      <DatePicker
        inline
        selected={selected}
        onChange={(d) => {
          date = d;
        }}
      />
    );
    var dayButton = TestUtils.scryRenderedDOMComponentsWithClass(
      datePicker,
      "react-datepicker__day"
    )[0];
    TestUtils.Simulate.click(dayButton);

    expect(utils.getHours(date)).to.equal(10);
    expect(utils.getMinutes(date)).to.equal(11);
    expect(utils.getSeconds(date)).to.equal(12);
  });

  it("should save time from the selected date during date change", () => {
    const selected = utils.newDate("2015-12-20 10:11:12");
    let date;

    var datePicker = TestUtils.renderIntoDocument(
      <DatePicker
        selected={selected}
        onChange={(d) => {
          date = d;
        }}
      />
    );

    var input = ReactDOM.findDOMNode(datePicker.input);
    input.value = "02/01/2014";
    TestUtils.Simulate.change(input);

    expect(utils.getHours(date)).to.equal(10);
    expect(utils.getMinutes(date)).to.equal(11);
    expect(utils.getSeconds(date)).to.equal(12);
  });

  it("should mount and unmount properly", (done) => {
    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = { mounted: true };
      }

      render() {
        return this.state.mounted ? <DatePicker /> : null;
      }
    }
    var element = TestUtils.renderIntoDocument(<TestComponent />);
    element.setState({ mounted: false }, done);
  });

  it("should render calendar inside PopperComponent when inline prop is not set", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker />);

    expect(function () {
      TestUtils.findRenderedComponentWithType(datePicker, PopperComponent);
    }).to.not.throw();
  });

  it("should render calendar directly without PopperComponent when inline prop is set", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker inline />);

    expect(function () {
      TestUtils.findRenderedComponentWithType(datePicker, PopperComponent);
    }).to.throw();
    expect(datePicker.calendar).to.exist;
  });

  it("should ignore disable prop when inline prop is set", () => {
    var datePicker = TestUtils.renderIntoDocument(
      <DatePicker inline disabled />
    );

    expect(datePicker.calendar).to.exist;
  });

  function getOnInputKeyDownStuff(opts) {
    opts = opts || {};
    var m = utils.newDate();
    var copyM = utils.newDate(m);
    var testFormat = "yyyy-MM-dd";
    var exactishFormat = "yyyy-MM-dd hh: zzzz";
    var callback = sandbox.spy();
    var onInputErrorCallback = sandbox.spy();

    var datePicker = TestUtils.renderIntoDocument(
      <DatePicker
        selected={m}
        onChange={callback}
        onInputError={onInputErrorCallback}
        dateFormat={testFormat}
        {...opts}
      />
    );
    var dateInput = datePicker.input;
    var nodeInput = ReactDOM.findDOMNode(dateInput);
    var dateCalendar = datePicker.calendar;
    TestUtils.Simulate.focus(nodeInput);
    return {
      m,
      copyM,
      testFormat,
      exactishFormat,
      callback,
      onInputErrorCallback,
      datePicker,
      dateInput,
      nodeInput,
      dateCalendar,
    };
  }
  it("should handle onDayKeyDown ArrowLeft", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    TestUtils.Simulate.keyDown(
      getSelectedDayNode(data.datePicker),
      getKey("ArrowLeft")
    );
    data.copyM = utils.add(data.copyM, { days: -1 });
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should handle onDayKeyDown ArrowRight", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    TestUtils.Simulate.keyDown(
      getSelectedDayNode(data.datePicker),
      getKey("ArrowRight")
    );
    data.copyM = utils.add(data.copyM, { days: 1 });
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should handle onDayKeyDown ArrowUp", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    TestUtils.Simulate.keyDown(
      getSelectedDayNode(data.datePicker),
      getKey("ArrowUp")
    );
    data.copyM = utils.add(data.copyM, { weeks: -1 });
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should handle onDayKeyDown ArrowDown", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    TestUtils.Simulate.keyDown(
      getSelectedDayNode(data.datePicker),
      getKey("ArrowDown")
    );
    data.copyM = utils.add(data.copyM, { weeks: 1 });
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should handle onDayKeyDown PageUp", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    TestUtils.Simulate.keyDown(
      getSelectedDayNode(data.datePicker),
      getKey("PageUp")
    );
    data.copyM = utils.add(data.copyM, { months: -1 });
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should handle onDayKeyDown PageDown", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    TestUtils.Simulate.keyDown(
      getSelectedDayNode(data.datePicker),
      getKey("PageDown")
    );
    data.copyM = utils.add(data.copyM, { months: 1 });
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should handle onDayKeyDown End", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    TestUtils.Simulate.keyDown(
      getSelectedDayNode(data.datePicker),
      getKey("End")
    );
    data.copyM = utils.add(data.copyM, { years: 1 });
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should handle onDayKeyDown Home", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    TestUtils.Simulate.keyDown(
      getSelectedDayNode(data.datePicker),
      getKey("Home")
    );
    data.copyM = utils.add(data.copyM, { years: -1 });
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should not preSelect date if not between minDate and maxDate", () => {
    var data = getOnInputKeyDownStuff({
      minDate: utils.add(utils.newDate(), { days: -1 }),
      maxDate: utils.add(utils.newDate(), { days: 1 }),
    });
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should not preSelect date if before minDate", () => {
    var data = getOnInputKeyDownStuff({
      minDate: utils.add(utils.newDate(), { days: -1 }),
    });
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowUp"));
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should not preSelect date if after maxDate", () => {
    var data = getOnInputKeyDownStuff({
      maxDate: utils.add(utils.newDate(), { days: 1 }),
    });
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should not clear the preSelect date when a pressed key is not a navigation key", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("x"));
    expect(data.datePicker.state.preSelection.valueOf()).to.equal(
      data.copyM.valueOf()
    );
  });
  it("should not manual select date if before minDate", () => {
    var minDate = utils.add(utils.newDate(), { days: -1 });
    var data = getOnInputKeyDownStuff({
      minDate: minDate,
    });
    TestUtils.Simulate.change(data.nodeInput, {
      target: {
        value: utils.formatDate(
          utils.add(minDate, { days: -1 }),
          data.testFormat
        ),
      },
    });
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("Enter"));
    expect(data.callback.calledOnce).to.be.false;
  });
  it("should not manual select date if after maxDate", () => {
    var maxDate = utils.add(utils.newDate(), { days: 1 });
    var data = getOnInputKeyDownStuff({
      maxDate: maxDate,
    });
    TestUtils.Simulate.change(data.nodeInput, {
      target: {
        value: utils.formatDate(
          utils.add(maxDate, { days: 1 }),
          data.testFormat
        ),
      },
    });
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("Enter"));
    expect(data.callback.calledOnce).to.be.false;
  });
  describe("onInputKeyDown Enter", () => {
    it("should update the selected date", () => {
      var data = getOnInputKeyDownStuff();
      TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown")); // puts focus on the calendar day
      TestUtils.Simulate.keyDown(
        getSelectedDayNode(data.datePicker),
        getKey("ArrowLeft")
      );
      TestUtils.Simulate.keyDown(
        getSelectedDayNode(data.datePicker),
        getKey("Enter")
      );

      data.copyM = utils.add(data.copyM, { days: -1 });
      expect(data.callback.calledTwice).to.be.true;
      var result = data.callback.args[0][0];
      expect(utils.formatDate(result, data.testFormat)).to.equal(
        utils.formatDate(data.copyM, data.testFormat)
      );
    });
    it("should update the selected date on manual input", () => {
      var data = getOnInputKeyDownStuff();
      TestUtils.Simulate.change(data.nodeInput, {
        target: { value: "2017-02-02" },
      });
      TestUtils.Simulate.keyDown(data.nodeInput, getKey("Enter"));
      data.copyM = utils.newDate("2017-02-02");
      expect(
        utils.formatDate(data.callback.args[0][0], data.testFormat)
      ).to.equal(utils.formatDate(data.copyM, data.testFormat));
    });
    it("should not select dates excluded from filterDate", () => {
      var data = getOnInputKeyDownStuff({
        filterDate: (date) =>
          utils.getDay(date) !==
          utils.getDay(utils.add(utils.newDate(), { days: -1 })),
      });
      TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowLeft"));
      TestUtils.Simulate.keyDown(data.nodeInput, getKey("Enter"));
      expect(data.callback.calledOnce).to.be.false;
    });
  });
  describe("onInputKeyDown Escape", () => {
    it("should not update the selected date if the date input manually it has something wrong", () => {
      var data = getOnInputKeyDownStuff();
      var preSelection = data.datePicker.state.preSelection;
      TestUtils.Simulate.keyDown(data.nodeInput, getKey("Backspace"));
      TestUtils.Simulate.keyDown(data.nodeInput, getKey("Escape"));
      expect(data.callback.calledOnce).to.be.false; // confirms that handleChange occurred
      expect(preSelection).to.equal(data.datePicker.state.preSelection); // confirms the preSelection is still the same
    });
  });
  it("should reset the keyboard selection when closed", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowLeft"));
    data.datePicker.setOpen(false);
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should retain the keyboard selection when already open", () => {
    var data = getOnInputKeyDownStuff();
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    TestUtils.Simulate.keyDown(
      getSelectedDayNode(data.datePicker),
      getKey("ArrowLeft")
    );
    data.copyM = utils.add(data.copyM, { days: -1 });
    expect(
      utils.formatDate(data.datePicker.state.preSelection, data.testFormat)
    ).to.equal(utils.formatDate(data.copyM, data.testFormat));
  });
  it("should open the calendar when the down arrow key is pressed", () => {
    var data = getOnInputKeyDownStuff();
    data.datePicker.setOpen(false);
    expect(data.datePicker.state.open).to.be.false;
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowDown"));
    expect(data.datePicker.state.open).to.be.true;
  });
  it("should not open the calendar when the left arrow key is pressed", () => {
    var data = getOnInputKeyDownStuff();
    data.datePicker.setOpen(false);
    expect(data.datePicker.state.open).to.be.false;
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("ArrowLeft"));
    expect(data.datePicker.state.open).to.be.false;
  });
  it("should default to the current day on Enter", () => {
    const data = getOnInputKeyDownStuff({ selected: null });
    TestUtils.Simulate.keyDown(data.nodeInput, getKey("Enter"));
    expect(data.callback.calledOnce).to.be.true;
    const selected = data.callback.getCall(0).args[0];
    expect(utils.formatDate(selected, data.exactishFormat)).to.equal(
      utils.formatDate(data.copyM, data.exactishFormat)
    );
  });

  it("should autofocus the input given the autoFocus prop", () => {
    var div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(<DatePicker autoFocus />, div);
    expect(div.querySelector("input")).to.equal(document.activeElement);
  });
  it("should autofocus the input when calling the setFocus method", () => {
    var div = document.createElement("div");
    document.body.appendChild(div);
    var datePicker = ReactDOM.render(<DatePicker />, div);
    datePicker.setFocus();
    expect(div.querySelector("input")).to.equal(document.activeElement);
  });
  it("should clear preventFocus timeout id when component is unmounted", () => {
    var div = document.createElement("div");
    document.body.appendChild(div);
    var datePicker = ReactDOM.render(<DatePicker inline />, div);
    datePicker.clearPreventFocusTimeout = sinon.spy();
    ReactDOM.unmountComponentAtNode(div);
    assert(
      datePicker.clearPreventFocusTimeout.calledOnce,
      "should call clearPreventFocusTimeout"
    );
  });

  it("should correctly clear date with empty input string", () => {
    var cleared = false;
    function handleChange(d) {
      // Internally DateInput calls it's onChange prop with null
      // when the input value is an empty string
      if (d === null) {
        cleared = true;
      }
    }
    var datePicker = TestUtils.renderIntoDocument(
      <DatePicker
        selected={utils.newDate("2016-11-22")}
        onChange={handleChange}
      />
    );
    var input = ReactDOM.findDOMNode(datePicker.input);
    input.value = "";
    TestUtils.Simulate.change(input);
    expect(cleared).to.be.true;
  });
  it("should correctly update the input when the value prop changes", () => {
    const datePicker = mount(<DatePicker />);
    expect(datePicker.find("input").prop("value")).to.equal("");
    datePicker.setProps({ value: "foo" });
    expect(datePicker.find("input").prop("value")).to.equal("foo");
  });
  it("should preserve user input as they are typing", () => {
    const onChange = (date) => datePicker.setProps({ selected: date });
    const datePicker = mount(
      <DatePicker
        dateFormat={["yyyy-MM-dd", "MM/dd/yyyy", "MM/dd/yy"]}
        onChange={onChange}
      />
    );
    expect(datePicker.find("input").prop("value")).to.equal("");

    const str = "12/30/1982";
    datePicker.find("input").simulate("focus");
    str.split("").forEach((c, i) => {
      datePicker.find("input").simulate("change", {
        target: { value: datePicker.find("input").prop("value") + c },
      });
      datePicker.update();
      expect(datePicker.find("input").prop("value")).to.equal(
        str.substring(0, i + 1)
      );
    });
    expect(
      utils.formatDate(datePicker.prop("selected"), "yyyy-MM-dd")
    ).to.equal("1982-12-30");
  });
  it("should default to the currently selected date", () => {
    const datePicker = mount(
      <DatePicker selected={utils.newDate("1988-12-30")} />
    );
    expect(
      utils.formatDate(datePicker.state("preSelection"), "yyyy-MM-dd")
    ).to.equal("1988-12-30");
  });
  it("should default to a date <= maxDate", () => {
    const datePicker = mount(
      <DatePicker maxDate={utils.newDate("1982-01-01")} />
    );
    expect(
      utils.formatDate(datePicker.state("preSelection"), "yyyy-MM-dd")
    ).to.equal("1982-01-01");
  });
  it("should default to a date >= minDate", () => {
    const datePicker = mount(
      <DatePicker minDate={utils.newDate("2063-04-05")} />
    );
    expect(
      utils.formatDate(datePicker.state("preSelection"), "yyyy-MM-dd")
    ).to.equal("2063-04-05");
  });
  it("should default to the openToDate if there is one", () => {
    const datePicker = mount(
      <DatePicker openToDate={utils.newDate("2020-01-23")} />
    );
    expect(
      utils.formatDate(datePicker.state("preSelection"), "yyyy-MM-dd")
    ).to.equal("2020-01-23");
  });
  it("should otherwise default to the current date", () => {
    const datePicker = mount(<DatePicker />);
    expect(
      utils.formatDate(datePicker.state("preSelection"), "yyyy-MM-dd")
    ).to.equal(utils.formatDate(utils.newDate(), "yyyy-MM-dd"));
  });
  it("should support an initial null `selected` value in inline mode", () => {
    const datePicker = mount(<DatePicker inline selected={null} />);

    expect(() =>
      datePicker.setProps({ selected: utils.newDate() })
    ).to.not.throw();
  });
  it("should switch month in inline mode immediately", () => {
    const selected = utils.newDate();
    const future = utils.add(utils.newDate(), { days: 100 });
    const datePicker = mount(<DatePicker inline selected={selected} />);
    expect(
      utils.formatDate(datePicker.state("preSelection"), "yyyy-MM-dd")
    ).to.equal(utils.formatDate(selected, "yyyy-MM-dd"));
    datePicker.setProps({ selected: future });
    expect(
      utils.formatDate(datePicker.state("preSelection"), "yyyy-MM-dd")
    ).to.equal(utils.formatDate(future, "yyyy-MM-dd"));
  });
  it("should switch month in inline mode immediately, when year is updated", () => {
    const selected = utils.newDate();
    const future = utils.add(utils.newDate(), { years: 1 });
    const datePicker = mount(<DatePicker inline selected={selected} />);
    expect(
      utils.formatDate(datePicker.state("preSelection"), "yyyy-MM-dd")
    ).to.equal(utils.formatDate(selected, "yyyy-MM-dd"));
    datePicker.setProps({ selected: future });
    expect(
      utils.formatDate(datePicker.state("preSelection"), "yyyy-MM-dd")
    ).to.equal(utils.formatDate(future, "yyyy-MM-dd"));
  });
  it("should clear the input when clear() member function is called", () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker selected={utils.newDate("2015-12-15")} />
    );
    datePicker.clear();
    expect(datePicker.state.inputValue).to.be.null;
  });
  it("should not open when open is false and input is focused", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker open={false} />);
    var dateInput = datePicker.input;
    TestUtils.Simulate.focus(ReactDOM.findDOMNode(dateInput));
    expect(datePicker.calendar).to.not.exist;
  });
  it("should open when open is true", () => {
    var datePicker = TestUtils.renderIntoDocument(<DatePicker open />);
    expect(datePicker.calendar).to.exist;
  });
  it("should fire onInputClick when input is clicked", () => {
    const onInputClickSpy = sinon.spy();
    mount(<DatePicker onInputClick={onInputClickSpy} />)
      .find("input")
      .simulate("click");
    assert(onInputClickSpy.callCount, 1);
  });

  it("should set monthSelectedIn to 0 if monthsShown prop changes", () => {
    const datePicker = mount(<DatePicker monthsShown={2} inline />);
    datePicker.setState({ monthSelectedIn: 1 }, () => {
      assert.equal(datePicker.state("monthSelectedIn"), 1);
      datePicker.setProps({ monthsShown: 1 }, () => {
        assert.equal(datePicker.props().monthsShown, 1);
        setTimeout(() => {
          // Give setState in componentDidUpdate time to run
          assert.equal(datePicker.state("monthSelectedIn"), 0);
        }, 100);
      });
    });
  });

  it("should disable non-jumping if prop focusSelectedMonth is true", () => {
    var datePickerInline = TestUtils.renderIntoDocument(
      <DatePicker inline monthsShown={2} focusSelectedMonth />
    );
    var dayButtonInline = TestUtils.scryRenderedDOMComponentsWithClass(
      datePickerInline,
      "react-datepicker__day"
    )[40];
    TestUtils.Simulate.click(dayButtonInline);
    assert.equal(datePickerInline.state.monthSelectedIn, undefined);
  });

  it("should show the popper arrow", () => {
    const datePicker = TestUtils.renderIntoDocument(<DatePicker />);
    const dateInput = datePicker.input;
    TestUtils.Simulate.click(ReactDOM.findDOMNode(dateInput));

    const arrow = TestUtils.scryRenderedDOMComponentsWithClass(
      datePicker.calendar,
      "react-datepicker__triangle"
    );

    expect(arrow).to.not.be.empty;
  });

  it("should pass chooseDayAriaLabelPrefix prop to the correct child component", () => {
    const chooseDayAriaLabelPrefix = "My choose-day-prefix";
    const datePicker = mount(
      <DatePicker inline chooseDayAriaLabelPrefix={chooseDayAriaLabelPrefix} />
    );
    expect(
      datePicker.find(Day).first().prop("ariaLabelPrefixWhenEnabled")
    ).to.equal(chooseDayAriaLabelPrefix);
  });

  it("should pass disabledDayAriaLabelPrefix prop to the correct child component", () => {
    const disabledDayAriaLabelPrefix = "My disabled-day-prefix";
    const datePicker = mount(
      <DatePicker
        inline
        disabledDayAriaLabelPrefix={disabledDayAriaLabelPrefix}
      />
    );
    expect(
      datePicker.find(Day).first().prop("ariaLabelPrefixWhenDisabled")
    ).to.equal(disabledDayAriaLabelPrefix);
  });

  it("should pass weekAriaLabelPrefix prop to the correct child component", () => {
    const weekAriaLabelPrefix = "My week-prefix";
    const datePicker = mount(
      <DatePicker
        inline
        showWeekNumbers
        weekAriaLabelPrefix={weekAriaLabelPrefix}
      />
    );
    expect(
      datePicker.find(WeekNumber).first().prop("ariaLabelPrefix")
    ).to.equal(weekAriaLabelPrefix);
  });

  describe("selectsRange with inline", () => {
    it("should change dates of range when dates are empty", () => {
      const selected = utils.newDate();
      let startDate, endDate;
      const onChange = (dates = []) => {
        [startDate, endDate] = dates;
      };
      const datePicker = TestUtils.renderIntoDocument(
        <DatePicker
          selected={selected}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      );

      const days = TestUtils.scryRenderedComponentsWithType(datePicker, Day);
      const selectedDay = days.find(
        (d) =>
          utils.formatDate(d.props.day, "yyyy-MM-dd") ===
          utils.formatDate(selected, "yyyy-MM-dd")
      );
      TestUtils.Simulate.click(ReactDOM.findDOMNode(selectedDay));
      expect(utils.formatDate(startDate, "yyyy-MM-dd")).to.equal(
        utils.formatDate(selected, "yyyy-MM-dd")
      );
      expect(endDate).to.equal(null);
    });

    it("should change dates of range set endDate when startDate is set", () => {
      let startDate = utils.newDate();
      const nextDay = utils.add(startDate, { days: 1 });
      let endDate = null;
      const onChange = (dates = []) => {
        [startDate, endDate] = dates;
      };
      const datePicker = TestUtils.renderIntoDocument(
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      );
      const days = TestUtils.scryRenderedComponentsWithType(datePicker, Day);
      const selectedDay = days.find(
        (d) =>
          utils.formatDate(d.props.day, "yyyy-MM-dd") ===
          utils.formatDate(nextDay, "yyyy-MM-dd")
      );
      TestUtils.Simulate.click(ReactDOM.findDOMNode(selectedDay));
      expect(utils.formatDate(startDate, "yyyy-MM-dd")).to.equal(
        utils.formatDate(startDate, "yyyy-MM-dd")
      );
      expect(utils.formatDate(endDate, "yyyy-MM-dd")).to.equal(
        utils.formatDate(nextDay, "yyyy-MM-dd")
      );
    });

    it("should change dates of range set endDate null when range is filled", () => {
      const selected = utils.newDate();
      let [startDate, endDate] = [selected, selected];
      const onChange = (dates = []) => {
        [startDate, endDate] = dates;
      };
      let datePicker = TestUtils.renderIntoDocument(
        <DatePicker
          selected={selected}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      );

      let days = TestUtils.scryRenderedComponentsWithType(datePicker, Day);
      let selectedDay = days.find(
        (d) =>
          utils.formatDate(d.props.day, "yyyy-MM-dd") ===
          utils.formatDate(selected, "yyyy-MM-dd")
      );
      TestUtils.Simulate.click(ReactDOM.findDOMNode(selectedDay));
      expect(utils.formatDate(startDate, "yyyy-MM-dd")).to.equal(
        utils.formatDate(selected, "yyyy-MM-dd")
      );
      expect(endDate).to.equal(null);
    });

    it("should change dates of range change startDate when endDate set before startDate", () => {
      const selected = utils.newDate();
      const selectedPrevious = utils.add(utils.newDate(), { days: -3 });
      let [startDate, endDate] = [selected, null];
      const onChange = (dates = []) => {
        [startDate, endDate] = dates;
      };
      let datePicker = TestUtils.renderIntoDocument(
        <DatePicker
          selected={selected}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      );
      let days = TestUtils.scryRenderedComponentsWithType(datePicker, Day);
      const selectedDay = days.find(
        (d) =>
          utils.formatDate(d.props.day, "yyyy-MM-dd") ===
          utils.formatDate(selectedPrevious, "yyyy-MM-dd")
      );
      TestUtils.Simulate.click(ReactDOM.findDOMNode(selectedDay));
      expect(utils.formatDate(startDate, "yyyy-MM-dd")).to.equal(
        utils.formatDate(selectedPrevious, "yyyy-MM-dd")
      );
      expect(endDate).to.equal(null);
    });
  });

  describe("duplicate dates when multiple months", () => {
    it("should find duplicates at end on all months except last month", () => {
      const twoMonths = mount(<DatePicker monthsShown={2} />);
      twoMonths.find("input").simulate("click");
      const months = twoMonths.find(Month);
      expect(months).to.have.lengthOf(2);
      expect(months.first().props().monthShowsDuplicateDaysEnd).to.be.true;
      expect(months.last().props().monthShowsDuplicateDaysEnd).to.be.false;

      const moreThanTwoMonths = mount(<DatePicker monthsShown={4} />);
      moreThanTwoMonths.find("input").simulate("click");
      const monthsMore = moreThanTwoMonths.find(Month);
      expect(monthsMore).to.have.lengthOf(4);
      expect(monthsMore.first().props().monthShowsDuplicateDaysEnd).to.be.true;
      expect(monthsMore.get(1).props.monthShowsDuplicateDaysEnd).to.be.true;
      expect(monthsMore.get(2).props.monthShowsDuplicateDaysEnd).to.be.true;
      expect(monthsMore.last().props().monthShowsDuplicateDaysEnd).to.be.false;
    });

    it("should find duplicates at start on all months except first month", () => {
      const twoMonths = mount(<DatePicker monthsShown={2} />);
      twoMonths.find("input").simulate("click");
      const months = twoMonths.find(Month);
      expect(months).to.have.lengthOf(2);
      expect(months.first().props().monthShowsDuplicateDaysStart).to.be.false;
      expect(months.last().props().monthShowsDuplicateDaysStart).to.be.true;

      const moreThanTwoMonths = mount(<DatePicker monthsShown={4} />);
      moreThanTwoMonths.find("input").simulate("click");
      const monthsMore = moreThanTwoMonths.find(Month);
      expect(monthsMore).to.have.lengthOf(4);
      expect(monthsMore.first().props().monthShowsDuplicateDaysStart).to.be
        .false;
      expect(monthsMore.get(1).props.monthShowsDuplicateDaysStart).to.be.true;
      expect(monthsMore.get(2).props.monthShowsDuplicateDaysStart).to.be.true;
      expect(monthsMore.last().props().monthShowsDuplicateDaysStart).to.be.true;
    });

    it("should not find duplicates when single month displayed", () => {
      const datepicker = mount(<DatePicker />);
      datepicker.find("input").simulate("click");
      const months = datepicker.find(Month);
      expect(months).to.have.lengthOf(1);
      expect(months.first().props().monthShowsDuplicateDaysStart).to.be.false;
      expect(months.first().props().monthShowsDuplicateDaysEnd).to.be.false;
    });
  });
});
