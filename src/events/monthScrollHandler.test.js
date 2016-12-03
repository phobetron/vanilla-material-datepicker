import moment from 'moment';
import populateMonths from '../renderers/populateMonths';
import clearMonths from '../renderers/clearMonths';
import monthScrollHandler from './monthScrollHandler';

describe('monthScrollHandler', () => {
  const picker = {
    date: moment('2016-08-20'),
    months: []
  };

  beforeEach(() => {
    picker.monthContainer = document.createElement('div');
    picker.monthContainer.className = 'datepicker-months';
    picker.monthContainer.setAttribute('style', 'overflow-y:auto;position:relative;width:100%;');
    document.body.appendChild(picker.monthContainer);

    populateMonths.bind(picker)();
  });

  afterEach(() => {
    clearMonths.bind(picker)();

    picker.monthContainer.scrollTop = 0;
    document.body.removeChild(picker.monthContainer);

    picker.min = null;
    picker.max = null;
    picker.months = [];

    picker.monthContainer = null;
  });

  it('does nothing if you don\'t scroll', () => {
    monthScrollHandler.bind(picker)();

    picker.months.should.have.length(3);
    picker.monthContainer.querySelectorAll('table').should.have.length(3);
  });

  describe('scroll up', () => {
    it('does nothing if the month is before min', () => {
      picker.min = moment('2016-07-01');
      picker.monthContainer.scrollTop = 10;

      monthScrollHandler.bind(picker)();

      picker.months.should.have.length(3);
      picker.monthContainer.querySelectorAll('table').should.have.length(3);
    });

    it('adds the new month to the beginning of the months array', () => {
      picker.monthContainer.scrollTop = 10;

      monthScrollHandler.bind(picker)();

      picker.months.should.have.length(4);
      picker.months[0].isSame(moment('2016-06-01'), 'month').should.be.true;
    });

    it('adds the new month table to the beginning of the month container', () => {
      picker.monthContainer.scrollTop = 10;

      monthScrollHandler.bind(picker)();

      picker.monthContainer.querySelectorAll('table').should.have.length(4);
      picker.monthContainer.querySelector('caption').innerText.should.eql('Jun 2016');
    });

    it('corrects the scrollTop of the monthContainer after adding the new month table', () => {
      const initialScrollTop = 10;
      picker.monthContainer.scrollTop = initialScrollTop;

      monthScrollHandler.bind(picker)();

      picker.monthContainer.scrollTop.should.not.eql(initialScrollTop);
    });
  });

  describe('scroll down', () => {
    it('does nothing if the month is after max', () => {
      picker.max = moment('2016-09-30');
      picker.monthContainer.scrollTop = picker.monthContainer.scrollHeight - picker.monthContainer.offsetHeight - 10;

      monthScrollHandler.bind(picker)();

      picker.monthContainer.querySelectorAll('table').should.have.length(3);
    });

    it('adds the new month to the end of the months array', () => {
      picker.monthContainer.scrollTop = picker.monthContainer.scrollHeight - picker.monthContainer.offsetHeight - 10;

      monthScrollHandler.bind(picker)();

      picker.months.should.have.length(4);
      picker.months[picker.months.length - 1].isSame(moment('2016-10-01'), 'month').should.be.true;
    });

    it('adds the new month table to the end of the month container', () => {
      picker.monthContainer.scrollTop = picker.monthContainer.scrollHeight - picker.monthContainer.offsetHeight - 10;

      monthScrollHandler.bind(picker)();

      picker.monthContainer.querySelectorAll('table').should.have.length(4);
      picker.monthContainer.querySelectorAll('caption')[3].innerText.should.eql('Oct 2016');
    });

    it('does not correct the scrollTop of the monthContainer', () => {
      const initialScrollTop = picker.monthContainer.scrollHeight - picker.monthContainer.offsetHeight - 10;
      picker.monthContainer.scrollTop = initialScrollTop;

      monthScrollHandler.bind(picker)();

      picker.monthContainer.scrollTop.should.eql(initialScrollTop);
    });
  });
});
