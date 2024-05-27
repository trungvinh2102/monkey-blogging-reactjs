import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const AuthenticationPageStyles = styled.div`
  .logo {
    margin: 25px auto;
    width: 121px;
    height: 156px;
    flex-shrink: 0;
  }
  .heading {
    text-align: center;
    color: ${(props) => props.theme.primary};
    font-size: 35px;
    font-weight: 600;
    margin-bottom: 25px;
  }

  .have-account {
    margin-bottom: 20px;
    font-size: 14px;
    a {
      display: inline-block;
      color: ${(props) => props.theme.primary};
      font-weight: 500;
    }
  }
`;

const AuthenticationPage = ({ children }) => {
  return (
    <AuthenticationPageStyles>
      <div className="container">
        <NavLink to={"/"}>
          <img srcSet="./logo.png 2x" alt="Monkey Bloggin" className="logo" />
        </NavLink>
        <h1 className="heading">Monkey Blogging</h1>
        {children}
      </div>
    </AuthenticationPageStyles>
  );
};

export default AuthenticationPage;
