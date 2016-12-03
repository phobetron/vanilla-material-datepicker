function exitPickerHandler(e) {
  if (!e.defaultPrevented) { this.close(); }
}

function escapePickerHandler(e) {
  if (e.key === 'Escape' || e.keyCode === '27') { this.close(); }
}

function openPickerHandler(e) {
  e.preventDefault();

  this.open();
  this.monthContainer.querySelector('.selected').focus();
}

function handleVisibilityEvents() {
  const html = document.querySelector('html');

  if (this.button) {
    this.button.addEventListener('click', openPickerHandler.bind(this));
  } else if (this.display) {
    this.display.addEventListener('focus', openPickerHandler.bind(this));
    this.display.addEventListener('click', openPickerHandler.bind(this));
  } else {
    this.input.addEventListener('focus', openPickerHandler.bind(this));
    this.input.addEventListener('click', openPickerHandler.bind(this));
  }

  this.container.addEventListener('click', (e) => { e.preventDefault(); });

  html.addEventListener('keyup', escapePickerHandler.bind(this));
  html.addEventListener('click', exitPickerHandler.bind(this));
}

export { handleVisibilityEvents, openPickerHandler, escapePickerHandler, exitPickerHandler };
