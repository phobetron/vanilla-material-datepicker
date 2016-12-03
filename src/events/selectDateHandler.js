function selectDateHandler(selectedDate) {
  return (e) => {
    e.preventDefault();

    this.selectDate(selectedDate);
  };
}

export default selectDateHandler;
