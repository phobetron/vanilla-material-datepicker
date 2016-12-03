function clearMonths() {
  while (this.monthContainer.children.length > 0) {
    this.monthContainer.removeChild(this.monthContainer.children[0]);
  }

  this.months.splice(0);
}

export default clearMonths;
