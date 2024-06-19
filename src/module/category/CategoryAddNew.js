import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import { Button } from "../../components/button";
import slugify from "slugify";
import { categoryStatus } from "../../utils/constants";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";

const CategoryAddNew = () => {
  const {
    watch,
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      status: 1,
      createdAt: serverTimestamp(),
    },
  });

  const handleAddNewCategory = async (values) => {
    if (!isValid) return;
    try {
      const newValues = { ...values };
      newValues.slug = slugify(values.name || values.slug, { lower: true });
      newValues.name = values.name;
      newValues.status = Number(values.status);
      await addDoc(collection(db, "categories"), {
        ...newValues,
        createdAt: serverTimestamp(),
      });
      toast.success("Thêm danh mục thành công!");
      reset({
        name: "",
        slug: "",
        status: 1,
      });
    } catch (error) {
      console.log(error);
      toast.error("Thêm danh mục không thành công!");
    }
  };
  const watchStatus = watch("status");
  return (
    <>
      <DashboardHeading
        title="Danh mục"
        desc="Thêm mới danh mục"
      ></DashboardHeading>
      <form autoComplete="off" onSubmit={handleSubmit(handleAddNewCategory)}>
        <div className="form-layout">
          <Field>
            <Label>Tên danh mục</Label>
            <Input
              type="text"
              control={control}
              name="name"
              placeholder="Nhập tên danh mục"
              required
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              type="text"
              control={control}
              name="slug"
              placeholder="Enter your slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                value={categoryStatus.APPROVED}
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
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Thêm danh mục
        </Button>
      </form>
    </>
  );
};

export default CategoryAddNew;
