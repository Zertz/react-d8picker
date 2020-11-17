() => {
  const [startDate, setStartDate] = useState(new Date());
  const highlightWithRanges = [
    {
      "react-datepicker__day--highlighted-custom-1": [
        add(new Date(), { days: -4 }),
        add(new Date(), { days: -3 }),
        add(new Date(), { days: -2 }),
        add(new Date(), { days: -1 }),
      ],
    },
    {
      "react-datepicker__day--highlighted-custom-2": [
        add(new Date(), { days: 1 }),
        add(new Date(), { days: 2 }),
        add(new Date(), { days: 3 }),
        add(new Date(), { days: 4 }),
      ],
    },
  ];
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      highlightDates={highlightWithRanges}
      placeholderText="This highlight two ranges with custom classes"
    />
  );
};
