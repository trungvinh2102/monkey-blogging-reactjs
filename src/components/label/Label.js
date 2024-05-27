import React from "react";
import styled from "styled-components";

const LabelStyles = styled.div`
  .label {
    color: ${(props) => props.theme.grayDark};
    font-size: 18px;
    font-weight: 600;
  }
`;

const Label = ({ htmlFor = "", children, ...props }) => {
  return (
    <LabelStyles>
      <label htmlFor={htmlFor} {...props} className="label">
        {children}
      </label>
    </LabelStyles>
  );
};

export default Label;
