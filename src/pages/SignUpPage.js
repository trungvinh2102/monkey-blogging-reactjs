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
  fullname: yup.string().required("Please enter your fullname"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Please enter 8 characters or larger")
    .required("Please enter your password"),
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

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
      status: userStatus.ACTIVE,
      role: userStatus.USER,
      createdAt: serverTimestamp(),
    });
    toast.success("Register Succesfully!!!");
    navigate("/");
  };
  useEffect(() => {
    const arrayError = Object.values(errors);
    if (arrayError.length > 0) {
      toast.error(arrayError[0]?.message, {
        pauseOnHover: false,
      });
    }
  }, [errors]);
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
          <Label htmlFor="fullname">Fullname</Label>
          <Input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Please enter your fullname"
            control={control}
          />
        </Field>

        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Please enter your email address"
            control={control}
          />
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <InputTogglePassword control={control}></InputTogglePassword>
        </Field>
        <div className="have-account">
          Do you already have an accout? &nbsp;
          <NavLink to={"/sign-in"}>Login</NavLink>
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
          Sign Up
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
