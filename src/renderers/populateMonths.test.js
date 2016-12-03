import moment from 'moment';
import clearMonths from './clearMonths';
import populateMonths from './populateMonths';

describe('populateMonths', () => {
  const picker = {
    date: moment('2016-08-20'),
    months: [],
    monthContainer: document.body.appendChild(document.createElement('div'))
  };

  before(() => {
    picker.monthContainer.style.position = 'relative';
    picker.monthContainer.style.overflowY = 'auto';
  });

  afterEach(() => {
    clearMonths.bind(picker)();
  });

  it('adds months to the months array', () => {
    populateMonths.bind(picker)();

    picker.months.should.have.length(3);
  });

  it('populates the monthContainer with three month elements', () => {
    populateMonths.bind(picker)();

    picker.monthContainer.querySelectorAll('table').should.have.length(3);
      picker.monthContainer.querySelector('caption').innerText.should.eql('Jul 2016');
      picker.monthContainer.querySelectorAll('caption')[2].innerText.should.eql('Sep 2016');
  });

  it('sets the monthContainer\'s height', () => {
    populateMonths.bind(picker)();

    picker.monthContainer.style.height.should.match(/[0-9]+px/);
  });

  it('sets the monthContainer\'s paddingRight', () => {
    populateMonths.bind(picker)();

    picker.monthContainer.style.paddingRight.should.match(/[0-9]+px/);
  });

  it('scrolls the monthContainer to the selected month', () => {
    populateMonths.bind(picker)();

    picker.monthContainer.scrollTop.should.eql(351);
  });

  describe('with min date', () => {
    before(() => {
      picker.min = moment(moment('2016-08-01'));
    });

    after(() => {
      picker.min = null;
    });

    it('does not add the previous month if it is entirely before the min date', () => {
      populateMonths.bind(picker)();

      picker.monthContainer.querySelector('caption').innerText.should.eql('Aug 2016');
      picker.monthContainer.querySelectorAll('table').should.have.length(2);
    });

    it('does not scroll up on populate', () => {
      populateMonths.bind(picker)();

      picker.monthContainer.scrollTop.should.eql(0);
    });
  });

  describe('with max date', () => {
    before(() => {
      picker.max = moment(moment('2016-08-31'));
    });

    after(() => {
      picker.max = null;
    });

    it('does not add the next month if it is entirely after the max date', () => {
      populateMonths.bind(picker)();

      picker.monthContainer.querySelectorAll('caption')[1].innerText.should.eql('Aug 2016');
      picker.monthContainer.querySelectorAll('table').should.have.length(2);
    });
  });
});
