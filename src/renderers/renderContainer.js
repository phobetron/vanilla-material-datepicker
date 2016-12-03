import monthScrollHandler from '../events/monthScrollHandler';

function renderContainerHeader() {
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const week = document.createElement('tr');

  table.className = 'datepicker-header';

  weekdays.forEach((day) => {
    const th = document.createElement('th');
    th.innerText = day;
    week.appendChild(th);
  });

  head.appendChild(week);
  table.appendChild(head);

  return table;
}

function renderContainer() {
  this.container.className = 'datepicker';
  this.container.setAttribute('style', 'display:none;overflow:hidden;');
  this.container.appendChild(renderContainerHeader());

  this.monthContainer.className = 'datepicker-months';
  this.monthContainer.setAttribute('style', 'overflow-y:auto;position:relative;width:100%;');
  this.monthContainer.addEventListener('scroll', monthScrollHandler.bind(this));

  this.container.appendChild(this.monthContainer);

  this.parent.appendChild(this.container);
}

export { renderContainer, renderContainerHeader };
