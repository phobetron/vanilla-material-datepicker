# Vanilla Material Datepicker
Vanilla JS material design-influenced date picker widget based on Moment.js

## Installation
**Current:**

Clone the repo and build the files, or use the already-built files in `./dist`. To build, you should use the following command:

```bash
> npm install && npm run dist
```

**Future:**

```bash
> npm install vanilla-material-datepicker
```

## Usage

**Reference the files in your HTML:**

```html
<link rel="stylesheet" href="path/to/vanilla-material-datepicker/datepicker.css">
<script src="path/to/moment/moment.js"></script>
<script src="path/to/vanilla-material-datepicker/datepicker.js"></script>
```

**Initialize the widget:**

```javascript
document.addEventListener('DOMContentLoaded', function(event) {
  var input = document.querySelector('.with_input [name=date_field]');
  var display = document.querySelector('.with_button .display');
  var button = document.querySelector('.with_button .opener');
  var min = moment().subtract(1, 'year');
  var max = moment().add(1, 'year');
  var filter = function(moment) { ... };
  var openCallback = function() { ... };
  var closeCallback = function() { ... };
  var selectDateCallback = function(moment) { ... };

  var datepicker = new Datepicker(input, { // All members of this object are optional
    display: display,
    button: button,
    min: min,
    max: max,
    filter: filter,
    onOpen: openCallback,
    onClose: closeCallback,
    onSelectDate: selectDateCallback
  });
});
```

If you do anything wrong, it should tell you.

## How do I know whether this date picker widget is for me?

This date picker widget has the following qualities:

- Only dependency is [moment.js](http://momentjs.com/)
- Intended to integrate into any JS app in any framework with minimal quirks or side-effects
- Size and positioning are entirely dictated by CSS
- Opens on input focus or optional `display`/`button` element click
- The `button` option can be any element, not just a `button`
- Weekday labels are displayed at the top of the container
- Calendar display starts at the first week of the month of the selected date
- Displays 6-7 weeks in a vertically scrollable panel
- Scrolls through months and years infinitely into both the past and future, unless `min` and/or `max` are set
- Filters dates based on a user-provided `filter` function option
- Accepts optional callback functions for `onOpen`, `onClose`, and `onSelectDate`
- Container is appended to the input/display element's parent element if a `parent` element option is not specified

## License
vanilla-material-datepicker is freely distributable under the terms of the [MIT license](https://github.com/phobetron/vanilla-material-datepicker/blob/master/LICENSE).
