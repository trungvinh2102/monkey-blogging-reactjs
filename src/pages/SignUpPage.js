import React, { useEffect } from "react";
import { Label } from "../components/label";
import { Field } from "../components/field";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase-app/firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";
import slugify from "slugify";
import { roleStatus, userStatus } from "../utils/constants";
import InputTogglePassword from "../components/input/InputTogglePassword";

const schema = yup.object({
  fullname: yup.string().required("Vui lòng nhập đầy đủ họ và tên"),
  email: yup
    .string()
    .email("Vui lòng nhập địa chỉ email hợp lệ")
    .required("Vui lòng nhập địa chỉ email"),
  password: yup
    .string()
    .min(8, "Vui lòng nhập 8 ký tự trở lên")
    .required("Vui lòng nhập mật khẩu"),
  cpassword: yup
    .string()
    .min(8, "Vui lòng nhập 8 ký tự trở lên")
    .required("Vui lòng nhập mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const password = watch("password", "");

  const handleSubmitForm = async (values) => {
    if (!isValid) return;

    await createUserWithEmailAndPassword(auth, values.email, values.password);
    await updateProfile(auth.currentUser, {
      displayName: values.fullname,
      photoURL:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      status: userStatus.ACTIVE,
      role: roleStatus.USER,
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "users", auth.currentUser.uid), {
      fullname: values.fullname,
      email: values.email,
      password: values.password,
      username: slugify(values.fullname, { lower: true }),
      avatar:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      status: Number(userStatus.ACTIVE),
      role: Number(roleStatus.USER),
      createdAt: serverTimestamp(),
    });
    toast.success("Đăng kí tài khoản thành công!!!");
    navigate("/sign-in");
  };
  useEffect(() => {
    document.title = "Register Page";
  }, []);
  return (
    <AuthenticationPage>
      <form
        className="form"
        autoComplete="off"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <Field>
          <Label htmlFor="fullname">Họ và tên</Label>
          <Input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Nhập họ và tên"
            control={control}
            error={errors.fullname?.message}
          />
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Nhập email"
            control={control}
            error={errors.email?.message}
          />
        </Field>
        <Field>
          <Label htmlFor="password">Mật khẩu</Label>
          <InputTogglePassword
            error={errors.password?.message}
            control={control}
          ></InputTogglePassword>
        </Field>

        {password && (
          <Field>
            <Label htmlFor="cpassword">Nhập lại mật khẩu</Label>
            <InputTogglePassword
              error={errors.cpassword?.message}
              control={control}
              name="cpassword"
            ></InputTogglePassword>
          </Field>
        )}
        <div className="have-account">
          Bạn đã có tài khoản? &nbsp;
          <NavLink to={"/sign-in"}>Đăng nhập</NavLink>
        </div>
        <Button
          kind="linear"
          style={{
            maxWidth: "300px",
            width: "100%",
            margin: "0 auto",
          }}
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Đăng kí
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
