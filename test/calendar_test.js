import React from "react";
import Calendar from "../src/calendar";
import Month from "../src/month";
import Day from "../src/day";
import { shallow, mount } from "enzyme";
import sinon from "sinon";
import * as utils from "../src/date_utils";
import enUS from "date-fns/locale/en-US";
import eo from "date-fns/locale/eo";
import fi from "date-fns/locale/fi";

// TODO Possibly rename
const DATE_FORMAT = "MM/dd/yyyy";

describe("Calendar", function () {
  const dateFormat = "MMMM yyyy";

  function getCalendar(extraProps) {
    return shallow(
      <Calendar
        dateFormat={dateFormat}
        onSelect={() => {}}
        onClickOutside={() => {}}
        hideCalendar={() => {}}
        {...extraProps}
      />
    );
  }

  it("should start with the current date in view if no date range", function () {
    const now = utils.newDate();
    const calendar = getCalendar();
    assert(utils.isSameDay(calendar.state().date, now));
  });

  it("should start with the selected date in view if provided", function () {
    const selected = utils.add(utils.newDate(), { years: 1 });
    const calendar = getCalendar({ selected });
    assert(utils.isSameDay(calendar.state().date, selected));
  });

  it("should start with the pre-selected date in view if provided", function () {
    const preSelected = utils.add(utils.newDate(), { years: 2 });
    const selected = utils.add(utils.newDate(), { years: 1 });
    const calendar = getCalendar({ preSelected, selected });
    assert(utils.isSameDay(calendar.state().date, selected));
  });

  it("should start with the current date in view if in date range", function () {
    const now = utils.newDate();
    const minDate = utils.add(now, { years: -1 });
    const maxDate = utils.add(now, { years: 1 });
    const calendar = getCalendar({ minDate, maxDate });
    assert(utils.isSameDay(calendar.state().date, now));
  });

  it("should start with the min date in view if after the current date", function () {
    const minDate = utils.add(utils.newDate(), { years: 1 });
    const calendar = getCalendar({ minDate });
    assert(utils.isSameDay(calendar.state().date, minDate));
  });

  it("should start with the max date in view if before the current date", function () {
    const maxDate = utils.add(utils.newDate(), { years: -1 });
    const calendar = getCalendar({ maxDate });
    assert(utils.isSameDay(calendar.state().date, maxDate));
  });

  it("should start with the open to date in view if given and no selected/min/max dates given", function () {
    const openToDate = utils.parseDate("09/28/1993", DATE_FORMAT);
    const calendar = getCalendar({ openToDate });
    assert(utils.isSameDay(calendar.state().date, openToDate));
  });

  it("should start with the open to date in view if given and after a min date", function () {
    const openToDate = utils.parseDate("09/28/1993", DATE_FORMAT);
    const minDate = utils.parseDate("01/01/1993", DATE_FORMAT);
    const calendar = getCalendar({ openToDate, minDate });
    assert(utils.isSameDay(calendar.state().date, openToDate));
  });

  it("should start with the open to date in view if given and before a max date", function () {
    const openToDate = utils.parseDate("09/28/1993", DATE_FORMAT);
    const maxDate = utils.parseDate("12/31/1993", DATE_FORMAT);
    const calendar = getCalendar({ openToDate, maxDate });
    assert(utils.isSameDay(calendar.state().date, openToDate));
  });

  it("should start with the open to date in view if given and in range of the min/max dates", function () {
    const openToDate = utils.parseDate("09/28/1993", DATE_FORMAT);
    const minDate = utils.parseDate("01/01/1993", DATE_FORMAT);
    const maxDate = utils.parseDate("12/31/1993", DATE_FORMAT);
    const calendar = getCalendar({ openToDate, minDate, maxDate });
    assert(utils.isSameDay(calendar.state().date, openToDate));
  });

  it("should open on openToDate date rather than selected date when both are specified", function () {
    var openToDate = utils.parseDate("09/28/1993", DATE_FORMAT);
    var selected = utils.parseDate("09/28/1995", DATE_FORMAT);
    var calendar = getCalendar({ openToDate, selected });
    assert(utils.isSameDay(calendar.state().date, openToDate));
  });

  it("should trigger date change when openToDate prop is set after calcInitialState()", () => {
    const openToDate = utils.parseDate("09/28/1993", DATE_FORMAT);
    const oneMonthFromOpenToDate = utils.parseDate("10/28/1993", DATE_FORMAT);
    const calendar = getCalendar({ openToDate });

    assert(utils.isSameDay(calendar.state().date, openToDate));
    calendar.setProps({ openToDate: oneMonthFromOpenToDate });
    assert(utils.isSameDay(calendar.state().date, oneMonthFromOpenToDate));
  });

  it("should correctly format weekday using formatWeekDay prop", function () {
    const calendar = getCalendar({ formatWeekDay: (day) => day[0] });
    calendar
      .find(".react-datepicker__day-name")
      .forEach((dayName) => expect(dayName.text()).to.have.length(1));
  });

  it("should render the months correctly adjusted by monthSelectedIn", () => {
    const selected = utils.newDate("2018-11-19");
    const calendar = getCalendar({ inline: true, monthsShown: 2, selected });
    calendar.setProps({ monthSelectedIn: 1 }, () => {
      const renderedMonths = calendar.find(Month);
      assert.equal(utils.getMonth(renderedMonths.first().prop("day")), 9);
    });
  });

  describe("custom header", function () {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const renderCustomHeader = (params) => {
      const {
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      } = params;

      return (
        <div className="custom-header">
          <button
            className="prevMonth"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
          >
            {"<"}
          </button>

          <select
            value={utils.getYear(date)}
            className="year-select"
            onChange={({ target: { value } }) => changeYear(value)}
          >
            {[2017, 2018, 2019].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            className="month-select"
            value={months[utils.getMonth(date)]}
            onChange={({ target: { value } }) => changeMonth(value)}
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="nextMonth"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
          >
            {"<"}
          </button>
        </div>
      );
    };

    it("should call render custom header function and returns parameters", function () {
      const renderCustomHeader = sinon.spy();

      getCalendar({ renderCustomHeader });

      const match = {
        changeMonth: sinon.match.func,
        changeYear: sinon.match.func,
        date: sinon.match.instanceOf(Date),
        decreaseMonth: sinon.match.func,
        increaseMonth: sinon.match.func,
        nextMonthButtonDisabled: sinon.match.bool,
        prevMonthButtonDisabled: sinon.match.bool,
      };

      expect(renderCustomHeader.calledWithMatch(match)).to.be.true;
    });

    it("should render custom header with selects and buttons", function () {
      const calendar = getCalendar({
        renderCustomHeader,
      });

      expect(calendar.find(".react-datepicker__header--custom")).to.have.length(
        1
      );
      expect(calendar.find(".custom-header")).to.have.length(1);

      const yearSelect = calendar.find(".year-select");
      const monthSelect = calendar.find(".month-select");
      const prevMonth = calendar.find(".prevMonth");
      const nextMonth = calendar.find(".nextMonth");

      expect(yearSelect).to.have.length(1);
      expect(monthSelect).to.have.length(1);
      expect(prevMonth).to.have.length(1);
      expect(nextMonth).to.have.length(1);
    });

    it("should render day names with renderCustomHeader", function () {
      const calendar = getCalendar({
        renderCustomHeader,
      });

      expect(calendar.find(".react-datepicker__header--custom")).to.have.length(
        1
      );

      expect(calendar.find(".react-datepicker__day-names")).to.have.length(1);
    });

    it("should go to previous month", function () {
      const calendar = getCalendar({
        renderCustomHeader,
      });

      const selected = utils.newDate(calendar.state().date);
      const prevMonth = calendar.find(".prevMonth");

      prevMonth.simulate("click");

      expect(utils.getMonth(selected)).to.be.equal(
        (utils.getMonth(calendar.state().date) + 1) % 12
      );
    });

    it("should go to next month", function () {
      const calendar = getCalendar({
        renderCustomHeader,
      });

      const selected = utils.newDate(calendar.state().date);
      const nextMonth = calendar.find(".nextMonth");

      nextMonth.simulate("click");

      const newMonth = utils.getMonth(calendar.state().date) - 1;

      const resultMonth = newMonth === -1 ? 11 : newMonth;

      expect(utils.getMonth(selected)).to.be.equal(resultMonth);
    });

    it("nextMonthButtonDisabled flag should be true", function () {
      const renderCustomHeader = sinon.spy();

      getCalendar({
        renderCustomHeader,
        minDate: utils.add(utils.newDate(), { months: -1 }),
        maxDate: utils.newDate(),
      });

      const {
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      } = renderCustomHeader.getCall(0).args[0];

      assert(
        prevMonthButtonDisabled === false,
        "prevMonthButtonDisabled should be set to false"
      );
      assert(
        nextMonthButtonDisabled === true,
        "nextMonthButtonDisabled  should be set to true"
      );
    });

    it("prevMonthButtonDisabled flag should be true", function () {
      const renderCustomHeader = sinon.spy();

      getCalendar({
        renderCustomHeader,
        minDate: utils.newDate(),
        maxDate: utils.add(utils.newDate(), { months: 1 }),
      });

      const {
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      } = renderCustomHeader.getCall(0).args[0];

      assert(
        prevMonthButtonDisabled === true,
        "prevMonthButtonDisabled should be set to true"
      );
      assert(
        nextMonthButtonDisabled === false,
        "nextMonthButtonDisabled  should be set to false"
      );
    });

    it("should select april from month select", function () {
      const calendar = getCalendar({
        renderCustomHeader,
      });

      const monthSelect = calendar.find(".month-select");

      monthSelect.simulate("change", { target: { value: 4 } });

      const selected = utils.newDate(calendar.state().date);

      expect(utils.getMonth(selected)).to.be.equal(4);
    });

    it("should select 2017 from month select", function () {
      const calendar = getCalendar({
        renderCustomHeader,
      });

      const yearSelect = calendar.find(".year-select");

      yearSelect.simulate("change", { target: { value: 2017 } });

      const selected = utils.newDate(calendar.state().date);

      expect(utils.getYear(selected)).to.be.equal(2017);
    });
  });

  it("should use a hash for week label if weekLabel is NOT provided", () => {
    const calendar = getCalendar({ showWeekNumbers: true });
    const weekLabel = calendar.find(".react-datepicker__day-name");
    expect(weekLabel.at(0).text()).to.equal("#");
  });

  it("should set custom week label if weekLabel is provided", () => {
    const calendar = getCalendar({ showWeekNumbers: true, weekLabel: "Foo" });
    const weekLabel = calendar.find(".react-datepicker__day-name");
    expect(weekLabel.at(0).text()).to.equal("Foo");
  });

  it("should track the currently hovered day", () => {
    const calendar = mount(
      <Calendar
        dateFormat={dateFormat}
        onClickOutside={() => {}}
        onSelect={() => {}}
      />
    );
    const day = calendar.find(Day).first();
    day.simulate("mouseenter");
    const month = calendar.find(Month).first();
    expect(month.prop("selectingDate")).to.exist;
    expect(utils.isSameDay(month.prop("selectingDate"), day.prop("day"))).to.be
      .true;
  });

  it("should clear the hovered day when the mouse leaves", () => {
    const calendar = mount(
      <Calendar
        dateFormat={dateFormat}
        onClickOutside={() => {}}
        onSelect={() => {}}
      />
    );
    calendar.setState({ selectingDate: utils.newDate() });
    const month = calendar.find(Month).first();
    expect(month.prop("selectingDate")).to.exist;
    month.simulate("mouseleave");
    calendar.update();
    expect(calendar.find(Month).first().prop("selectingDate")).not.to.exist;
  });

  it("uses weekdaysShort instead of weekdaysMin provided useWeekdaysShort prop is present", () => {
    const calendarShort = mount(
      <Calendar
        dateFormat={dateFormat}
        onClickOutside={() => {}}
        onSelect={() => {}}
        useWeekdaysShort
      />
    );
    const calendarMin = mount(
      <Calendar
        dateFormat={dateFormat}
        onClickOutside={() => {}}
        onSelect={() => {}}
      />
    );

    const daysNamesShort = calendarShort.find(".react-datepicker__day-name");
    expect(daysNamesShort.at(0).text()).to.equal("Sun");
    expect(daysNamesShort.at(6).text()).to.equal("Sat");

    const daysNamesMin = calendarMin.find(".react-datepicker__day-name");
    expect(daysNamesMin.at(0).text()).to.equal("Su");
    expect(daysNamesMin.at(6).text()).to.equal("Sa");
  });

  describe("localization", function () {
    function testLocale(calendar, selected, locale) {
      const firstDateOfWeek = utils.getStartOfWeek(selected, locale);
      const firstWeekDayMin = utils.getWeekdayMinInLocale(
        firstDateOfWeek,
        locale
      );
      const firstHeader = calendar.find(".react-datepicker__day-name").at(0);
      expect(firstHeader.text()).to.equal(firstWeekDayMin);
    }

    it("should use the 'en-US' locale by default", function () {
      const selected = utils.newDate();
      const calendar = getCalendar({ selected });
      testLocale(calendar, selected);
    });

    it("should use the default locale when set", function () {
      const selected = utils.newDate();
      utils.setDefaultLocale(fi);

      const calendar = getCalendar({ selected });
      testLocale(calendar, selected, fi);
      utils.setDefaultLocale();
    });

    it("should use the locale specified as a prop", function () {
      const locale = fi;
      const selected = utils.newDate();
      const calendar = getCalendar({ selected, locale });
      testLocale(calendar, selected, locale);
    });

    it("should override the default locale with the locale prop", function () {
      const locale = enUS;
      const selected = utils.newDate();
      utils.setDefaultLocale(fi);

      const calendar = getCalendar({ selected, locale });
      testLocale(calendar, selected, locale);
      utils.setDefaultLocale();
    });

    it("should accept a raw date-fns locale object", function () {
      const locale = eo;
      const selected = utils.newDate();

      const calendar = getCalendar({ selected, locale });
      testLocale(calendar, selected, locale);
    });

    it("should render empty custom header", function () {
      const calendar = getCalendar({ renderCustomHeader: () => {} });

      const header = calendar.find(".react-datepicker__header--custom");
      expect(header).to.have.length(1);
    });
  });

  describe("using click outside", () => {
    const clickOutsideSpy = sinon.spy();
    const calendar = mount(
      <Calendar
        dateFormat={DATE_FORMAT}
        onSelect={() => {}}
        onClickOutside={clickOutsideSpy}
      />
    );

    const instance = calendar.instance();

    it("calls onClickOutside prop when handles click outside", () => {
      instance.handleClickOutside("__event__");

      assert(clickOutsideSpy.calledWith("__event__"));
    });

    it("setClickOutsideRef function returns container ref", () => {
      const ref = instance.setClickOutsideRef();

      assert.isNotNull(ref);
      assert.equal(ref, instance.containerRef.current);
    });
  });

  describe("showTimeSelect", () => {
    it("should not contain the time select classname in header by default", () => {
      const calendar = getCalendar();
      const header = calendar.find(
        ".react-datepicker__header--has-time-select"
      );
      expect(header).to.have.length(0);
    });

    it("should contain the time select classname in header if enabled", () => {
      const calendar = getCalendar({ showTimeSelect: true });
      const header = calendar.find(
        ".react-datepicker__header--has-time-select"
      );
      expect(header).to.have.length(1);
    });
  });
});
