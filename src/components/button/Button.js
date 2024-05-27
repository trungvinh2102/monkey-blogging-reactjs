import React from "react";
import styled, { css } from "styled-components";
import { Loading } from "../loading";
import { NavLink } from "react-router-dom";

const ButtonStyles = styled.button`
  cursor: pointer;
  padding: 0 25px;
  line-height: 1;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  height: ${(props) => props.height || "66px"};
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.kind === "secondary" &&
    css`
      color: ${(props) => props.theme.primary};
      background-color: white;
    `};
  ${(props) =>
    props.kind === "primary" &&
    css`
      color: white;
      background-color: ${(props) => props.theme.primary};
    `};
  ${(props) =>
    props.kind === "ghost" &&
    css`
      color: ${(props) => props.theme.primary};
      background-color: rgba(29, 192, 113, 0.1);
    `};
  ${(props) =>
    props.kind === "linear" &&
    css`
      background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
      );
      color: white;
    `};
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

const Button = ({
  type = "button",
  children,
  kind = "primary",
  onClick = () => {},
  ...props
}) => {
  const { isLoading, to } = props;
  const child = !!isLoading ? <Loading></Loading> : children;
  if (to !== "" && typeof to === "string") {
    return (
      <NavLink to={to}>
        <ButtonStyles kind={kind} type={type} {...props}>
          {child}
        </ButtonStyles>
      </NavLink>
    );
  }
  return (
    <ButtonStyles kind={kind} type={type} {...props} onClick={onClick}>
      {child}
    </ButtonStyles>
  );
};

export default Button;
