"use client";
import useUserSelector from "@/app/hooks/AppSelector";
import UserCard from "./UserCard";
const IfTheUserLogin = () => {
  const user = useUserSelector();

  return (
    <div>
      <UserCard user={user} />
    </div>
  );
};

export default IfTheUserLogin;
