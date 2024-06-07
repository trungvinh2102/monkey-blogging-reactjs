import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import PropTypes from "prop-types";

const InputStyles = styled.div`
  position: relative;
  width: 100%;
  .input {
    width: 100%;
    padding: 20px;
    padding: ${(props) =>
    props.hasIcon ? "16px 20px 16px 20px" : "16px 20px"};
    border: 1px solid ${(props) => props.theme.primary};
    background-color: ${(props) => props.theme.white};
    border-radius: 8px;
  }

  .input:-ms-input-placeholder {
    color: #c4c4c4;
  }

  .input::-webkit-input-placeholder {
    color: #c4c4c4;
  }

  .input-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

/**
 * @requires
 * @param {string} type Type of input type "text" | "email" | "password"
 * @returns
 */

const Input = ({
  name = "",
  type = "text",
  placeholder = "",
  control,
  value = "",
  children,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });
  return (
    <InputStyles hasIcon={children ? true : false}>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...field}
        {...props}
        className="input"
      />
      {children ? <div className="input-icon">{children}</div> : null}
    </InputStyles>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(["text", "email", "password"]).isRequired,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  children: PropTypes.node,
};

export default Input;
