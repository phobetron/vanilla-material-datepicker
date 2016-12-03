import Datepicker from './datepicker';

const expect = chai.expect;
let options;
let input;
let button;
let display;
let displayParent;
let customParent;

describe('Datepicker', () => {
  before(() => {
    sinon.stub(console, 'error');

    input = document.createElement('input');
    document.body.appendChild(input);

    button = document.createElement('button');
    document.body.appendChild(button);

    displayParent = document.createElement('p');
    display = document.createElement('span');
    displayParent.appendChild(display);
    document.body.appendChild(displayParent);

    customParent = document.createElement('div');
    document.body.appendChild(customParent);
  });

  beforeEach(() => {
    options = {};
  });

  afterEach(() => {
    options = null;
  });

  after(() => {
    console.error.restore();

    document.body.removeChild(input);
    document.body.removeChild(button);
    document.body.removeChild(displayParent);
    document.body.removeChild(customParent);
  });

  it('has no properties when there is no input specified', () => {
    const picker = new Datepicker();
    const props = Object.keys(picker);

    props.should.have.length(0);
  });

  it('has default properties and actions defined when no options are given', () => {
    const picker = new Datepicker(input);
    const props = Object.getOwnPropertyNames(picker);

    props.should.include.members([
        'date',
        'input',
        'parent',
        'formatInput',
        'months',
        'container',
        'monthContainer',
        'isOpen',
        'open',
        'close',
        'selectDate'
    ]);
  });

  describe('properties', () => {
    it('returns configured date object', () => {
      let picker;

      options.date = '2015-08-20';
      picker = new Datepicker(input, options);
      picker.date.format('YYYY-MM-DD').should.equal('2015-08-20');
    });

    it('returns current date object if configured date is null value', () => {
      let picker;

      options.date = null;
      picker = new Datepicker(input, options);
      picker.date.toISOString().split('T')[0].should.equal(new Date().toISOString().split('T')[0]);
    });

    it('returns specified date object if date is set after init', () => {
      let picker;

      picker = new Datepicker(input, options);
      picker.date = '2012-08-20';
      picker.date.format('YYYY-MM-DD').should.equal('2012-08-20');
    });

    it('returns current date object if date is set to null value after init', () => {
      let picker;

      picker = new Datepicker(input, options);
      picker.date = null;
      picker.date.toISOString().split('T')[0].should.equal(new Date().toISOString().split('T')[0]);
    });

    it('returns configured input format string', () => {
      let picker;

      options.formatInput = 'YY-MM-DD';
      picker = new Datepicker(input, options);
      picker.formatInput.should.equal('YY-MM-DD');
    });

    it('returns configured parent element', () => {
      let picker;

      options.parent = customParent;
      picker = new Datepicker(input, options);
      picker.parent.should.equal(customParent);
    });

    it('returns configured button element', () => {
      let picker;

      options.button = button;
      picker = new Datepicker(input, options);
      picker.button.should.equal(button);
    });

    it('returns configured display element', () => {
      let picker;

      options.display = display;
      picker = new Datepicker(input, options);
      picker.display.should.equal(display);
    });

    it('returns configured display format string when display is also configured', () => {
      let picker;

      options.display = display;
      options.formatDisplay = 'DD MMM, YYYY';
      picker = new Datepicker(input, options);
      picker.formatDisplay.should.equal('DD MMM, YYYY');
    });

    it('does not return configured display format string when display is not configured', () => {
      let picker;

      options.formatDisplay = 'DD MMM, YYYY';
      picker = new Datepicker(input, options);
      expect(picker.formatDisplay).to.be.undefined;
    });

    it('returns configured minimum date object', () => {
      let picker;

      options.min = '2015-01-01';
      picker = new Datepicker(input, options);
      picker.min.format('YYYY-MM-DD').should.equal('2015-01-01');
    });

    it('returns configured maximum date object', () => {
      let picker;

      options.max = '2015-01-01';
      picker = new Datepicker(input, options);
      picker.max.format('YYYY-MM-DD').should.equal('2015-01-01');
    });

    it('returns configured filter function', () => {
      let picker;
      function customFilter(date) { return false; }

      options.filter = customFilter;
      picker = new Datepicker(input, options);
      picker.filter('not actually a date').should.be.false;
    });
  });

  describe('actions', () => {
    it('returns open state', () => {
      const picker = new Datepicker(input, options);
      picker.isOpen().should.be.false;
    });

    it('opens the container', () => {
      const picker = new Datepicker(input, options);

      picker.open();
      picker.isOpen().should.be.true;
    });

    it('does not open an open container', () => {
      options.onOpen = () => {}
      const opener = sinon.stub(options, 'onOpen');
      const picker = new Datepicker(input, options);

      picker.open();
      picker.open();

      expect(opener).to.have.been.called.once;
    });

    it('closes the container', () => {
      const picker = new Datepicker(input, options);

      picker.open();
      picker.close();
      picker.isOpen().should.be.false;
    });

    it('does not close an closed container', () => {
      options.onClose = () => {}
      const closer = sinon.stub(options, 'onClose');
      const picker = new Datepicker(input, options);

      picker.open();
      picker.close();
      picker.close();

      expect(closer).to.have.been.called.once;
    });

    it('selects the date', () => {
      const picker = new Datepicker(input, options);

      picker.selectDate('2015-01-20');
      picker.date.format('YYYY-MM-DD').should.equal('2015-01-20');
    });

    it('selects the date and calls callback', () => {
      options.onSelectDate = () => {}
      const selector = sinon.stub(options, 'onSelectDate');
      const picker = new Datepicker(input, options);

      picker.selectDate('2015-01-20');
      expect(selector).to.have.been.called.once;
    });
  });
});

