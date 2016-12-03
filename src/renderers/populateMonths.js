import { renderMonth } from './renderMonth';

function populateMonths() {
  const prevMonth = this.date.clone().subtract(1, 'month').endOf('month');
  const currMonth = this.date.clone();
  const nextMonth = this.date.clone().add(1, 'month').startOf('month');
  let monthElm;
  let currMonthElm;

  if (!this.min || prevMonth.isAfter(this.min)) { this.months.push(prevMonth); }

  this.months.push(currMonth);

  if (!this.max || nextMonth.isBefore(this.max)) { this.months.push(nextMonth); }

  this.months.forEach((month) => {
    monthElm = this.monthContainer.appendChild(renderMonth.bind(this)(month));

    if (month === currMonth) { currMonthElm = monthElm; }
  });

  this.monthContainer.style.height =
    `${this.monthContainer.querySelector('td').offsetHeight * 7.5}px`;
  this.monthContainer.style.paddingRight =
    `${this.monthContainer.offsetWidth - this.monthContainer.clientWidth}px`;
  this.monthContainer.scrollTop = currMonthElm.offsetTop;
}

export default populateMonths;
