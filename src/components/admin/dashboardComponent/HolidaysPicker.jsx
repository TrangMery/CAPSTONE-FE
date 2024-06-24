import React, { useState } from "react";
import { DatePicker, Button } from "antd";

const HolidaysPicker = () => {
  const [holidays, setHolidays] = useState([]);

  const handleHolidaysChange = (dates) => {
    setHolidays(dates);
  };

  const handleSubmit = () => {
    console.log(
      "Holidays:",
      holidays.map((date) => date.format("YYYY-MM-DD"))
    );
  };

  return (
    <div>
      <label>Holidays</label>
      <DatePicker.RangePicker
        mode={["date", "date"]}
        onCalendarChange={handleHolidaysChange}
        value={holidays}
      />
      <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 8 }}>
        Submit
      </Button>
    </div>
  );
};

export default HolidaysPicker;
