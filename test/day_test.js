import React from "react";
import Day from "../src/day";
import { mount, shallow } from "enzyme";
import defer from "lodash/defer";
import sinon from "sinon";
import {
  getDayOfWeekCode,
  newDate,
  getDate,
  add,
  getMonth,
  getHightLightDaysMap,
} from "../src/date_utils";

function renderDay(day, props = {}) {
  return shallow(<Day day={day} {...props} />);
}

describe("Day", () => {
  describe("rendering", () => {
    it("should render the specified day", () => {
      const day = newDate();
      const shallowDay = renderDay(day);
      expect(shallowDay.hasClass("react-datepicker__day")).to.equal(true);
      expect(shallowDay.text()).to.equal(getDate(day) + "");
    });

    it("should apply the day of week class", () => {
      let day = newDate();
      for (var i = 0; i < 7; i++) {
        const className = "react-datepicker__day--" + getDayOfWeekCode(day);
        const shallowDay = renderDay(day);
        expect(shallowDay.hasClass(className)).to.equal(true);
        day = add(day, { days: 1 });
      }
    });

    it("should render custom day contents", () => {
      const day = newDate();

      const shallowDay = renderDay(day, {
        // eslint-disable-next-line react/prop-types
        renderDay: function renderFn({ day, setRef, ...props }) {
          const tooltipText = `Tooltip for date: ${day}`;

          return (
            <span {...props} ref={setRef} title={tooltipText}>
              {getDate(day)}
            </span>
          );
        },
      });

      expect(shallowDay.find("span"));
    });
  });

  describe("selected", () => {
    const className = "react-datepicker__day--selected";

    it("should apply the selected class if selected", () => {
      const day = newDate();
      const shallowDay = renderDay(day, { selected: day });
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should not apply the selected class if not selected", () => {
      const day = newDate();
      const selected = add(day, { days: 1 });
      const shallowDay = renderDay(day, { selected });
      expect(shallowDay.hasClass(className)).to.equal(false);
    });
  });

  describe("keyboard-selected", () => {
    const className = "react-datepicker__day--keyboard-selected";

    it("should apply the keyboard-selected class when pre-selected and another day is selected", () => {
      const day = newDate();
      const selected = add(day, { days: 1 });
      const shallowDay = renderDay(day, { selected, preSelection: day });
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should not apply the keyboard-selected class when selected", () => {
      const day = newDate();
      const shallowDay = renderDay(day, { selected: day, preSelection: day });
      expect(shallowDay.hasClass(className)).to.equal(false);
    });

    it("should not apply the keyboard-selected class when another day is pre-selected", () => {
      const day = newDate();
      const selected = add(day, { days: 1 });
      const preSelection = add(day, { days: 2 });
      const shallowDay = renderDay(day, { selected, preSelection });
      expect(shallowDay.hasClass(className)).to.equal(false);
    });

    it("should apply the keyboard-selected class if in inline mode", () => {
      const day = newDate();
      const selected = add(day, { days: 1 });
      const shallowDay = renderDay(day, {
        selected,
        preSelection: day,
        inline: true,
      });
      expect(shallowDay.hasClass(className)).to.equal(true);
    });
  });

  describe("highlighted", () => {
    const className = "react-datepicker__day--highlighted";

    it("should apply the highlighted class if in highlighted array", () => {
      const day = newDate();
      const highlightDay1 = newDate(day);
      const highlightDay2 = add(day, { days: 1 });
      const highlightDates = [highlightDay1, highlightDay2];
      const highlightDatesMap = getHightLightDaysMap(highlightDates);
      const shallowDay = renderDay(day, { highlightDates: highlightDatesMap });
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should not apply the highlighted class if not in highlighted array", () => {
      const day = newDate();
      const highlightDay1 = add(day, { days: -1 });
      const highlightDay2 = add(day, { days: 1 });
      const highlightDates = [highlightDay1, highlightDay2];
      const highlightDatesMap = getHightLightDaysMap(highlightDates);
      const shallowDay = renderDay(day, { highlightDates: highlightDatesMap });
      expect(shallowDay.hasClass(className)).to.equal(false);
    });

    describe("prop is an array of objects with class name as a key and array of moments as a value", () => {
      it("should apply the highlighted class if in highlighted", () => {
        const day = newDate();
        const highlightDay1 = {
          testClassName: [add(day, { days: 1 }), newDate(day)],
        };
        const highlightDay2 = add(day, { days: 2 });
        const highlightDay3 = add(day, { days: 3 });
        const highlightDates = [highlightDay1, highlightDay2, highlightDay3];
        const highlightDatesMap = getHightLightDaysMap(highlightDates);
        const shallowDay = renderDay(day, {
          highlightDates: highlightDatesMap,
        });
        expect(shallowDay.hasClass("testClassName")).to.equal(true);
      });

      it("should not apply the highlighted class if not in highlighted array", () => {
        const day = newDate();
        const highlightDay1 = {
          testClassName: [add(day, { days: 1 }), add(day, { days: 2 })],
        };
        const highlightDay2 = add(day, { days: 3 });
        const highlightDay3 = add(day, { days: 4 });
        const highlightDates = [highlightDay1, highlightDay2, highlightDay3];
        const highlightDatesMap = getHightLightDaysMap(highlightDates);
        const shallowDay = renderDay(day, {
          highlightDates: highlightDatesMap,
        });
        expect(shallowDay.hasClass("testClassName")).to.equal(false);
      });

      it("should apply the highlighted classes even if the same day in highlighted array", () => {
        const day = newDate();
        const highlightDay1 = { fooClassName: [newDate(day)] };
        const highlightDay2 = { barClassName: [newDate(day)] };
        const highlightDay3 = newDate(day);
        const highlightDates = [highlightDay1, highlightDay2, highlightDay3];
        const highlightDatesMap = getHightLightDaysMap(highlightDates);
        const shallowDay = renderDay(day, {
          highlightDates: highlightDatesMap,
        });
        expect(shallowDay.hasClass("fooClassName")).to.equal(true);
        expect(shallowDay.hasClass("barClassName")).to.equal(true);
        expect(shallowDay.hasClass(className)).to.equal(true);
      });
    });
  });

  describe("in range", () => {
    const className = "react-datepicker__day--in-range";

    it("should apply the in-range class if in range", () => {
      const day = newDate();
      const startDate = add(day, { days: -1 });
      const endDate = add(day, { days: 1 });
      const shallowDay = renderDay(day, { startDate, endDate });
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should not apply the in-range class if not in range", () => {
      const day = newDate();
      const startDate = add(day, { days: 1 });
      const endDate = add(day, { days: 2 });
      const shallowDay = renderDay(day, { startDate, endDate });
      expect(shallowDay.hasClass(className)).to.equal(false);
    });

    it("should apply the in-range class if equal to start date", () => {
      const day = newDate();
      const startDate = newDate(day);
      const endDate = add(day, { days: 1 });
      const shallowDay = renderDay(day, { startDate, endDate });
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should apply the in-range class if equal to end date", () => {
      const day = newDate();
      const startDate = add(day, { days: -1 });
      const endDate = newDate(day);
      const shallowDay = renderDay(day, { startDate, endDate });
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should not apply the in-range class if start date missing", () => {
      const day = newDate();
      const startDate = add(day, { days: -1 });
      const shallowDay = renderDay(day, { startDate });
      expect(shallowDay.hasClass(className)).to.equal(false);
    });

    it("should not apply the in-range class if end date missing", () => {
      const day = newDate();
      const endDate = add(day, { days: 1 });
      const shallowDay = renderDay(day, { endDate });
      expect(shallowDay.hasClass(className)).to.equal(false);
    });
  });

  describe("today", () => {
    const className = "react-datepicker__day--today";

    it("should apply the today class if today", () => {
      const shallowDay = renderDay(newDate());
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should not apply the today class if not today", () => {
      const shallowDay = renderDay(add(newDate(), { days: 1 }));
      expect(shallowDay.hasClass(className)).to.equal(false);
    });
  });

  describe("weekend", () => {
    const className = "react-datepicker__day--weekend";

    it("should apply the weekend class if Saturday", () => {
      const shallowDay = renderDay(newDate("2015-12-19"));
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should apply the weekend class if Sunday", () => {
      const shallowDay = renderDay(newDate("2015-12-20"));
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should not apply the today class if not the weekend", () => {
      const shallowDay = renderDay(newDate("2015-12-21"));
      expect(shallowDay.hasClass(className)).to.equal(false);
    });
  });

  describe("outside month", () => {
    const className = "react-datepicker__day--outside-month";

    it("should not apply the outside-month class if in same month", () => {
      const day = newDate();
      const shallowDay = renderDay(day, { month: getMonth(day) });
      expect(shallowDay.hasClass(className)).to.equal(false);
    });

    it("should apply the outside-month class if not in same month", () => {
      const day = newDate();
      const shallowDay = renderDay(day, { month: getMonth(day) + 1 });
      expect(shallowDay.hasClass(className)).to.equal(true);
    });

    it("should hide days outside month at end when duplicates", () => {
      const day = newDate("2020-12-02");
      const wrapper = mount(
        <Day day={day} month={getMonth(day) - 1} monthShowsDuplicateDaysEnd />
      );
      expect(wrapper.text()).to.be.empty;
    });

    it("should show days outside month at end when not duplicates", () => {
      const day = newDate("2020-12-02");
      const wrapper = mount(<Day day={day} month={getMonth(day) - 1} />);
      expect(wrapper.text()).to.equal(day.getDate().toString());
    });

    it("should hide days outside month at start when duplicates", () => {
      const day = newDate("2020-10-30");
      const wrapper = mount(
        <Day day={day} month={getMonth(day) + 1} monthShowsDuplicateDaysStart />
      );
      expect(wrapper.text()).to.be.empty;
    });

    it("should show days outside month at start when not duplicates", () => {
      const day = newDate("2020-10-30");
      const wrapper = mount(<Day day={day} month={getMonth(day) + 1} />);
      expect(wrapper.text()).to.equal(day.getDate().toString());
    });

    it("should show days in month when duplicates at start/end", () => {
      const day = newDate("2020-11-15");
      const wrapper = mount(
        <Day
          day={day}
          month={getMonth(day)}
          monthShowsDuplicateDaysStart
          monthShowsDuplicateDaysEnd
        />
      );
      expect(wrapper.text()).to.equal(day.getDate().toString());
    });
  });

  describe("disabled", () => {
    const className = "react-datepicker__day--disabled";

    it("should be enabled if date is enabled", () => {
      const shallowDay = renderDay(newDate());
      expect(shallowDay.hasClass(className)).to.equal(false);
    });

    it("should have aria-disabled attribute with false value if date is not disabled", () => {
      const shallowDay = renderDay(newDate());
      expect(shallowDay.prop("aria-disabled")).to.equal(false);
    });
  });

  describe("aria-label", () => {
    const ariaLabelPrefixWhenEnabled =
      "A prefix in my native language desbribing that the date can be selected";

    it("should have the correct provided prefix if date is not disabled", () => {
      const shallowDay = renderDay(newDate(), {
        ariaLabelPrefixWhenEnabled: ariaLabelPrefixWhenEnabled,
      });
      expect(
        shallowDay.html().indexOf(`aria-label="${ariaLabelPrefixWhenEnabled}`)
      ).not.equal(-1);
    });
  });

  describe("click", () => {
    it("should call onClick if day is enabled", () => {
      let onClickCalled = false;

      function onClick() {
        onClickCalled = true;
      }

      const day = newDate();
      const dayNode = shallow(<Day day={day} onClick={onClick} />);
      dayNode
        .find(".react-datepicker__day")
        .simulate("click", { persist: () => {} });
      expect(onClickCalled).to.be.true;
    });
  });

  describe("for a start date picker with selectsRange prop", () => {
    const rangeDayClassName = "react-datepicker__day--in-selecting-range";
    const rangeSetDayClassName = "react-datepicker__day--in-range";
    const rangeDayStartClassName = "react-datepicker__day--range-start";
    const rangeDayEndClassName = "react-datepicker__day--range-end";

    function createDateRange(beforeDays, afterDays, day = newDate()) {
      return {
        startDate: add(day, { days: beforeDays * -1 }),
        endDate: add(day, { days: afterDays }),
        day,
      };
    }

    it("should highlight for dates before the selecting date", () => {
      const { startDate } = createDateRange(-1, 1);

      // All these should highlight: today, yesterday (startDate), the day before
      for (let daysAfterStart = 1; daysAfterStart <= 3; daysAfterStart++) {
        const selectingDate = add(startDate, { days: daysAfterStart });
        const shallowDay = renderDay(selectingDate, {
          startDate,
          selectingDate,
          selectsRange: true,
        });
        expect(shallowDay.hasClass(rangeDayClassName)).to.be.true;
      }
    });

    it("should not highlight for days before the start date", () => {
      const startDate = newDate();
      const selectingDate = add(startDate, { days: -1 });
      const shallowDay = renderDay(selectingDate, {
        startDate,
        selectingDate,
        selectsRange: true,
      });
      expect(shallowDay.hasClass(rangeDayClassName)).to.be.false;
    });

    it("should have a class if it is a start or end date", () => {
      const startDate = newDate();
      const midRangeDate = add(startDate, { days: 1 });
      const endDate = add(startDate, { days: 2 });

      const shallowStartDay = renderDay(startDate, {
        startDate,
        endDate,
        selectsRange: true,
      });
      expect(shallowStartDay.hasClass(rangeDayStartClassName)).to.be.true;

      const shallowMidRangeDay = renderDay(midRangeDate, {
        startDate,
        endDate,
        selectsRange: true,
      });
      expect(shallowMidRangeDay.hasClass(rangeDayStartClassName)).to.be.false;
      expect(shallowMidRangeDay.hasClass(rangeSetDayClassName)).to.be.true;
      expect(shallowMidRangeDay.hasClass(rangeDayEndClassName)).to.be.false;

      const shallowEndDay = renderDay(endDate, {
        startDate,
        endDate,
        selectsRange: true,
      });
      expect(shallowEndDay.hasClass(rangeDayEndClassName)).to.be.true;
    });

    it("should not highlight for days after the end date", () => {
      const { day, startDate, endDate } = createDateRange(-1, 1);
      const selectingDate = add(endDate, { days: 1 });
      const shallowDay = renderDay(day, {
        startDate,
        endDate,
        selectingDate,
        selectsRange: true,
      });
      expect(shallowDay.hasClass(rangeDayClassName)).to.be.false;
    });

    it("should not highlight if there is no end date selected", () => {
      const startDate = newDate();
      const selectingDate = add(startDate, { days: -1 });
      const shallowDay = renderDay(selectingDate, {
        startDate,
        selectingDate,
        selectsRange: true,
      });
      expect(shallowDay.hasClass(rangeDayClassName)).to.be.false;
    });
  });

  describe("focus", () => {
    let sandbox;
    beforeEach(function () {
      sandbox = sinon.createSandbox();
    });
    afterEach(function () {
      sandbox.restore();
    });

    it("should apply focus to the preselected day", () => {
      const day = newDate();
      const dayInstance = mount(
        <Day day={day} preSelection={day} />
      ).instance();

      sandbox.spy(dayInstance.dayEl, "focus");
      dayInstance.componentDidMount();
      defer(() => {
        expect(dayInstance.dayEl.focus.calledOnce).to.equal(true);
        // eslint-disable-next-line no-undef
        done();
      });
    });

    it("should not apply focus to the preselected day if inline", () => {
      const day = newDate();
      const dayInstance = mount(
        <Day day={day} preSelection={day} inline />
      ).instance();

      sandbox.spy(dayInstance.dayEl, "focus");
      dayInstance.componentDidMount();
      defer(() => {
        expect(dayInstance.dayEl.focus.calledOnce).to.equal(false);
        // eslint-disable-next-line no-undef
        done();
      });
    });
  });
});
