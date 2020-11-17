() => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      highlightDates={[
        add(new Date(), { days: -7 }),
        add(new Date(), { days: 7 }),
      ]}
      placeholderText="This highlights a week ago and a week from today"
    />
  );
};
