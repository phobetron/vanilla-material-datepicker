import moment from 'moment';
import selectDateHandler from './selectDateHandler';

describe('selectDateHandler', () => {
  const picker = { selectDate: () => {} };

  it('returns a function', () => {
    const handler = selectDateHandler.bind(picker)(moment('2016-08-20'));

    handler.should.be.a('function');
  });

  describe('returned function', () => {
    it('prevents default event behavior', () => {
      const handler = selectDateHandler.bind(picker)(moment('2016-08-20'));
      const e = { preventDefault: () => {} };
      const eSpy = sinon.spy(e, 'preventDefault');

      handler(e);

      eSpy.should.have.been.called;
    });

    it('selects the date', () => {
      const date = moment('2016-08-20');
      const handler = selectDateHandler.bind(picker)(date);
      const e = { preventDefault: () => {} };
      const selectDateSpy = sinon.spy(picker, 'selectDate');

      handler(e);

      selectDateSpy.should.have.been.calledWith(date);
    });
  });
});
