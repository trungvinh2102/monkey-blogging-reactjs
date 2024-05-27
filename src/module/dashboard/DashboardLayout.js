import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/auth-context";
import PageNotFound from "../../pages/PageNotFound";
import { roleStatus } from "../../utils/constants";
import UserProfile from "../user/UserProfile";
const DashboardStyles = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  .dashboard {
    &-heading {
      font-weight: bold;
      font-size: 36px;
      color: ${(props) => props.theme.primary};
      letter-spacing: 1px;
    }
    &-main {
      display: grid;
      grid-template-columns: 300px minmax(0, 1fr);
      padding: 40px 20px;
      gap: 0 40px;
      align-items: start;
    }
    @media screen and (max-width: 1023.98px) {
      &-heading {
        font-size: 20px;
      }
      &-short-desc {
        margin-bottom: 25px;
      }
      &-main {
        grid-template-columns: 100%;
        padding: 20px;
      }
    }
  }
`;
const DashboardLayout = () => {
  const { userInfo } = useAuth();
  if (!userInfo) return <PageNotFound></PageNotFound>;
  return (
    <DashboardStyles>
      <DashboardHeader></DashboardHeader>
      {userInfo.role === roleStatus.ADMIN ? (
        <div className="dashboard-main">
          <Sidebar></Sidebar>
          <div className="dashboard-children">
            <Outlet></Outlet>
          </div>
        </div>
      ) : (
        <div className="container">
          <UserProfile></UserProfile>
        </div>
      )}
    </DashboardStyles>
  );
};

export default DashboardLayout;
