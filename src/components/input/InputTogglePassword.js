import React, { useState } from "react";
import Input from "./Input";
import { IconClose, IconOpen } from "../icon";

const InputTogglePassword = ({ control }) => {
  const [togglePassword, setTogglePassword] = useState(false);

  return (
    <>
      <Input
        type={togglePassword ? "text" : "password"}
        id="password"
        name="password"
        placeholder="Please enter your password"
        control={control}
      >
        {!togglePassword ? (
          <IconClose onClick={() => setTogglePassword(true)}></IconClose>
        ) : (
          <IconOpen onClick={() => setTogglePassword(false)}></IconOpen>
        )}
      </Input>
    </>
  );
};

export default InputTogglePassword;
