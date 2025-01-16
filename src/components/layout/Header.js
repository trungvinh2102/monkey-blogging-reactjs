import styled from "styled-components";
import { useAuth } from "../../contexts/auth-context";
import { NavLink } from "react-router-dom";
import { Button } from "../button";
import { roleStatus } from "../../utils/constants";

const menuLinks = [
  {
    url: "/",
    title: "Trang chủ",
  },
  {
    url: "/blog",
    title: "Bài viết",
  },
  {
    url: "/contact",
    title: "Liên hệ",
  },
];

const HeaderStyles = styled.header`
  padding: 20px 0;
  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-auth {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .logo {
    display: block;
    max-width: 50px;
  }
  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
    list-style: none;
    font-weight: 500;
  }
  .search {
    margin-left: auto;
    padding: 15px 25px;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 20px;
  }
  .search-input {
    flex: 1;
    padding-right: 45px;
    font-weight: 500;
  }
  .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 25px;
  }

  .menu-link {
    font-size: 18px;
  }

  .menu-link:hover {
    color: ${(props) => props.theme.primary};
  }

  @media screen and (max-width: 1023.98px) {
    .logo {
      max-width: 30px;
    }
    .menu,
    .search,
    .header-button,
    .header-auth {
      display: none;
    }
  }
`;
const Header = () => {
  const { userInfo } = useAuth();
  const navigate =
    Number(userInfo?.role) === roleStatus.ADMIN ? "/dashboard" : "/profile";
  return (
    <HeaderStyles>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <div className="flex items-center justify-center gap-x-3">
              <img
                srcSet="/logo.png 2x"
                alt="monkey-blogging"
                className="logo"
              />
              <h1 className="mt-2 text-lg font-semibold hover:text-primary">
                Monkey Blogging
              </h1>
            </div>
          </NavLink>
          <ul className="menu">
            {menuLinks.map((item) => (
              <li className="ml-5 menu-item" key={item.title}>
                <NavLink to={item.url} className="menu-link">
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
          {!userInfo ? (
            <Button
              type="button"
              height="56px"
              className="header-button"
              to="/sign-in"
            >
              Đăng nhập
            </Button>
          ) : (
            <div className="header-auth">
              <Button
                type="button"
                height="56px"
                className="header-button"
                to={navigate}
              >
                {Number(userInfo?.role) === roleStatus.ADMIN
                  ? "Dashboard"
                  : "Profile"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
};

export default Header;
