import React from "react";
import hljs from "highlight.js/lib/core";
import hljsJavaScriptLanguage from "highlight.js/lib/languages/javascript";
import slugify from "slugify";
import CodeExampleComponent from "../Example";

import Default from "../../examples/default";
import ShowTime from "../../examples/showTime";
import ShowTimeOnly from "../../examples/showTimeOnly";
import InjectTimes from "../../examples/injectTimes";
import FilterTimes from "../../examples/filterTimes";
import ExcludeTimePeriod from "../../examples/excludeTimePeriod";
import CustomDateFormat from "../../examples/customDateFormat";
import CustomClassName from "../../examples/customClassName";
import PlaceholderText from "../../examples/placeholderText";
import SpecificDateRange from "../../examples/specificDateRange";
import LocaleWithoutGlobalVariable from "../../examples/localeWithoutGlobalVariable";
import HighlightDates from "../../examples/highlightDates";
import HighlightDatesRanges from "../../examples/highlightDatesRanges";
import FilterDates from "../../examples/filterDates";
import Disabled from "../../examples/disabled";
import ReadOnly from "../../examples/readOnly";
import OnBlurCallbacks from "../../examples/onBlurCallbacks";
import ConfigurePopper from "../../examples/configurePopper";
import TabIndex from "../../examples/tabIndex";
import Inline from "../../examples/inline";
import OpenToDate from "../../examples/openToDate";
import WeekNumbers from "../../examples/weekNumbers";
import MultiMonth from "../../examples/multiMonth";
import MultiMonthPrevious from "../../examples/multiMonthPrevious";
import Children from "../../examples/children";
import RenderCustomHeader from "../../examples/renderCustomHeader";
import RenderCustomDay from "../../examples/renderCustomDay";
import SelectsRange from "../../examples/selectsRange";
import SelectsRangeMultiMonth from "../../examples/selectsRangeMultiMonth";

import "./style.scss";
import "react-d8picker/dist/react-d8picker.css";

export default class exampleComponents extends React.Component {
  componentDidMount() {
    hljs.initHighlightingOnLoad();
    hljs.registerLanguage("javascript", hljsJavaScriptLanguage);
  }

  examples = [
    {
      title: "Default",
      component: Default,
    },
    {
      title: "Children",
      component: Children,
    },
    {
      title: "Configure Popper Properties",
      component: ConfigurePopper,
      description: (
        <div>
          Full docs for the popper can be found at{" "}
          <a
            href="https://popper.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            popper.js.org
          </a>
        </div>
      ),
    },
    {
      title: "Custom header",
      component: RenderCustomHeader,
    },
    {
      title: "Custom Day",
      component: RenderCustomDay,
    },
    {
      title: "Custom class name",
      component: CustomClassName,
    },
    {
      title: "Custom date format",
      component: CustomDateFormat,
    },
    {
      title: "Date range for one datepicker",
      component: SelectsRange,
    },
    {
      title: "Date range for one datepicker with multiple months",
      component: SelectsRangeMultiMonth,
    },
    {
      title: "Disable datepicker",
      component: Disabled,
    },
    {
      title: "Display Week Numbers",
      component: WeekNumbers,
    },
    {
      title: "Filter dates",
      component: FilterDates,
    },
    {
      title: "Filter times",
      component: FilterTimes,
    },
    {
      title: "Highlight dates",
      component: HighlightDates,
    },
    {
      title: "Highlight dates with custom class names and ranges",
      component: HighlightDatesRanges,
    },
    {
      title: "Inject Specific Times",
      component: InjectTimes,
    },
    {
      title: "Inline version",
      component: Inline,
    },
    {
      title: "Locale without global variables",
      component: LocaleWithoutGlobalVariable,
    },
    {
      title: "Multiple months",
      component: MultiMonth,
    },
    {
      title: "onBlur callbacks in console",
      component: OnBlurCallbacks,
    },
    {
      title: "Open to date",
      component: OpenToDate,
    },
    {
      title: "Placeholder text",
      component: PlaceholderText,
    },
    {
      title: "Read only datepicker",
      component: ReadOnly,
    },
    {
      title: "Select Time",
      component: ShowTime,
    },
    {
      title: "Select Time Only",
      component: ShowTimeOnly,
    },
    {
      title: "Show previous months",
      component: MultiMonthPrevious,
    },
    {
      title: "Specific date range",
      component: SpecificDateRange,
    },
    {
      title: "Specific Time Range",
      component: ExcludeTimePeriod,
    },
    {
      title: "TabIndex",
      component: TabIndex,
    },
  ];

  handleAnchorClick = (e, id) => {
    e.preventDefault();
    document
      .getElementById(id)
      .scrollIntoView({ behavior: "smooth", block: "center" });
  };

  render() {
    return (
      <>
        <h1>Examples</h1>
        <ul className="examples__navigation">
          {this.examples.map((example, index) => (
            <li className="examples__navigation-item" key={`link-${index}`}>
              <a
                href={`#example-${slugify(example.title, { lower: true })}`}
                onClick={(e) =>
                  this.handleAnchorClick(
                    e,
                    `example-${slugify(example.title, { lower: true })}`
                  )
                }
              >
                {example.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="examples">
          {this.examples.map((example, index) => (
            <CodeExampleComponent key={index} example={example} />
          ))}
        </div>
      </>
    );
  }
}
