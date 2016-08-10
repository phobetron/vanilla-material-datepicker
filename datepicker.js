"use strict";

var Datepicker = (function() {

  function merge(o1, o2) {
    var o = {};

    [o1, o2].forEach(function(on) {
      for (var attr in on) { o[attr] = on[attr]; }
    });

    return o;
  }

  function updateDateInput(dp) {
    dp.input.value = dp.date.format(dp.formatInput);
  }

  function updateDateDisplay(dp) {
    if (dp.display) {
      dp.display.innerText = dp.date.format(dp.formatDisplay);
    }
  }

  function renderCalendar(dp) {
    var calendar = document.createElement('aside');

    calendar.appendChild(renderCalendarHeader());
    calendar.appendChild(renderMonth(dp.date));

    document.body.appendChild(calendar);
  }

  function renderCalendarHeader() {
    var weekdays = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
        header = document.createElement('table').appendChild(document.createElement('thead')),
        week = document.createElement('tr');

    weekdays.forEach(function(day) {
      var th = document.createElement('th');
      th.innerText = day;
      week.appendChild(th);
    });

    header.appendChild(week);

    return header.parentNode;
  }

  function renderMonth(date) {
    var month = document.createElement('table'),
        name = month.appendChild(document.createElement('caption')),
        days = month.appendChild(document.createElement('tbody')),
        iDate = date.clone().startOf('month'),
        endDate = date.clone().endOf('month');

    name.innerText = date.format('MMM YYYY');

    if (iDate.day() > 2) { name.className = 'inset'; }

    do {
      days.appendChild(renderWeek(iDate, date));
    } while (iDate < endDate)

    return month;
  }

  function renderWeek(date, selected) {
    var week = document.createElement('tr');

    fillWeek(week, date.day());

    do {
      week.appendChild(document.createElement('td')).appendChild(renderDay(date, selected));
    } while (date.add(1, 'day').day() > 0 && date.isSame(selected, 'month'))

    if (!date.isSame(selected, 'month')) {
      fillWeek(week, 7 - date.day());
    }

    return week;
  }

  function renderDay(date, selected) {
    var day;

    day = document.createElement('a');
    day.href = '#';
    day.innerText = date.date();

    if (date.isSame(selected, 'day')) { day.className = 'selected'; }

    return day;
  }

  function fillWeek(week, count) {
    for (;count > 0; count--) {
      week.appendChild(document.createElement('td'));
    }
  }

  return function Datepicker(options) {
    var defaultDescriptor = {
          writeable: false,
          enumerable: false,
          configurable: false
        },
        valid = true,
        validOptions = [ 'date', 'input', 'display' ];

    Object.keys(options).forEach(function(option) {
      if (validOptions.indexOf(option) < 0) {
        console.warn('Option \''+option+'\' is not supported by the date picker');
        valid = false;
      }
    });

    if (!valid) {
      console.error('Date picker could not be initialized due to warnings');
      return false;
    }

    this._date = options.date ? moment(options.date) : moment();

    Object.defineProperties(this, {
      input: merge({
        value: options.input
      }, defaultDescriptor),

      formatInput: merge({
        value: options.formatInput || 'YYYY-MM-DD'
      }, defaultDescriptor),

      formatDisplay: merge({
        value: options.formatDisplay || 'MMMM Do YYYY'
      }, defaultDescriptor),

      date: {
        get: function() { return this._date; },
        set: function(value) {
          this._date = value ? moment(value) : moment();
          updateDateInput(this);
          updateDateDisplay(this);
        }
      }
    });

    if (options.display) {
      Object.defineProperty(this, 'display', merge({
        value: options.display
      }, defaultDescriptor));
    }

    updateDateInput(this);
    updateDateDisplay(this);
    renderCalendar(this);
  }

})();
