import moment from 'moment';
import { renderMonth, renderWeek, renderDay, fillRow } from './renderMonth';

describe('renderMonth functions', () => {
  const picker = {
    date: moment('2016-08-20'),
    selectDate: () => {}
  };

  describe('fillRow', () => {
    it('fills a row with a given number of empty cells', () => {
      const row = document.createElement('tr');

      fillRow(row, 3);

      row.querySelectorAll('td').should.have.length(3);
    });
  });

  describe('renderDay', () => {
    let selectDateStub;

    before(() => {
      selectDateStub = sinon.stub(picker, 'selectDate');
    });

    after(() => {
      picker.selectDate.restore();
    });

    afterEach(() => {
      picker.min = null;
      picker.max = null;
      picker.filter = null;
    });

    it('returns a span if date is before min', () => {
      picker.min = moment('2016-08-22');

      const day = renderDay.bind(picker)(moment('2016-08-21'));

      day.nodeName.should.eql('SPAN');
      day.innerText.should.eql('21');
    });

    it('returns a span if date is after max', () => {
      picker.max = moment('2016-08-20');

      const day = renderDay.bind(picker)(moment('2016-08-21'));

      day.nodeName.should.eql('SPAN');
      day.innerText.should.eql('21');
    });

    it('returns a span if filter returns true for date', () => {
      picker.filter = (date) => { return date.isSame(moment('2016-08-21'), 'day'); };

      const day = renderDay.bind(picker)(moment('2016-08-21'));

      day.nodeName.should.eql('SPAN');
      day.innerText.should.eql('21');
    });

    it('returns a link', () => {
      const day = renderDay.bind(picker)(moment('2016-08-21'));

      day.nodeName.should.eql('A');
      day.innerText.should.eql('21');
    });

    it('adds a click listener to the link', () => {
      const dayDate = moment('2016-08-21');
      const day = renderDay.bind(picker)(dayDate);

      day.click();

      selectDateStub.should.have.been.calledWith(dayDate);
    });

    it('adds a class name of \'selected\' if date is same as picker date', () => {
      const day = renderDay.bind(picker)(moment('2016-08-20'));

      day.className.should.match(/selected/);
    });

    it('adds a class name of \'today\' if date is same as today\'s date', () => {
      const day = renderDay.bind(picker)(moment());

      day.className.should.match(/today/);
    });
  });

  describe('renderWeek', () => {
    it('fills the row before the given day at the beginning of the month', () => {
      const week = renderWeek.bind(picker)(moment('2016-08-05'));

      week.querySelectorAll('td').should.have.length(7);
    });

    it('fills the row after the given day at the end of the month', () => {
      const week = renderWeek.bind(picker)(moment('2016-08-29'));

      week.querySelectorAll('td').should.have.length(7);
    });

    it('adds days up to and including saturday', () => {
      const week = renderWeek.bind(picker)(moment('2016-08-05'));

      week.querySelectorAll('td')[6].querySelector('a').innerText.should.eql('6');
    });

    it('increments the given moment date obj to the Sunday after the given week', () => {
      const day = moment('2016-08-05');
      const week = renderWeek.bind(picker)(day);

      day.isSame(moment('2016-08-07'), 'day').should.be.true;
    });
  });

  describe('renderMonth', () => {
    it('renders a month table with a mon/year caption', () => {
      const month = renderMonth.bind(picker)(moment('2016-08-05'));

      month.nodeName.should.eql('TABLE');
      month.querySelector('caption').innerText.should.eql('Aug 2016');
      month.querySelectorAll('td').should.have.length(35);
    });

    it('adds caption class name \'inset\' if the first day of the month is after tues', () => {
      const month = renderMonth.bind(picker)(moment('2016-07-05'));

      month.querySelector('caption').className.should.match(/inset/);
    });
  });
});
