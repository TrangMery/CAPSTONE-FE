import React, { useState } from "react";
import { Steps } from "antd";
import PickMember from "./PickMember";
import AddCouncilTable from "./AddCouncilTable";

const AddCouncil = () => {
  const [current, setCurrent] = useState(0);
  const [firstMember, setFirstMenber] = useState();
  const [time, setTime] = useState();
  const [meetingDuration, setMeetingDateDuration] = useState();
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "Bước 1",
      content: (
        <PickMember
          next={next}
          setFirstMenber={setFirstMenber}
          setTime={setTime}
          setMeetingDateDuration={setMeetingDateDuration}
        />
      ),
    },
    {
      title: "Bước 2",
      content: (
        <AddCouncilTable
          prev={prev}
          firstMember={firstMember}
          time={time}
          meetingDuration={meetingDuration}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <>
      <Steps current={current} items={items} />
      <div style={{ marginTop: "10px" }}>{steps[current].content}</div>
      <div
        style={{
          marginTop: 24,
        }}
      ></div>
    </>
  );
};
export default AddCouncil;
