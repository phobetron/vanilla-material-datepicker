import clearMonths from './clearMonths';

describe('clearMonths', () => {
  const picker = { months: [] };

  before(() => {
    picker.monthContainer = document.createElement('div');
    document.body.appendChild(picker.monthContainer);
  });

  after(() => {
    document.body.removeChild(picker.monthContainer);
    picker.monthContainer = null;
  });

  it('clears out months from the month container', () => {
    [0,0,0].forEach(() => { picker.monthContainer.appendChild(document.createElement('div')); });

    clearMonths.bind(picker)();

    picker.monthContainer.childNodes.should.have.length(0);
  });

  it('clears out the months array', () => {
    [0,0,0].forEach((i) => { picker.months.push(i); });

    clearMonths.bind(picker)();

    picker.months.should.have.length(0);
  });
});
