import React, { useEffect } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useForm } from "react-hook-form";
import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import { roleStatus, userStatus } from "../../utils/constants";
import { Button } from "../../components/button";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import { Textarea } from "../../components/textarea";
import InputTogglePassword from "../../components/input/InputTogglePassword";

const UserUpdate = () => {
  // get id
  const [params] = useSearchParams();
  const userId = params.get("id");

  //
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { isValid, isSubmitting },
  } = useForm({ mode: "onChange" });

  //
  const watchStatus = watch("status");
  const watchRole = watch("role");
  const imageUrl = watch("avatar");

  //
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const { image, setImage, progress, handleDeleteImage, handleSelectImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

  //
  const handleUpdateUser = async (values) => {
    if (!isValid) return;
    try {
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        ...values,
        avatar: image,
      });
      toast.success("Update user sucessfully!");
    } catch (error) {
      toast.error("Updating a category failed!");
    }
  };

  //
  useEffect(() => {
    async function fetchDataUser() {
      const colRef = doc(db, "users", userId);
      const singleDoc = await getDoc(colRef);
      reset(singleDoc && singleDoc.data());
    }
    fetchDataUser();
  }, [userId, reset]);

  //
  useEffect(() => {
    setImage(imageUrl);
  }, [setImage, imageUrl]);

  //
  async function deleteAvatar() {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      avatar: "",
    });
  }

  if (!userId) return null;
  return (
    <div>
      <DashboardHeading title="User" desc="Update user"></DashboardHeading>
      <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
        <ImageUpload
          className="!rounded-full h-full"
          handleDeleteImage={handleDeleteImage}
          image={image}
          progress={progress}
          onChange={handleSelectImage}
        ></ImageUpload>
      </div>
      <form autoComplete="off" onSubmit={handleSubmit(handleUpdateUser)}>
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
              disabled={true}
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <InputTogglePassword control={control}></InputTogglePassword>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                value={userStatus.ACTIVE}
                checked={Number(watchStatus) === userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                value={userStatus.PENDING}
                checked={Number(watchStatus) === userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                value={userStatus.BAN}
                checked={Number(watchStatus) === userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                value={roleStatus.ADMIN}
                checked={Number(watchRole) === roleStatus.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                value={roleStatus.MOD}
                checked={Number(watchRole) === roleStatus.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                value={roleStatus.EDITOR}
                checked={Number(watchRole) === roleStatus.EDITOR}
              >
                Editor
              </Radio>
              <Radio
                name="role"
                control={control}
                value={roleStatus.USER}
                checked={Number(watchRole) === roleStatus.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div>
          <Field>
            <Label>Note</Label>
            <Textarea name="description" control={control}></Textarea>
          </Field>
        </div>
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Update User
        </Button>
      </form>
    </div>
  );
};

export default UserUpdate;
