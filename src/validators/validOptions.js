import moment from 'moment';

function validOptions(input, options) {
  const validOptionKeys = [
    'formatInput',
    'date',
    'parent',
    'display',
    'formatDisplay',
    'button',
    'min',
    'max',
    'filter',
    'onOpen',
    'onClose',
    'onSelectDate'
  ];

  let valid = true;

  if (!input) {
    console.error('Option \'input\' is required');
    return false;
  } else if (input.type === 'hidden' && (!options || !options.display)) {
    console.error(
      'Option \'input\' may only be of type \'hidden\' if a \'display\' element is configured'
    );
    return false;
  }

  if (options) {
    Object.keys(options).forEach((option) => {
      if (validOptionKeys.indexOf(option) < 0) {
        console.warn(`Option '${option}' is not supported by the date picker`);
      }
    });

    ['date', 'min', 'max'].forEach((dateKey) => {
      if (options[dateKey] && moment(options[dateKey]).toString() === 'Invalid date') {
        console.error(`Option '${dateKey}' must be a valid date string or object`);
        valid = false;
      }
    });

    ['onOpen', 'onClose', 'onSelectDate'].forEach((callback) => {
      if (options[callback] && typeof options[callback] !== 'function') {
        console.error(`Option '${callback}' must be a function`);
        valid = false;
      }
    });

    if (options.filter) {
      if (typeof options.filter !== 'function' || typeof options.filter(moment()) !== 'boolean') {
        console.error('Optional \'filter\' function must accept a moment and return a boolean');
        valid = false;
      }
    }
  }

  return valid;
}

export default validOptions;
