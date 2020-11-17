() => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  return (
    <DatePicker
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      monthsShown={2}
      selectsRange
      value={
        startDate && endDate
          ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
          : undefined
      }
    />
  );
};
