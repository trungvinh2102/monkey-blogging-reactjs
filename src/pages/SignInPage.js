import React, { useEffect } from "react";
import { Field } from "../components/field";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { NavLink, useNavigate } from "react-router-dom";
import AuthenticationPage from "./AuthenticationPage";
import { useAuth } from "../contexts/auth-context";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import InputTogglePassword from "../components/input/InputTogglePassword";

const schema = yup.object({
  email: yup
    .string()
    .email("Vui lòng nhập địa chỉ email hợp lệ")
    .required("Vui lòng nhập địa chỉ email"),
  password: yup
    .string()
    .min(8, "Vui lòng nhập 8 ký tự trở lên")
    .required("Vui lòng nhập mật khẩu"),
});

const SignInPage = () => {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Login Page";
    if (userInfo?.email) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);
  const handleSignIn = async (values) => {
    if (!isValid) return;
    const auth = getAuth();
    console.log("handleSignIn ~ auth:", auth);
    await signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        // Signed in 
        toast.success("Đăng nhập thành công!")
      })
      .catch((error) => {
        console.error("handleSignIn ~ error:", error);
        toast.error('Đăng nhập thất bại')
      });
  };

  return (
    <AuthenticationPage>
      <form
        className="form"
        onSubmit={handleSubmit(handleSignIn)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Nhập email"
            control={control}
            error={errors.email?.message}
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="password">Mật khẩu</Label>
          <InputTogglePassword control={control} error={errors.password?.message}></InputTogglePassword>
        </Field>
        <div className="have-account">
          Bạn chưa có tài khoản? &nbsp;
          <NavLink to={"/sign-up"}>Đăng ký tài khoản</NavLink>
        </div>
        <Button
          kind="linear"
          style={{
            maxWidth: "300px",
            width: "100%",
            margin: "0 auto",
          }}
          type="submit"
          className="w-full max-w-[300px] mx-auto"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Đăng nhập
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;
