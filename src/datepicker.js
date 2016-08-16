"use strict";

require('./datepicker.scss');
require('moment');

var Datepicker = (function() {

  var datepickers = [];

  function Datepicker(options) {
    var _this = this,
        defaultDescriptor = {
          writeable: false,
          enumerable: false,
          configurable: false
        },
        container = document.createElement('aside'),
        months = [],
        open = false,
        input = options.input,
        display = options.display,
        button = options.button,
        date = options.date ? moment(options.date) : moment(),
        min = options.min ? moment(options.min) : null,
        max = options.max ? moment(options.max) : null,
        filter = options.filter || function(d) { return false; },
        formatInput = options.formatInput || 'YYYY-MM-DD',
        formatDisplay = options.formatDisplay || 'MMMM Do, YYYY';

    if (!validOptions(options)) { return false; }

    Object.defineProperties(this, {
      filter: merge({
        value: filter
      }, defaultDescriptor),

      formatInput: merge({
        value: formatInput
      }, defaultDescriptor),

      formatDisplay: merge({
        value: formatDisplay
      }, defaultDescriptor),

      selectDate: merge({
        value: function(selectedDate) {
          _this.date = selectedDate;
          options.onSelectDate.bind(this)(selectedDate);
          _this.close();
        }
      }, defaultDescriptor),

      close: merge({
        value: function() {
          if (open) {
            _this.container.style.display = 'none';
            destroyMonths();
            open = false;
            options.onClose.bind(this)();
          }
        }
      }, defaultDescriptor),

      open: merge({
        value: function() {
          if (!open) {
            datepickers.forEach(function(dp) {
              dp.close();
            });

            _this.container.style.display = 'block';
            renderMonths();
            open = true;
            options.onOpen.bind(this)();
          }
        }
      }, defaultDescriptor),

      isOpen: merge({
        value: function() { return open; }
      }, defaultDescriptor),

      months: merge({
        value: months
      }, defaultDescriptor),

      container: merge({
        value: container
      }, defaultDescriptor),

      input: merge({
        value: input
      }, defaultDescriptor),

      date: {
        get: function() { return date; },
        set: function(value) {
          date = value ? moment(value) : moment();

          updateDate();
        }
      }
    });

    if (min) {
      Object.defineProperty(this, 'min', merge({
        value: min
      }, defaultDescriptor));
    }

    if (max) {
      Object.defineProperty(this, 'max', merge({
        value: max
      }, defaultDescriptor));
    }

    if (options.display) {
      Object.defineProperty(this, 'display', merge({
        value: display
      }, defaultDescriptor));
    }

    if (options.button) {
      Object.defineProperty(this, 'button', merge({
        value: button
      }, defaultDescriptor));

      options.button.addEventListener('click', togglePickerHandler);
    } else if (options.display) {
      options.display.addEventListener('click', togglePickerHandler);
    } else {
      options.input.addEventListener('focus', openPickerHandler);
    }

    document.body.addEventListener('keyup', closePickerHandler);

    datepickers.push(this);

    updateDate();
    renderCalendar();

    function validOptions(options) {
      var valid = true,
          validOptions = [
            'date',
            'input',
            'display',
            'button',
            'min',
            'max',
            'filter',
            'onOpen',
            'onClose',
            'onSelectDate'
          ];

      Object.keys(options).forEach(function(option) {
        if (validOptions.indexOf(option) < 0) {
          console.warn('Option \''+option+'\' is not supported by the date picker');
          valid = false;
        }
      });

      if (!options.input) {
        console.warn('Option \'input\' is required');
        valid = false;
      } else if (options.input.type === 'hidden' && !options.display) {
        console.warn('Option \'input\' may only be of type \'hidden\' if a \'display\' element is configured');
        valid = false;
      }

      if (min && min.toString() === 'Invalid date') {
        console.warn('Option \'min\' must be a valid date string or object');
        valid = false;
      }

      if (max && max.toString() === 'Invalid date') {
        console.warn('Option \'max\' must be a valid date string or object');
        valid = false;
      }

      if (options.filter && typeof options.filter !== 'function') {
        console.warn('Option \'filter\' must be a function that returns a boolean for a given date');
        valid = false;
      }

      ['onOpen', 'onClose', 'onSelectDate'].forEach(function(callback) {
        if (options[callback] && typeof options[callback] !== 'function') {
          console.warn('Option \''+callback+'\' must be a function');
        }
      });

      if (!valid) {
        console.error('Date picker could not be initialized due to warnings');
        return false;
      } else {
        return true;
      }
    }

    function updateDate() {
      updateDateInput();
      updateDateDisplay();
    }

    function updateDateInput() {
      _this.input.value = _this.date.format(_this.formatInput);
    }

    function updateDateDisplay() {
      if (_this.display) {
        _this.display.innerText = _this.date.format(_this.formatDisplay);
      }
    }

    function renderCalendar() {
      var element = (_this.display || _this.input),
          top, left;

      element.parentNode.appendChild(_this.container);

      _this.container.className = 'datepicker';

      renderCalendarHeader();

      _this.container.setAttribute('style', 'display:none;overflow:hidden;');
    }

    function renderCalendarHeader() {
      var weekdays = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
          table = document.createElement('table'),
          head = document.createElement('thead'),
          week = document.createElement('tr');

      _this.container.appendChild(table);

      table.className = 'datepicker-header';

      weekdays.forEach(function(day) {
        var th = document.createElement('th');
        th.innerText = day;
        week.appendChild(th);
      });

      head.appendChild(week);
      table.appendChild(head);
    }

    function renderMonths() {
      var monthContainer = document.createElement('div'),
          prevMonth = _this.date.clone().subtract(1, 'month').endOf('month'),
          currMonth = _this.date.clone(),
          nextMonth = _this.date.clone().add(1, 'month').startOf('month'),
          monthElm, currMonthElm;

      _this.container.appendChild(monthContainer);

      monthContainer.className = 'datepicker-months';
      monthContainer.setAttribute('style', 'overflow-y:auto;width:100%;');

      if (!_this.min || prevMonth.isAfter(_this.min)) { _this.months.push(prevMonth); }

      _this.months.push(currMonth);

      if (!_this.min || nextMonth.isBefore(_this.max)) { _this.months.push(nextMonth); }

      _this.months.forEach(function(month) {
        monthElm = renderMonth(month);
        monthContainer.appendChild(monthElm);

        if (month === currMonth) { currMonthElm = monthElm; }
      });

      monthContainer.style.height = (monthContainer.querySelector('td').offsetHeight * 7.5) + 'px';
      monthContainer.style.paddingRight = (monthContainer.offsetWidth - monthContainer.clientWidth) + 'px';
      monthContainer.scrollTop = currMonthElm.offsetTop;
      monthContainer.addEventListener('scroll', monthScrollHandler);
    }

    function destroyMonths() {
      var monthContainer = _this.container.querySelector('.datepicker-months');

      if (monthContainer) {
        monthContainer.parentNode.removeChild(monthContainer);

        _this.months.splice(0);
      }
    }

    function renderMonth(monthDate) {
      var month = document.createElement('table'),
          name = month.appendChild(document.createElement('caption')),
          days = month.appendChild(document.createElement('tbody')),
          iDate = monthDate.clone().startOf('month'),
          endDate = monthDate.clone().endOf('month');

      month.className = 'datepicker-month';

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
      var day, classes;

      if (
          (_this.min && dayDate.isBefore(_this.min)) ||
          (_this.max && dayDate.isAfter(_this.max)) ||
          _this.filter(dayDate)
         ) {
        day = document.createElement('span');
      } else {
        day = document.createElement('a');
        day.href = '#';
        day.title = dayDate.format('MMMM Do, YYYY');
        day.addEventListener('click', selectDateHandler(dayDate));
      }
      day.innerText = dayDate.date();

      classes = day.className.split(' ');

      if (dayDate.isSame(_this.date, 'day')) { classes.push('selected'); }
      if (dayDate.isSame(moment(), 'day')) { classes.push('today'); }

      day.className = classes.join(' ');

      return day;
    }

    function fillWeek(week, count) {
      for (;count > 0; count--) {
        week.appendChild(document.createElement('td'));
      }
    }

    function openPickerHandler(e) {
      _this.open();
    }

    function closePickerHandler(e) {
      if (e.key === 'Escape' || e.keyCode === '27') { _this.close(); }
    }

    function togglePickerHandler(e) {
      e.preventDefault();

      _this.isOpen() ? _this.close() : _this.open();
    }

    function monthScrollHandler() {
      var monthContainer = _this.container.querySelector('.datepicker-months'),
          loadArea = monthContainer.querySelector('td').offsetHeight * 2,
          newMonth;

      if (monthContainer.scrollTop < loadArea) {
        newMonth = _this.months[0].clone().subtract(1, 'month').endOf('month');

        if (!_this.min || newMonth.isAfter(_this.min)) {
          _this.months.unshift(newMonth);

          monthContainer.insertBefore(renderMonth(_this.months[0]), monthContainer.querySelector('table'));
          monthContainer.scrollTop = monthContainer.querySelectorAll('table')[1].offsetTop + loadArea;
        }
      } else if (monthContainer.scrollHeight - monthContainer.scrollTop < monthContainer.offsetHeight + loadArea) {
        newMonth = _this.months[_this.months.length-1].clone().add(1, 'month').startOf('month');

        if (!_this.max || newMonth.isBefore(_this.max)) {
          _this.months.push(newMonth);

          monthContainer.appendChild(renderMonth(_this.months[_this.months.length-1]));
        }
      }
    }

    function selectDateHandler(selectedDate) {
      return function(e) {
        e.preventDefault();

        _this.selectDate(selectedDate);
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

module.exports = Datepicker;
