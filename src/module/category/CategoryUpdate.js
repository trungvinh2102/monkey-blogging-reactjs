import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import slugify from "slugify";
import { categoryStatus } from "../../utils/constants";
import { toast } from "react-toastify";

export const CategoryUpdate = () => {
  const [params] = useSearchParams();
  const categoryId = params.get("id");
  const navigate = useNavigate();
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm();
  useEffect(() => {
    async function fetchData() {
      const colRef = doc(db, "categories", categoryId);
      const singleDoc = await getDoc(colRef);
      reset(singleDoc.data());
    }
    fetchData();
  }, [categoryId, reset]);

  const watchStatus = watch("status");

  const handleUpdateCategory = async (values) => {
    if (!isValid) return;
    try {
      const colRef = doc(db, "categories", categoryId);
      await updateDoc(colRef, {
        name: values.name,
        slug: slugify(values.name || values.slug, { lower: true }),
        status: Number(values.status),
      });
      toast.success("Chỉnh sửa danh mục thành công!");
      navigate("/manage/category");
    } catch (error) {
      console.log(error);
      toast.error("Chỉnh sửa danh mục thất bại!");
    }
  };
  if (!categoryId) return null;
  return (
    <div>
      <DashboardHeading
        title="Chỉnh sửa danh mục"
        desc={`Danh mục: ${categoryId}`}
      ></DashboardHeading>
      <form autoComplete="off" onSubmit={handleSubmit(handleUpdateCategory)}>
        <div className="form-layout">
          <Field>
            <Label>Tên danh mục</Label>
            <Input
              type="text"
              control={control}
              name="name"
              placeholder="Nhập tên danh mục"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              type="text"
              control={control}
              name="slug"
              placeholder="Nhập slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Trạng thái</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                value={categoryStatus.APPROVED}
                control={control}
                checked={Number(watchStatus) === categoryStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                value={categoryStatus.UNAPPROVED}
                control={control}
                checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
              >
                Unapproved
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[200px]"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Chỉnh sửa danh mục
        </Button>
      </form>
    </div>
  );
};
