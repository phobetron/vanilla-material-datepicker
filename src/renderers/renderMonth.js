import moment from 'moment';
import selectDateHandler from '../events/selectDateHandler';

function fillRow(row, count) {
  let i = count;

  for (;i > 0; i--) {
    row.appendChild(document.createElement('td'));
  }
}

function renderDay(dayDate) {
  let day;

  if (
      (this.min && dayDate.isBefore(this.min)) ||
      (this.max && dayDate.isAfter(this.max)) ||
      (this.filter && this.filter(dayDate))
     ) {
    day = document.createElement('span');
  } else {
    day = document.createElement('a');
    day.href = '#';
    day.title = dayDate.format('MMMM Do, YYYY');
    day.addEventListener('click', selectDateHandler.bind(this)(dayDate));
  }

  day.innerText = dayDate.date();
  const classes = day.className.split(' ');

  if (dayDate.isSame(this.date, 'day')) { classes.push('selected'); }
  if (dayDate.isSame(moment(), 'day')) { classes.push('today'); }

  day.className = classes.join(' ');

  return day;
}

function renderWeek(weekDate) {
  const week = document.createElement('tr');
  const monthNumber = weekDate.month();

  fillRow(week, weekDate.day());

  do {
    week.appendChild(document.createElement('td'))
      .appendChild(renderDay.bind(this)(weekDate.clone()));
  } while (weekDate.add(1, 'day').day() > 0 && weekDate.month() === monthNumber);

  if (weekDate.month() !== monthNumber && weekDate.day() > 0) { fillRow(week, 7 - weekDate.day()); }

  return week;
}

function renderMonth(monthDate) {
  const month = document.createElement('table');
  const name = month.appendChild(document.createElement('caption'));
  const days = month.appendChild(document.createElement('tbody'));
  const iDate = monthDate.clone().startOf('month');
  const endDate = monthDate.clone().endOf('month');

  month.className = 'datepicker-month';
  name.innerText = monthDate.format('MMM YYYY');

  if (iDate.day() > 2) { name.className = 'inset'; }

  do { days.appendChild(renderWeek.bind(this)(iDate)); } while (iDate < endDate);

  return month;
}

export { renderMonth, renderWeek, renderDay, fillRow };
