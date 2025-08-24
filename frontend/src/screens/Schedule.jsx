import React, { useEffect, useState } from "react";
import ScheduleList from "../components/Schedule/ScheduleList";
import AddScheduleModal from "../components/Schedule/AddScheduleModal";
import { useDispatch, useSelector } from "react-redux";
import { addSchedule, fetchSchedules } from "../store/slices/schedule";

const SchedulePage = () => {
  const dispatch = useDispatch();
  const [showAddSchedule, setShowAddSchedule] = useState(false);

  const expenses = useSelector((state) => state.kitchen?.expenses);
  const balances = useSelector((state) => state.kitchen?.balances);
  const members = useSelector((state) => state.kitchen?.members);
  const schedule = useSelector((state) => state?.schedule.schedules);
  const { user } = useSelector((state) => state.user);

  const handleAddSchedule = (newSchedule) => {
    dispatch(addSchedule(newSchedule));
    setShowAddSchedule(false);
  };

  useEffect(() => {
    if (user?.kitchen) {
      dispatch(fetchSchedules(user.kitchen));
    }
  }, [user?.kitchen, dispatch]);

  return (
    <>
      <ScheduleList
        schedule={schedule}
        showAddSchedule={() => setShowAddSchedule(true)}
        members={members}
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
