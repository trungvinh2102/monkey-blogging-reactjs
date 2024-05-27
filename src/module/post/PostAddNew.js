import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import { Dropdown } from "../../components/dropdown";
import { Button } from "../../components/button";
import { postStatus } from "../../utils/constants";
import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import slugify from "slugify";
import Toggle from "../../components/toggle/Toggle";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { useAuth } from "../../contexts/auth-context";
import { toast } from "react-toastify";
import DashboardHeading from "../dashboard/DashboardHeading";


const PostAddNew = () => {
  // state
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");

  // get userInfo in custom hook auth-context
  const { userInfo } = useAuth();

  // get props in react-hook-form
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: postStatus.PENDING,
      category: {},
      hot: false,
      createdAt: serverTimestamp(),
      image: "",
      user: {},
    },
  });

  // get watch to click option
  const watchStatus = watch("status");
  const watchHot = watch("hot");

  // get props in custom hook useFirebaseImage
  const {
    image,
    progress,
    handleDeleteImage,
    handleSelectImage,
    handleResetUpload,
  } = useFirebaseImage(setValue, getValues);

  //
  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo.email) return;
      const q = query(
        collection(db, "users"),
        where("email", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setValue("user", {
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.email]);

  // handle click option category
  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(item);
  };

  // get collection category in firebase,
  useEffect(() => {
    async function getData() {
      const q = query(
        collection(db, "categories"),
        where("status", "==", postStatus.APPROVED)
      );
      let result = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    }
    getData();
  }, []);

  // handle add new post to the form
  const handleAddPost = async (values) => {
    if (!isValid) return;
    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(values.slug || values.title, { lower: true });
      cloneValues.status = Number(values.status);
      console.log(cloneValues);
      await addDoc(collection(db, "posts"), {
        ...cloneValues,
        image,
        createdAt: serverTimestamp(),
      });
      // display notification with library react-toastify
      toast.success("Create new post successfully!");
      // reset form to default value
      reset({
        title: "",
        slug: "",
        status: 2,
        category: {},
        hot: false,
        image: "",
        user: {},
      });
      handleResetUpload();
      setSelectCategory({});
    } catch (error) {
      console.log(error);
      toast.error("Creating a new post failed!");
    }
  };

  // create a name for the website
  useEffect(() => {
    document.title = "Monkey Blogging - Add new post";
  }, []);

  return (
    <>
      {/* title */}
      <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>

      {/* form */}
      <>
        <form onSubmit={handleSubmit(handleAddPost)} autoComplete="off">
          <div className="form-layout">
            <Field>
              <Label>Title</Label>
              <Input
                type="text"
                control={control}
                placeholder="Enter your title"
                name="title"
                required
              ></Input>
            </Field>
            <Field>
              <Label>Slug</Label>
              <Input
                type="text"
                control={control}
                placeholder="Enter your slug"
                name="slug"
              ></Input>
            </Field>
          </div>
          <div className="form-layout">
            <Field>
              <Label>Images</Label>
              <ImageUpload
                handleDeleteImage={handleDeleteImage}
                image={image}
                progress={progress}
                onChange={handleSelectImage}
              ></ImageUpload>
            </Field>
            <Field>
              <Label>Category</Label>
              <Dropdown>
                <Dropdown.Select placeholder="Please select an option"></Dropdown.Select>
                <Dropdown.List>
                  {/* call and display */}
                  {categories.length > 0 &&
                    categories.map((item) => (
                      <Dropdown.Option
                        key={item.id}
                        onClick={() => handleClickOption(item)}
                      >
                        {item.name}
                      </Dropdown.Option>
                    ))}
                </Dropdown.List>
              </Dropdown>
              {/* call and display */}
              {selectCategory?.name && (
                <span className="inline-block p-3 text-base text-green-500 rounded-lg bg-green-50">
                  {selectCategory?.name}
                </span>
              )}
            </Field>
          </div>
          <div className="form-layout">
            <Field>
              <Label>Feature post</Label>
              <Toggle
                on={watchHot === true}
                onClick={() => {
                  setValue("hot", !watchHot);
                }}
              ></Toggle>
            </Field>
            <Field>
              <Label>Status</Label>
              <FieldCheckboxes>
                <Radio
                  name="status"
                  control={control}
                  checked={Number(watchStatus) === postStatus.APPROVED}
                  value={postStatus.APPROVED}
                >
                  Approved
                </Radio>
                <Radio
                  name="status"
                  control={control}
                  checked={Number(watchStatus) === postStatus.PENDING}
                  value={postStatus.PENDING}
                >
                  Pending
                </Radio>
                <Radio
                  name="status"
                  control={control}
                  checked={Number(watchStatus) === postStatus.REJECT}
                  value={postStatus.REJECT}
                >
                  Reject
                </Radio>
              </FieldCheckboxes>
            </Field>
          </div>
          <Button
            type="submit"
            className="mx-auto w-[200px]"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Add new post
          </Button>
        </form>
      </>
    </>
  );
};

export default PostAddNew;
