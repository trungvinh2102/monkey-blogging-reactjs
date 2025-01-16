import React from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserTable from "./UserTable";
import { Button } from "../../components/button";
import { useAuth } from "../../contexts/auth-context";
import { roleStatus } from "../../utils/constants";

const UserManage = () => {
  //
  const { userInfo } = useAuth();
  if (Number(userInfo.role) !== roleStatus.ADMIN) return null;
  return (
    <div>
      <DashboardHeading title="Users" desc="User manager">
        <Button type="button" to="/manage/add-user" kind="ghost">
          Add new user
        </Button>
      </DashboardHeading>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
