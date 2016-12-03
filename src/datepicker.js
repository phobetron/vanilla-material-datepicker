import moment from 'moment';
import validOptions from './validators/validOptions';
import { handleVisibilityEvents } from './events/handleVisibilityEvents';
import { renderContainer } from './renderers/renderContainer';
import populateMonths from './renderers/populateMonths';
import clearMonths from './renderers/clearMonths';
import './datepicker.scss';

const datepickers = [];

function Datepicker(input, options = {}) {
  const defaultDescriptor = {
    writeable: false,
    enumerable: false,
    configurable: false
  };
  const container = document.createElement('aside');
  const monthContainer = document.createElement('div');
  const months = [];
  let open = false;
  let settings;

  if (validOptions(input, options)) {
    settings = {
      date: options.date ? moment(options.date) : moment(),
      formatInput: options.formatInput || 'YYYY-MM-DD',
      parent: options.parent,
      button: options.button,
      display: options.display,
      formatDisplay: options.formatDisplay,
      min: options.min ? moment(options.min) : null,
      max: options.max ? moment(options.max) : null,
      filter: options.filter
    };
  } else { return false; }

  if (settings.button) {
    Object.defineProperty(this, 'button',
        Object.assign({ value: settings.button }, defaultDescriptor));
  }

  if (settings.display) {
    Object.defineProperty(this, 'display',
        Object.assign({ value: settings.display }, defaultDescriptor));
    Object.defineProperty(this, 'formatDisplay',
        Object.assign({ value: settings.formatDisplay || 'MMMM Do, YYYY' }, defaultDescriptor));
  }

  if (settings.min) {
    Object.defineProperty(this, 'min', Object.assign({ value: settings.min }, defaultDescriptor));
  }

  if (settings.max) {
    Object.defineProperty(this, 'max', Object.assign({ value: settings.max }, defaultDescriptor));
  }

  if (settings.filter) {
    Object.defineProperty(this, 'filter',
        Object.assign({ value: settings.filter }, defaultDescriptor));
  }

  Object.defineProperties(this, {
    isOpen: Object.assign({ value: () => open }, defaultDescriptor),
    months: Object.assign({ value: months }, defaultDescriptor),
    container: Object.assign({ value: container }, defaultDescriptor),
    monthContainer: Object.assign({ value: monthContainer }, defaultDescriptor),
    input: Object.assign({ value: input }, defaultDescriptor),
    formatInput: Object.assign({ value: settings.formatInput }, defaultDescriptor),

    parent: Object.assign({
      value: settings.parent || (settings.display ? settings.display.parentNode : input.parentNode)
    }, defaultDescriptor),

    open: Object.assign({
      value: () => {
        if (!open) {
          datepickers.forEach((dp) => { dp.close(); });
          this.container.style.display = 'block';
          populateMonths.bind(this)();
          open = true;
          if (options.onOpen) { options.onOpen.bind(this)(); }
        }
      }
    }, defaultDescriptor),

    close: Object.assign({
      value: () => {
        if (open) {
          this.container.style.display = 'none';
          clearMonths.bind(this)();
          open = false;
          if (options.onClose) { options.onClose.bind(this)(); }
        }
      }
    }, defaultDescriptor),

    selectDate: Object.assign({
      value: (selectedDate) => {
        this.date = selectedDate;
        if (options.onSelectDate) { options.onSelectDate.bind(this)(selectedDate); }
        this.close();
      }
    }, defaultDescriptor),

    date: {
      get: (() => settings.date),
      set: (value) => {
        settings.date = value ? moment(value) : moment();

        this.input.value = settings.date.format(this.formatInput);

        if (this.display) {
          this.display.innerText = settings.date.format(this.formatDisplay);
        }
      }
    }
  });

  datepickers.push(this);
  renderContainer.bind(this)();
  handleVisibilityEvents.bind(this)();
  this.date = settings.date;
}

// Using ES5 syntax so Webpack will output only the main Datepicker object
module.exports = Datepicker;
