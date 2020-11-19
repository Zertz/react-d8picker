# `index` (component)

| name                         | type                           | default value             | description |
| ---------------------------- | ------------------------------ | ------------------------- | ----------- |
| `allowSameDay`               | `bool`                         | `false`                   |             |
| `ariaLabelClose`             | `string`                       |                           |             |
| `ariaLabelledBy`             | `string`                       |                           |             |
| `autoComplete`               | `string`                       |                           |             |
| `autoFocus`                  | `bool`                         |                           |             |
| `children`                   | `node`                         |                           |             |
| `chooseDayAriaLabelPrefix`   | `string`                       |                           |             |
| `className`                  | `string`                       |                           |             |
| `clearButtonTitle`           | `string`                       |                           |             |
| `dateFormat`                 | `union(string\|array)`         | `"MM/dd/yyyy"`            |             |
| `dateFormatCalendar`         | `string`                       | `"LLLL yyyy"`             |             |
| `disabled`                   | `bool`                         | `false`                   |             |
| `disabledDayAriaLabelPrefix` | `string`                       |                           |             |
| `enableTabLoop`              | `bool`                         | `true`                    |             |
| `endDate`                    | `instanceOfDate`               |                           |             |
| `excludeScrollbar`           | `bool`                         | `true`                    |             |
| `filterDate`                 | `func`                         |                           |             |
| `filterTime`                 | `func`                         |                           |             |
| `focusSelectedMonth`         | `bool`                         | `false`                   |             |
| `formatWeekDay`              | `func`                         |                           |             |
| `formatWeekNumber`           | `func`                         |                           |             |
| `highlightDates`             | `array`                        |                           |             |
| `id`                         | `string`                       |                           |             |
| `injectTimes`                | `array`                        |                           |             |
| `inline`                     | `bool`                         |                           |             |
| `locale`                     | `shape`                        |                           |             |
| `maxDate`                    | `instanceOfDate`               |                           |             |
| `maxTime`                    | `instanceOfDate`               |                           |             |
| `minDate`                    | `instanceOfDate`               |                           |             |
| `minTime`                    | `instanceOfDate`               |                           |             |
| `monthsShown`                | `number`                       | `1`                       |             |
| `name`                       | `string`                       |                           |             |
| `onBlur`                     | `func`                         | `() {}`                   |             |
| `onChange`                   | `func`                         | `() {}`                   |             |
| `onClickOutside`             | `func`                         | `() {}`                   |             |
| `onDayMouseEnter`            | `func`                         |                           |             |
| `onFocus`                    | `func`                         | `() {}`                   |             |
| `onInputClick`               | `func`                         | `() {}`                   |             |
| `onInputError`               | `func`                         | `() {}`                   |             |
| `onKeyDown`                  | `func`                         | `() {}`                   |             |
| `onMonthChange`              | `func`                         | `() {}`                   |             |
| `onMonthMouseLeave`          | `func`                         |                           |             |
| `onSelect`                   | `func`                         | `() {}`                   |             |
| `onWeekSelect`               | `func`                         |                           |             |
| `onYearChange`               | `func`                         | `() {}`                   |             |
| `open`                       | `bool`                         |                           |             |
| `openToDate`                 | `instanceOfDate`               |                           |             |
| `peekNextMonth`              | `bool`                         |                           |             |
| `placeholderText`            | `string`                       |                           |             |
| `popperClassName`            | `string`                       |                           |             |
| `popperContainer`            | `func`                         |                           |             |
| `popperModifiers`            | `object`                       |                           |             |
| `popperPlacement`            | `enumpopperPlacementPositions` |                           |             |
| `popperProps`                | `object`                       |                           |             |
| `readOnly`                   | `bool`                         | `false`                   |             |
| `renderCustomHeader`         | `func`                         |                           |             |
| `renderDayContents`          | `func`                         | `(date) { return date; }` |             |
| `required`                   | `bool`                         |                           |             |
| `selected`                   | `instanceOfDate`               |                           |             |
| `selectsRange`               | `bool`                         |                           |             |
| `showFullMonthYearPicker`    | `bool`                         | `false`                   |             |
| `showPreviousMonths`         | `bool`                         | `false`                   |             |
| `showTimeSelect`             | `bool`                         | `false`                   |             |
| `showTimeSelectOnly`         | `bool`                         |                           |             |
| `showWeekNumbers`            | `bool`                         |                           |             |
| `startDate`                  | `instanceOfDate`               |                           |             |
| `startOpen`                  | `bool`                         |                           |             |
| `tabIndex`                   | `number`                       |                           |             |
| `timeCaption`                | `string`                       | `"Time"`                  |             |
| `timeFormat`                 | `string`                       |                           |             |
| `timeIntervals`              | `number`                       | `30`                      |             |
| `title`                      | `string`                       |                           |             |
| `useWeekdaysShort`           | `bool`                         |                           |             |
| `value`                      | `string`                       |                           |             |
| `weekAriaLabelPrefix`        | `string`                       |                           |             |
| `weekLabel`                  | `string`                       |                           |             |
