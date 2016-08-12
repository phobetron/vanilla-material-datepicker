"use strict";

var Datepicker = (function() {

  function Datepicker(options) {
    var validOptions = [
          'date',
          'input',
          'display',
          'min',
          'max',
          'filter'
        ],
        valid = true,
        defaultDescriptor = {
          writeable: false,
          enumerable: false,
          configurable: false
        },
        _date,
        _this = this,
        displayedMonths = [],
        calendarContainer = document.createElement('aside'),
        monthContainer = document.createElement('div');

    Object.keys(options).forEach(function(option) {
      if (validOptions.indexOf(option) < 0) {
        console.warn('Option \''+option+'\' is not supported by the date picker');
        valid = false;
      }
    });

    if (options.filter && typeof options.filter !== 'function') {
      console.warn('Option \'filter\' must be a function that returns a boolean for a given date');
      valid = false;
    }

    if (!valid) {
      console.error('Date picker could not be initialized due to warnings');
      return false;
    }

    _date = options.date ? moment(options.date) : moment();

    Object.defineProperties(this, {
      input: merge({
        value: options.input
      }, defaultDescriptor),

      formatInput: merge({
        value: options.formatInput || 'YYYY-MM-DD'
      }, defaultDescriptor),

      formatDisplay: merge({
        value: options.formatDisplay || 'MMMM Do, YYYY'
      }, defaultDescriptor),

      date: {
        get: function() { return this._date; },
        set: function(value) {
          _date = value ? moment(value) : moment();
          updateDate();
        }
      }
    });

    if (options.display) {
      Object.defineProperty(this, 'display', merge({
        value: options.display
      }, defaultDescriptor));
    }

    if (options.min) {
      Object.defineProperty(this, 'min', merge({
        value: options.min
      }, defaultDescriptor));
    }

    if (options.max) {
      Object.defineProperty(this, 'max', merge({
        value: options.max
      }, defaultDescriptor));
    }

    if (options.filter) {
      Object.defineProperty(this, 'max', merge({
        value: options.filter
      }, defaultDescriptor));
    }

    updateDate();
    renderCalendar();

    function updateDate() {
      updateDateInput();
      updateDateDisplay();
    }

    function updateDateInput() {
      _this.input.value = _date.format(_this.formatInput);
    }

    function updateDateDisplay() {
      if (_this.display) {
        _this.display.innerText = _date.format(_this.formatDisplay);
      }
    }

    function renderCalendar() {
      var prevMonth = _date.clone().subtract(1, 'month'),
          currMonth = _date.clone(),
          nextMonth = _date.clone().add(1, 'month');

      calendarContainer.appendChild(renderCalendarHeader());
      calendarContainer.setAttribute('style', 'overflow:hidden;');

      [prevMonth, currMonth, nextMonth].forEach(function(month) {
        displayedMonths.push(month);
        monthContainer.appendChild(renderMonth(month));
      });

      monthContainer.setAttribute('style', 'overflow-y:auto;position:relative;visibility:hidden;width:100%;');
      calendarContainer.appendChild(monthContainer);

      document.body.appendChild(calendarContainer);

      monthContainer.style.height = (monthContainer.querySelector('td').offsetHeight * 7.5) + 'px';
      monthContainer.style.paddingRight = (monthContainer.offsetWidth - monthContainer.clientWidth) + 'px';
      monthContainer.scrollTop = monthContainer.querySelectorAll('table')[1].offsetTop;
      monthContainer.addEventListener('scroll', monthScrollHandler);
      monthContainer.style.visibility = 'visible';
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

    function renderMonth(monthDate) {
      var month = document.createElement('table'),
          name = month.appendChild(document.createElement('caption')),
          days = month.appendChild(document.createElement('tbody')),
          iDate = monthDate.clone().startOf('month'),
          endDate = monthDate.clone().endOf('month');

      name.innerText = monthDate.format('MMM YYYY');

      if (iDate.day() > 2) { name.className = 'inset'; }

      do {
        days.appendChild(renderWeek(iDate));
      } while (iDate < endDate)

      return month;
    }

    function renderWeek(weekDate) {
      var week = document.createElement('tr'),
          monthNumber = weekDate.month();

      fillWeek(week, weekDate.day());

      do {
        week.appendChild(document.createElement('td')).appendChild(renderDay(weekDate.clone()));
      } while (weekDate.add(1, 'day').day() > 0 && weekDate.month() === monthNumber)

      if (weekDate.month() !== monthNumber && weekDate.day() > 0) { fillWeek(week, 7 - weekDate.day()); }

      return week;
    }

    function renderDay(dayDate) {
      var day;

      day = document.createElement('a');
      day.href = '#';
      day.innerText = dayDate.date();
      day.title = dayDate.format('MMMM Do, YYYY');
      day.addEventListener('click', selectDateHandler(dayDate));

      if (dayDate.isSame(_date, 'day')) { day.className = 'selected'; }

      return day;
    }

    function selectDateHandler(selectedDate) {
      return function(e) {
        e.preventDefault();

        monthContainer.querySelectorAll('.selected').forEach(function(prv) { prv.className = ''; });

        this.className = 'selected';
        _this.date = selectedDate;
      }
    }

    function fillWeek(week, count) {
      for (;count > 0; count--) {
        week.appendChild(document.createElement('td'));
      }
    }

    function monthScrollHandler() {
      var loadArea = monthContainer.querySelector('td').offsetHeight * 2;

      if (monthContainer.scrollTop < loadArea) {
        displayedMonths.unshift(displayedMonths[0].clone().subtract(1, 'month'));

        monthContainer.insertBefore(renderMonth(displayedMonths[0]), monthContainer.querySelector('table'));
        monthContainer.scrollTop = monthContainer.querySelectorAll('table')[1].offsetTop + loadArea;
      } else if (monthContainer.scrollHeight - monthContainer.scrollTop < monthContainer.offsetHeight + loadArea) {
        displayedMonths.push(displayedMonths[displayedMonths.length-1].clone().add(1, 'month'));

        monthContainer.appendChild(renderMonth(displayedMonths[displayedMonths.length-1]));
      }
    }
  }

  function merge(o1, o2) {
    var o = {};

    [o1, o2].forEach(function(on) {
      for (var attr in on) { o[attr] = on[attr]; }
    });

    return o;
  }

  return Datepicker;

})();
