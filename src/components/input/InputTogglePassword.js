import React, { useState } from "react";
import Input from "./Input";
import { IconClose, IconOpen } from "../icon";

const InputTogglePassword = ({ control, error = '' }) => {
  const [togglePassword, setTogglePassword] = useState(false);

  return (
    <>
      <Input
        type={togglePassword ? "text" : "password"}
        id="password"
        name="password"
        placeholder="Nhập mật khẩu"
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
