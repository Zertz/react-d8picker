# `datepicker` (component)

General datepicker component.

| name                  | type                           | default value   | description |
| --------------------- | ------------------------------ | --------------- | ----------- |
| `allowSameDay`        | `bool`                         | `false`         |             |
| `ariaLabelledBy`      | `string`                       | `null`          |             |
| `autoComplete`        | `string`                       |                 |             |
| `autoFocus`           | `bool`                         |                 |             |
| `children`            | `node`                         |                 |             |
| `className`           | `string`                       |                 |             |
| `dateFormat`          | `union(string\|array)`         | `'MM/dd/yyyy'`  |             |
| `dateFormatCalendar`  | `string`                       | `'LLLL yyyy'`   |             |
| `disabled`            | `bool`                         | `false`         |             |
| `endDate`             | `instanceOf(Date)`             |                 |             |
| `filterDate`          | `func`                         |                 |             |
| `filterTime`          | `func`                         |                 |             |
| `formatWeekNumber`    | `func`                         |                 |             |
| `highlightDates`      | `array`                        |                 |             |
| `id`                  | `string`                       |                 |             |
| `injectTimes`         | `array`                        |                 |             |
| `inline`              | `bool`                         |                 |             |
| `locale`              | `shape`                        |                 |             |
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
| `timeFormat`          | `string`                       |                 |             |
| `timeIntervals`       | `number`                       | `30`            |             |
| `title`               | `string`                       |                 |             |
| `useWeekdaysShort`    | `bool`                         |                 |             |
| `utcOffset`           | `union(number\|string)`        |                 |             |
| `value`               | `string`                       |                 |             |
| `weekLabel`           | `string`                       |                 |             |
