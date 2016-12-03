import { handleVisibilityEvents, openPickerHandler, escapePickerHandler, exitPickerHandler } from './handleVisibilityEvents';

describe('handleVisibilityEvents functions', () => {
  const picker = {
    container: document.createElement('div'),
    monthContainer: document.createElement('div'),
    input: document.createElement('input'),
    open: () => {},
    close: () => {}
  };

  let openStub;
  let closeStub;

  before(() => {
    picker.monthContainer.appendChild(document.createElement('a'));
    picker.monthContainer.querySelector('a').className = 'selected';
  });

  beforeEach(() => {
    openStub = sinon.stub(picker, 'open');
    closeStub = sinon.stub(picker, 'close');
  });

  afterEach(() => {
    picker.open.restore();
    picker.close.restore();
  });

  describe('exitPickerHandler', () => {
    it('does nothing if event default has been prevented', () => {
      const e = { defaultPrevented: true }
      exitPickerHandler.bind(picker)(e);

      closeStub.should.not.have.been.called;
    });

    it('calls close on the picker is default has not been prevented', () => {
      const e = { defaultPrevented: false }
      exitPickerHandler.bind(picker)(e);

      closeStub.should.have.been.called;
    });
  });

  describe('escapePickerHandler', () => {
    it('does nothing if pressed key is not escape', () => {
      const e = {};
      escapePickerHandler.bind(picker)(e);

      closeStub.should.not.have.been.called;
    });

    it('calls close on the picker if key is escape', () => {
      const e = { key: 'Escape' };
      escapePickerHandler.bind(picker)(e);

      closeStub.should.have.been.called;
    });

    it('calls close on the picker on fallback keyCode for escape', () => {
      const e = { keyCode: '27' };
      escapePickerHandler.bind(picker)(e);

      closeStub.should.have.been.called;
    });
  });

  describe('openPickerHandler', () => {
    const e = { preventDefault: () => {} };
    const preventDefaultStub = sinon.stub(e, 'preventDefault');
    let dateFocusStub;

    beforeEach(() => {
      dateFocusStub = sinon.stub(picker.monthContainer.querySelector('a'), 'focus');
    });

    afterEach(() => {
      picker.monthContainer.querySelector('a').focus.restore();
    });

    it('prevents default event action', () => {
      openPickerHandler.bind(picker)(e);

      preventDefaultStub.should.have.been.called;
    });

    it('calls open on the picker', () => {
      openPickerHandler.bind(picker)(e);

      openStub.should.have.been.called;
    });

    it('focuses the selected element', () => {
      openPickerHandler.bind(picker)(e);

      dateFocusStub.should.have.been.called;
    });
  });

  describe('handleVisibilityEvents', () => {
    let htmlListenerStub = sinon.stub(document.querySelector('html'), 'addEventListener');
    let inputListenerStub = sinon.stub(picker.input, 'addEventListener');
    let containerListenerSpy = sinon.spy(picker.container, 'addEventListener');

    beforeEach(() => {
      picker.display = null;
      picker.button = null;
    });

    afterEach(() => {
      htmlListenerStub.reset();
      inputListenerStub.reset();
    });

    it('listens for keyup and click on the top-level html element', () => {
      handleVisibilityEvents.bind(picker)();

      htmlListenerStub.should.have.been.calledWith('keyup');
      htmlListenerStub.should.have.been.calledWith('click');
    });

    it('listens for focus and click on the input element', () => {
      handleVisibilityEvents.bind(picker)();

      inputListenerStub.should.have.been.calledWith('focus');
      inputListenerStub.should.have.been.calledWith('click');
    });

    it('listens for focus and click on display if there is one', () => {
      picker.display = document.createElement('span');
      picker.display.tabIndex = 1;
      let displayListenerStub = sinon.stub(picker.display, 'addEventListener');

      handleVisibilityEvents.bind(picker)();

      displayListenerStub.should.have.been.calledWith('focus');
      displayListenerStub.should.have.been.calledWith('click');
      inputListenerStub.should.not.have.been.calledWith('focus');
      inputListenerStub.should.not.have.been.calledWith('click');
    });

    it('listens for click on button if there is one', () => {
      picker.button = document.createElement('button');
      picker.display = document.createElement('span');
      let buttonListenerStub = sinon.stub(picker.button, 'addEventListener');
      let displayListenerStub = sinon.stub(picker.display, 'addEventListener');

      handleVisibilityEvents.bind(picker)();

      buttonListenerStub.should.have.been.calledWith('click');
      displayListenerStub.should.not.have.been.calledWith('focus');
      displayListenerStub.should.not.have.been.calledWith('click');
    });

    it('prevents default action on click of the container element', () => {
      //const e = { preventDefault: () => {} };
      const event = document.createEvent('MouseEvent');
      event.initEvent('click', true, false);
      const preventDefaultListenerStub = sinon.stub(event, 'preventDefault');

      handleVisibilityEvents.bind(picker)();

      containerListenerSpy.should.have.been.calledWith('click');

      picker.container.dispatchEvent(event);

      preventDefaultListenerStub.should.have.been.called;
    });
  });
});
