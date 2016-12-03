import { renderMonth } from '../renderers/renderMonth';

function monthScrollHandler() {
  const monthContainer = this.monthContainer;
  const months = this.months;
  const min = this.min;
  const max = this.max;
  const loadArea = monthContainer.querySelector('td').offsetHeight * 2;
  const bottomPosition = monthContainer.scrollHeight - monthContainer.scrollTop;
  const down = bottomPosition < monthContainer.offsetHeight + loadArea;
  const up = monthContainer.scrollTop < loadArea;
  let newMonth;

  if (up) {
    newMonth = months[0].clone().subtract(1, 'month').endOf('month');

    if (!min || newMonth.isAfter(min)) {
      months.unshift(newMonth);

      monthContainer.insertBefore(renderMonth.bind(this)(months[0]),
          monthContainer.querySelector('table'));
      monthContainer.scrollTop = monthContainer.querySelectorAll('table')[1].offsetTop + loadArea;
    }
  } else if (down) {
    newMonth = months[months.length - 1].clone().add(1, 'month').startOf('month');

    if (!max || newMonth.isBefore(max)) {
      months.push(newMonth);

      monthContainer.appendChild(renderMonth.bind(this)(months[months.length - 1]));
    }
  }
}

export default monthScrollHandler;
