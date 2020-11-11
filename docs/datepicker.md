# `datepicker` (component)

General datepicker component.

| name                  | type                           | default value   | description |
| --------------------- | ------------------------------ | --------------- | ----------- |
| `allowSameDay`        | `bool`                         | `false`         |             |
| `ariaLabelledBy`      | `string`                       | `null`          |             |
| `autoComplete`        | `string`                       |                 |             |
| `autoFocus`           | `bool`                         |                 |             |
| `calendarClassName`   | `string`                       |                 |             |
| `children`            | `node`                         |                 |             |
| `className`           | `string`                       |                 |             |
| `clearButtonTitle`    | `string`                       |                 |             |
| `dateFormat`          | `union(string\|array)`         | `'MM/dd/yyyy'`  |             |
| `dateFormatCalendar`  | `string`                       | `'LLLL yyyy'`   |             |
| `dayClassName`        | `func`                         |                 |             |
| `weekDayClassName`    | `func`                         |                 |             |
| `disabled`            | `bool`                         | `false`         |             |
| `endDate`             | `instanceOf(Date)`             |                 |             |
| `excludeDates`        | `array`                        |                 |             |
| `excludeTimes`        | `array`                        |                 |             |
| `excludeScrollbar`    | `array`                        |                 |             |
| `filterDate`          | `func`                         |                 |             |
| `filterTime`          | `func`                         |                 |             |
| `formatWeekNumber`    | `func`                         |                 |             |
| `highlightDates`      | `array`                        |                 |             |
| `id`                  | `string`                       |                 |             |
| `includeDates`        | `array`                        |                 |             |
| `includeTimes`        | `array`                        |                 |             |
| `injectTimes`         | `array`                        |                 |             |
| `inline`              | `bool`                         |                 |             |
| `locale`              | `string`                       |                 |             |
| `maxDate`             | `instanceOf(Date)`             |                 |             |
| `maxTime`             | `instanceOf(Date)`             |                 |             |
| `minDate`             | `instanceOf(Date)`             |                 |             |
| `minTime`             | `instanceOf(Date)`             |                 |             |
| `monthsShown`         | `number`                       | `1`             |             |
| `name`                | `string`                       |                 |             |
| `onBlur`              | `func`                         | `function() {}` |             |
| `onChange` (required) | `func`                         | `function() {}` |             |
| `onClickOutside`      | `func`                         | `function() {}` |             |
| `onFocus`             | `func`                         | `function() {}` |             |
| `onKeyDown`           | `func`                         | `function() {}` |             |
| `onMonthChange`       | `func`                         | `function() {}` |             |
| `onSelect`            | `func`                         | `function() {}` |             |
| `onWeekSelect`        | `func`                         |                 |             |
| `onYearChange`        | `func`                         | `function() {}` |             |
| `openToDate`          | `instanceOf(Date)`             |                 |             |
| `peekNextMonth`       | `bool`                         |                 |             |
| `placeholderText`     | `string`                       |                 |             |
| `popperClassName`     | `string`                       |                 |             |
| `popperContainer`     | `func`                         |                 |             |
| `popperModifiers`     | `object`                       |                 |             |
| `popperPlacement`     | `enumpopperPlacementPositions` |                 |             |
| `readOnly`            | `bool`                         |                 |             |
| `required`            | `bool`                         |                 |             |
| `selected`            | `instanceOf(Date)`             |                 |             |
| `showTimeSelect`      | `bool`                         | `false`         |             |
| `showWeekNumbers`     | `bool`                         |                 |             |
| `startDate`           | `instanceOf(Date)`             |                 |             |
| `startOpen`           | `bool`                         |                 |             |
| `tabIndex`            | `number`                       |                 |             |
| `timeClassName`       | `func`                         |                 |             |
| `timeFormat`          | `string`                       |                 |             |
| `timeIntervals`       | `number`                       | `30`            |             |
| `title`               | `string`                       |                 |             |
| `todayButton`         | `node`                         |                 |             |
| `useWeekdaysShort`    | `bool`                         |                 |             |
| `utcOffset`           | `union(number\|string)`        |                 |             |
| `value`               | `string`                       |                 |             |
| `weekLabel`           | `string`                       |                 |             |
| `wrapperClassName`    | `string`                       |                 |             |
