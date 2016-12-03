import { renderContainer, renderContainerHeader } from './renderContainer';

describe('renderContainer functions', () => {
  const picker = {
    parent: document.createElement('div'),
    container: document.createElement('div'),
    monthContainer: document.createElement('div')
  };

  describe('renderContainerHeader', () => {
    it('returns a header table', () => {
      const header = renderContainerHeader.bind(picker)();

      header.querySelectorAll('th').should.have.length(7);
    });
  });

  describe('renderContainer', () => {
    let parentAppendSpy;
    let containerAppendSpy;
    let monthContainerListenerSpy;

    beforeEach(() => {
      parentAppendSpy = sinon.spy(picker.parent, 'appendChild');
      containerAppendSpy = sinon.spy(picker.container, 'appendChild');
      monthContainerListenerSpy = sinon.spy(picker.monthContainer, 'addEventListener');
    });

    afterEach(() => {
      picker.parent.appendChild.restore();
      picker.container.appendChild.restore();
      picker.monthContainer.addEventListener.restore();
    });

    it('adds the container to the parent element', () => {
      renderContainer.bind(picker)();

      parentAppendSpy.should.have.been.calledWith(picker.container);
    });

    it('adds the header to the container', () => {
      renderContainer.bind(picker)();

      containerAppendSpy.should.have.been.called.twice;
      picker.container.querySelector('.datepicker-header').should.not.be.null;
    });

    it('adds the monthContainer to the container', () => {
      renderContainer.bind(picker)();

      containerAppendSpy.should.have.been.calledWith(picker.monthContainer);
    });

    it('adds a scroll listener to the monthContainer', () => {
      renderContainer.bind(picker)();

      monthContainerListenerSpy.should.have.been.calledWith('scroll');
    });
  });
});
