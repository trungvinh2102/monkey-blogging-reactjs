import React, { useState } from "react";
import Input from "./Input";
import { IconClose, IconOpen } from "../icon";

const InputTogglePassword = ({ control, error = "", name = "password" }) => {
  const [togglePassword, setTogglePassword] = useState(false);

  return (
    <>
      <Input
        type={togglePassword ? "text" : "password"}
        id={name}
        name={name}
        placeholder="Emter your password"
        error={error}
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
