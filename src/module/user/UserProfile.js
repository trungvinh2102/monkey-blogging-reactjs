import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import ImageUpload from "../../components/image/ImageUpload";
import { db } from "../../firebase-app/firebase-config";
import InputTogglePassword from "../../components/input/InputTogglePassword";
import { doc, updateDoc } from "firebase/firestore";

const UserProfile = () => {
  const { userInfo } = useAuth();
  console.log(userInfo);

  const {
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting, isValid },
  } = useForm({ mode: "onChange" });

  const imageUrl = watch("avatar");

  //
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const { image, setImage, progress, handleDeleteAvatar, handleSelectImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

  //
  useEffect(() => {
    setImage(imageUrl);
  }, [setImage, imageUrl]);

  //
  async function deleteAvatar() {
    const colRef = doc(db, "users", userInfo);
    await updateDoc(colRef, {
      avatar: "",
    });
  }

  //
  useEffect(() => {
    function fetchData() {
      reset(userInfo);
    }
    fetchData();
  }, [userInfo, reset]);

  const handleUpdateProfile = () => {
    if (!isValid) return;
  };

  return (
    <>
      <div className="mt-12"></div>
      <DashboardHeading
        title="Account information"
        desc="Update your account information"
      ></DashboardHeading>
      {/* image */}
      <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
        <ImageUpload
          className="!rounded-full h-full"
          handleDeleteImage={handleDeleteAvatar}
          image={image}
          progress={progress}
          onChange={handleSelectImage}
        ></ImageUpload>
      </div>
      {/* form */}
      <form autoComplete="off" onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              type="text"
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              type="text"
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <InputTogglePassword control={control}></InputTogglePassword>
          </Field>
        </div>
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Update profile
        </Button>
      </form>
    </>
  );
};

export default UserProfile;
