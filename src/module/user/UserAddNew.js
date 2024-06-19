import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import { Button } from "../../components/button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { roleStatus, userStatus } from "../../utils/constants";
import slugify from "slugify";
import { auth, db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import InputTogglePassword from "../../components/input/InputTogglePassword";

const UserAddNew = () => {
  // get props in react-hook-form
  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    // default values in form
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      username: "",
      avatar: "",
      status: userStatus.ACTIVE,
      role: roleStatus.USER,
      createdAt: new Date(),
    },
  });

  // get props in custom hook useFirebaseImage
  const {
    image,
    progress,
    handleDeleteImage,
    handleSelectImage,
    handleResetUpload,
  } = useFirebaseImage(setValue, getValues);

  // get watch to click option
  const watchStatus = watch("status");
  const watchRole = watch("role");

  // handle add new user to the form
  const handleAddNewUser = async (values) => {
    if (!isValid) return;
    try {
      // add new user authentication in firebase
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      // add new document user in collection "users"
      await addDoc(collection(db, "users"), {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.fullname, {
          lower: true,
          replacement: "",
          trim: true,
        }),
        avatar: image,
        // Number(): convert string --> number
        status: Number(values.status),
        role: Number(values.role),
        createdAt: serverTimestamp(),
      });
      toast.success(
        `Thêm người dùng bằng email: ${values.email} thành công!`
      );
      // reset form to default value
      reset({
        fullname: "",
        email: "",
        password: "",
        username: "",
        avatar: "",
        status: userStatus.ACTIVE,
        role: roleStatus.USER,
        createdAt: new Date(),
      });
      handleResetUpload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/* heading */}
      <DashboardHeading
        title="Người dùng"
        desc="Thêm người dùng"
      ></DashboardHeading>
      {/* image */}
      <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
        <ImageUpload
          className="!rounded-full h-full"
          handleDeleteImage={handleDeleteImage}
          image={image}
          progress={progress}
          onChange={handleSelectImage}
        ></ImageUpload>
      </div>
      {/* form */}
      <form autoComplete="off" onSubmit={handleSubmit(handleAddNewUser)}>
        <div className="form-layout">
          <Field>
            <Label>Họ và tên</Label>
            <Input
              type="text"
              name="fullname"
              placeholder="Nhập họ và tên"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              type="text"
              name="username"
              placeholder="Nhập username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Nhập email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Mật khẩu</Label>
            <InputTogglePassword control={control}></InputTogglePassword>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Trạng thái</Label>
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
            <Label>Phân quyền</Label>
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
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Add new user
        </Button>
      </form>
    </>
  );
};

export default UserAddNew;
