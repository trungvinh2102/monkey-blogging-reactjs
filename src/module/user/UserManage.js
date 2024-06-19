import React from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserTable from "./UserTable";
import { Button } from "../../components/button";
import { useAuth } from "../../contexts/auth-context";
import { roleStatus } from "../../utils/constants";

const UserManage = () => {
  //
  const { userInfo } = useAuth();
  if (userInfo.role !== roleStatus.ADMIN) return null;
  return (
    <div>
      <DashboardHeading title="Người dùng" desc="Quản lí người dùng">
        <Button type="button" to="/manage/add-user" kind="ghost">
          Thêm người dùng
        </Button>
      </DashboardHeading>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
