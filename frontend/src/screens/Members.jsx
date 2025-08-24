import React from "react";
import MemberList from "../components/Members/MemberList";
import { useSelector } from "react-redux";

const MembersPage = () => {

  const expenses = useSelector((state) => state?.expenses.expenses);
  const balances = useSelector((state) => state.expenses?.balances);
  const members = useSelector((state) => state.kitchen?.members);
  const schedule = useSelector((state) => state.kitchen?.schedule);
  const inventory = useSelector((state) => state?.inventory.items);

  return (
    <MemberList
      members={members}
      inventory={inventory}
      expenses={expenses}
      schedule={schedule}
      balances={balances}
    />
  );
};

export default MembersPage;
