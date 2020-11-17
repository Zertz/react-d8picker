import React from "react";
import Month from "../src/month";
import Day from "../src/day";
import range from "lodash/range";
import { mount, shallow } from "enzyme";
import * as utils from "../src/date_utils";
import TestUtils from "react-dom/test-utils";

describe("Month", () => {
  function assertDateRangeInclusive(month, start, end) {
    const dayCount = utils.getDaysDiff(end, start) + 1;
    const days = month.find(Day);
    expect(days).to.have.length(dayCount);
    range(0, dayCount).forEach((offset) => {
      const day = days.get(offset);
      const expectedDay = utils.add(start, { days: offset });
      assert(
        utils.isSameDay(day.props.day, expectedDay),
        `Day ${(offset % 7) + 1} ` +
          `of week ${Math.floor(offset / 7) + 1} ` +
          `should be "${utils.formatDate(expectedDay, "yyyy-MM-dd")}" ` +
          `but it is "${utils.formatDate(day.props.day, "yyyy-MM-dd")}"`
      );
    });
  }

  it("should have the month CSS class", () => {
    const month = shallow(<Month day={utils.newDate()} />);
    expect(month.hasClass("react-datepicker__month")).to.equal(true);
  });

  it("should have the month aria-label", () => {
    const dateString = "2015-12";
    const month = TestUtils.renderIntoDocument(
      <Month day={utils.newDate(`${dateString}-01`)} />
    );
    const month_dom = TestUtils.findRenderedDOMComponentWithClass(
      month,
      "react-datepicker__month"
    );
    expect(month_dom.getAttribute("aria-label")).to.contain(dateString);
  });

  it("should have an aria-label containing the provided prefix", () => {
    const ariaLabelPrefix = "A prefix in my native language";
    const shallowMonth = shallow(
      <Month ariaLabelPrefix={ariaLabelPrefix} day={utils.newDate()} />
    );
    expect(
      shallowMonth.html().indexOf(`aria-label="${ariaLabelPrefix}`)
    ).not.equal(-1);
  });

  it("should render all days of the month and some days in neighboring months", () => {
    const monthStart = utils.newDate("2015-12-01");

    assertDateRangeInclusive(
      mount(<Month day={monthStart} />),
      utils.getStartOfWeek(monthStart),
      utils.getEndOfWeek(utils.getEndOfMonth(monthStart))
    );
  });

  it("should render all days of the month and peek into the next month", () => {
    const monthStart = utils.newDate("2015-12-01");

    assertDateRangeInclusive(
      mount(<Month day={monthStart} peekNextMonth />),
      utils.getStartOfWeek(monthStart),
      utils.getEndOfWeek(
        utils.add(utils.add(monthStart, { months: 1 }), { weeks: 1 })
      )
    );
  });

  it("should call the provided onDayClick function", () => {
    let dayClicked = null;

    function onDayClick(day) {
      dayClicked = day;
    }

    const monthStart = utils.newDate("2015-12-01");
    const month = mount(<Month day={monthStart} onDayClick={onDayClick} />);
    const day = month.find(Day).at(0);

    day.simulate("click");
    assert(utils.isSameDay(day.prop("day"), dayClicked));
  });

  it("should call the provided onMouseLeave function", () => {
    let mouseLeaveCalled = false;

    function onMouseLeave() {
      mouseLeaveCalled = true;
    }

    const month = shallow(
      <Month day={utils.newDate()} onMouseLeave={onMouseLeave} />
    );
    month.simulate("mouseleave");
    expect(mouseLeaveCalled).to.be.true;
  });

  it("should call the provided onDayMouseEnter function", () => {
    let dayMouseEntered = null;

    function onDayMouseEnter(day) {
      dayMouseEntered = day;
    }

    const month = mount(
      <Month day={utils.newDate()} onDayMouseEnter={onDayMouseEnter} />
    );
    const day = month.find(Day).first();
    day.simulate("mouseenter");
    assert(utils.isSameDay(day.prop("day"), dayMouseEntered));
  });

  it("should use its month order in handleDayClick", () => {
    const order = 2;
    let orderValueMatched = false;

    function onDayClick(day, event, monthSelectedIn) {
      orderValueMatched = monthSelectedIn === order;
    }

    const month = mount(
      <Month
        day={utils.newDate()}
        orderInDisplay={order}
        onDayClick={onDayClick}
      />
    );
    const day = month.find(Day).at(0);

    day.simulate("click");
    expect(orderValueMatched).to.be.true;
  });
});
