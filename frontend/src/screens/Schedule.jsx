import React, { useState } from "react";
import ScheduleList from "../components/Schedule/ScheduleList";
import AddScheduleModal from "../components/Schedule/AddScheduleModal";
import { useSelector } from "react-redux";
import { addSchedule } from "../store/slices/kitchen";

const SchedulePage = () => {
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  
  const expenses = useSelector((state) => state.kitchen?.expenses);
  const balances = useSelector((state) => state.kitchen?.balances);
  const members = useSelector((state) => state.kitchen?.members);
  const schedule = useSelector((state) => state.kitchen?.schedule);

  const handleAddSchedule = (newSchedule) => {
    addSchedule([...schedule, newSchedule]);
  };

  return (
    <>
      <ScheduleList
        schedule={schedule}
        showAddSchedule={() => setShowAddSchedule(true)}
      />
      <AddScheduleModal
        show={showAddSchedule}
        onClose={() => setShowAddSchedule(false)}
        members={members}
        onAddSchedule={handleAddSchedule}
      />
    </>
  );
};

export default SchedulePage;
