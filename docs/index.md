# `index` (component)

| name                         | type                           | default value      | description |
| ---------------------------- | ------------------------------ | ------------------ | ----------- |
| `allowSameDay`               | `bool`                         | `false`            |             |
| `ariaLabelClose`             | `string`                       |                    |             |
| `ariaLabelledBy`             | `string`                       |                    |             |
| `autoComplete`               | `string`                       |                    |             |
| `autoFocus`                  | `bool`                         |                    |             |
| `calendarClassName`          | `string`                       |                    |             |
| `children`                   | `node`                         |                    |             |
| `chooseDayAriaLabelPrefix`   | `string`                       |                    |             |
| `className`                  | `string`                       |                    |             |
| `clearButtonTitle`           | `string`                       |                    |             |
| `dateFormat`                 | `union(string\|array)`         | `"MM/dd/yyyy"`     |             |
| `dateFormatCalendar`         | `string`                       | `"LLLL yyyy"`      |             |
| `dayClassName`               | `func`                         |                    |             |
| `disabled`                   | `bool`                         | `false`            |             |
| `disabledDayAriaLabelPrefix` | `string`                       |                    |             |
| `enableTabLoop`              | `bool`                         | `true`             |             |
| `endDate`                    | `instanceOfDate`               |                    |             |
| `excludeDates`               | `array`                        |                    |             |
| `excludeScrollbar`           | `bool`                         | `true`             |             |
| `excludeTimes`               | `array`                        |                    |             |
| `filterDate`                 | `func`                         |                    |             |
| `filterTime`                 | `func`                         |                    |             |
| `focusSelectedMonth`         | `bool`                         | `false`            |             |
| `formatWeekDay`              | `func`                         |                    |             |
| `formatWeekNumber`           | `func`                         |                    |             |
| `highlightDates`             | `array`                        |                    |             |
| `id`                         | `string`                       |                    |             |
| `includeDates`               | `array`                        |                    |             |
| `includeTimes`               | `array`                        |                    |             |
| `injectTimes`                | `array`                        |                    |             |
| `inline`                     | `bool`                         |                    |             |
| `locale`                     | `union(string\|shape)`         |                    |             |
| `maxDate`                    | `instanceOfDate`               |                    |             |
| `maxTime`                    | `instanceOfDate`               |                    |             |
| `minDate`                    | `instanceOfDate`               |                    |             |
| `minTime`                    | `instanceOfDate`               |                    |             |
| `monthClassName`             | `func`                         |                    |             |
| `monthsShown`                | `number`                       | `1`                |             |
| `name`                       | `string`                       |                    |             |
| `nextMonthButtonLabel`       | `union(string\|node)`          | `"Next Month"`     |             |
| `onBlur`                     | `func`                         | `() {}`            |             |
| `onChange`                   | `func`                         | `() {}`            |             |
| `onChangeRaw`                | `func`                         |                    |             |
| `onClickOutside`             | `func`                         | `() {}`            |             |
| `onDayMouseEnter`            | `func`                         |                    |             |
| `onFocus`                    | `func`                         | `() {}`            |             |
| `onInputClick`               | `func`                         | `() {}`            |             |
| `onInputError`               | `func`                         | `() {}`            |             |
| `onKeyDown`                  | `func`                         | `() {}`            |             |
| `onMonthChange`              | `func`                         | `() {}`            |             |
| `onMonthMouseLeave`          | `func`                         |                    |             |
| `onSelect`                   | `func`                         | `() {}`            |             |
| `onWeekSelect`               | `func`                         |                    |             |
| `onYearChange`               | `func`                         | `() {}`            |             |
| `open`                       | `bool`                         |                    |             |
| `openToDate`                 | `instanceOfDate`               |                    |             |
| `peekNextMonth`              | `bool`                         |                    |             |
| `placeholderText`            | `string`                       |                    |             |
| `popperClassName`            | `string`                       |                    |             |
| `popperContainer`            | `func`                         |                    |             |
| `popperModifiers`            | `object`                       |                    |             |
| `popperPlacement`            | `enumpopperPlacementPositions` |                    |             |
| `popperProps`                | `object`                       |                    |             |
| `portalId`                   | `string`                       |                    |             |
| `preventOpenOnFocus`         | `bool`                         | `false`            |             |
| `previousMonthButtonLabel`   | `union(string\|node)`          | `"Previous Month"` |             |
| `readOnly`                   | `bool`                         | `false`            |             |
| `renderCustomHeader`         | `func`                         |                    |             |
| `renderDayContents`          | `func`                         | `(date) {          |

return date;
}`|| |`required`|`bool`||| |`selected`|`instanceOfDate`||| |`selectsRange`|`bool`||| |`showFullMonthYearPicker`|`bool`|`false`|| |`showPreviousMonths`|`bool`|`false`|| |`showTimeSelect`|`bool`|`false`|| |`showTimeSelectOnly`|`bool`||| |`showWeekNumbers`|`bool`||| |`startDate`|`instanceOfDate`||| |`startOpen`|`bool`||| |`strictParsing`|`bool`|`false`|| |`tabIndex`|`number`||| |`timeCaption`|`string`|`"Time"`|| |`timeClassName`|`func`||| |`timeFormat`|`string`||| |`timeIntervals`|`number`|`30`|| |`title`|`string`||| |`todayButton`|`node`||| |`useWeekdaysShort`|`bool`||| |`value`|`string`||| |`weekAriaLabelPrefix`|`string`||| |`weekDayClassName`|`func`||| |`weekLabel`|`string`||| |`withPortal`|`bool`|`false`|| |`wrapperClassName`|`string`|||
