import moment from 'moment';
import validOptions from './validOptions';

describe('validOptions',() => {
  const picker = {};
  let errorLogger;
  let warnLogger;
  let input;

  before(() => {
    errorLogger = sinon.stub(console, 'error');
    warnLogger = sinon.stub(console, 'warn');
  });

  after(() => {
    console.error.restore();
    console.warn.restore();
  });

  beforeEach(() => {
    input = document.createElement('input');
  });

  afterEach(() => {
    errorLogger.reset();
    warnLogger.reset();

    input = null;
  });

  describe('input element validation', () => {
    it('logs error and returns false when the input element arg is missing', () => {
      const valid = validOptions();

      errorLogger.should.have.been.called;
      valid.should.be.false;
    });

    it('logs error and returns false when input is hidden and no options are given', () => {
      input.type = 'hidden';
      const valid = validOptions(input);

      errorLogger.should.have.been.called;
      valid.should.be.false;
    });

    it('logs error and returns false when input is hidden and no display option is given', () => {
      input.type = 'hidden';
      const valid = validOptions(input, {});

      errorLogger.should.have.been.called;
      valid.should.be.false;
    });

    it('returns true when input is not hidden and no options are given', () => {
      const valid = validOptions(input);

      errorLogger.should.not.have.been.called;
      valid.should.be.true;
    });

    it('returns true when input is not hidden and no display option is given', () => {
      const valid = validOptions(input, {});

      errorLogger.should.not.have.been.called;
      valid.should.be.true;
    });

    it('returns true when input is hidden and display option is given', () => {
      input.type = 'hidden';
      const valid = validOptions(input, { display: 'not checking this but should be an element' });

      errorLogger.should.not.have.been.called;
      valid.should.be.true;
    });
  });

  describe('option validation', () => {
    let options;

    beforeEach(() => {
      options = {};
    });

    afterEach(() => {
      options = null;
    });

    it('logs warning for unsupported option but still passes', () => {
      options.whatever = 'ignore me';
      const valid = validOptions(input, options);

      warnLogger.should.have.been.called;
      errorLogger.should.not.have.been.called;
      valid.should.be.true;
    });

    describe('dates', () => {
      beforeEach(() => {
        options = {
          date: '2016-08-20',
          min: '2016-02-20',
          max: '2017-02-20'
        };
      });

      ['date', 'min', 'max'].forEach((dateKey) => {
        it(`logs error and returns false when ${dateKey} is not a valid date string`, () => {
          options[dateKey] = 'not a date';
          const valid = validOptions(input, options);

          errorLogger.should.have.been.called;
          valid.should.be.false;
        });

        it(`returns true when ${dateKey} is a valid date string`, () => {
          const valid = validOptions(input, options);

          errorLogger.should.not.have.been.called;
          valid.should.be.true;
        });

        it(`returns true when ${dateKey} is a valid Date object`, () => {
          options[dateKey] = new Date(options[dateKey]);
          const valid = validOptions(input, options);

          errorLogger.should.not.have.been.called;
          valid.should.be.true;
        });

        it(`returns true when ${dateKey} is a valid moment object`, () => {
          options[dateKey] = moment(options[dateKey]);
          const valid = validOptions(input, options);

          errorLogger.should.not.have.been.called;
          valid.should.be.true;
        });
      });
    });

    describe('callbacks', () => {
      beforeEach(() => {
        options = {
          onOpen: () => {},
          onClose: () => {},
          onSelectDate: (date) => { return date.isMoment(); }
        };
      });

      ['onOpen', 'onClose', 'onSelectDate'].forEach((callback) => {
        it(`logs error and returns false when ${callback} is not a function`, () => {
          options[callback] = 'not a function';
          const valid = validOptions(input, options);

          errorLogger.should.have.been.called;
          valid.should.be.false;
        });

        it(`returns true when ${callback} is a function`, () => {
          const valid = validOptions(input, options);

          errorLogger.should.not.have.been.called;
          valid.should.be.true;
        });
      });
    });

    describe('filter', () => {
      beforeEach(() => {
        options = {
          filter: (date) => { return moment.isMoment(date); }
        };
      });

      it('logs error and returns false when filter is not a function', () => {
        options.filter = 'not a function'
        const valid = validOptions(input, options);

        errorLogger.should.have.been.called;
        valid.should.be.false;
      });

      it('logs error and returns false when filter function does not return boolean', () => {
        options.filter = () => { return 'not a boolean'; }
        const valid = validOptions(input, options);

        errorLogger.should.have.been.called;
        valid.should.be.false;
      });

      it('returns true when filter function returns a boolean', () => {
        const valid = validOptions(input, options);

        errorLogger.should.not.have.been.called;
        valid.should.be.true;
      });
    });
  });
});
