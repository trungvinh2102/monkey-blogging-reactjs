import styled from "styled-components";
import { useAuth } from "../../contexts/auth-context";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../../components/button";
import { roleStatus } from "../../utils/constants";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-app/firebase-config";

const DashboardHeaderStyles = styled.div`
  background-color: white;
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  .logo {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 18px;
    font-weight: 600;
    img {
      max-width: 40px;
    }
  }
  .header-avatar {
    width: 52px;
    height: 52px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100rem;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
`;

const DashboardHeader = () => {
  const { userInfo } = useAuth();

  return (
    <DashboardHeaderStyles>
      <NavLink to="/" className="logo">
        <img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />
        <span className="hidden lg:inline-block">Monkey Blogging</span>
      </NavLink>
      <div className="header-right">
        {Number(userInfo.role) === roleStatus.ADMIN ? (
          <Button to="/manage/add-post" className="header-button" height="52px">
            Add New Post
          </Button>
        ) : (
          <Button
            onClick={() => signOut(auth)}
            className="header-button"
            height="52px"
          >
            Logout
          </Button>
        )}

        <Link to={`/profile?`} className="header-avatar">
          <img src={userInfo?.avatar} alt="" />
        </Link>
      </div>
    </DashboardHeaderStyles>
  );
};

export default DashboardHeader;
