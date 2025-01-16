import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Button } from "../../components/button";
import { Table } from "../../components/table";
import { LabelStatus } from "../../components/label";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/auth-context";
import { roleStatus } from "../../utils/constants";

const CATEGORY_PER_PAGE = 10;

const CategoryManage = () => {
  //
  const navigate = useNavigate();

  //
  const [categoryList, setCategoryList] = useState([]);
  const [filter, setFilter] = useState(undefined);
  const [nextDoc, setNextDoc] = useState();
  const [total, setTotal] = useState(0);

  //
  const {
    formState: { isSubmitting },
  } = useForm({ mode: "onChange" });

  //
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      const queries = filter
        ? query(
            colRef,
            where("name", ">=", filter),
            where("name", "<=", filter + "utf8")
          )
        : query(colRef, limit(CATEGORY_PER_PAGE));
      const documentSnapshots = await getDocs(queries);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });
      onSnapshot(queries, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategoryList(results);
      });
      setNextDoc(lastVisible);
    }
    fetchData();
  }, [filter]);

  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  const handleDeleteCategory = (docId) => {
    const colRef = doc(db, "categories", docId);
    Swal.fire({
      title: "Do you want to delete this category??",
      text: "Once deleted you cannot undo it.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire({
          title: "Delete category successfully!",
          icon: "success",
        });
      }
    });
  };

  const handleLoadMoreCategory = async () => {
    const nextRef = query(
      collection(db, "categories"),
      startAfter(nextDoc),
      limit(CATEGORY_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoryList([...categoryList, ...results]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setNextDoc(lastVisible);
  };

  //
  const { userInfo } = useAuth();
  if (Number(userInfo.role) !== roleStatus.ADMIN) return null;

  return (
    <div>
      <DashboardHeading title="Categories" desc="Category Manager">
        <Button type="button" to="/manage/add-category" kind="ghost">
          Add Category
        </Button>
      </DashboardHeading>
      <div className="mb-10 ml-auto w-[220px]">
        <input
          className="px-5 py-4 border rounded-lg border-primary"
          type="text"
          placeholder="Enter category name..."
          onChange={handleInputFilter}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Category name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <span className="italic text-gray-400">{category.slug}</span>
                </td>
                <td>
                  {category.status === 1 && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {category.status === -1 && (
                    <LabelStatus type="warning">Unapproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center justify-center gap-x-3">
                    <ActionView></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-category?id=${category.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteCategory(category.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > categoryList.length && (
        <div className="mt-10">
          <Button
            type="button"
            kind="primary"
            className="mx-auto"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            onClick={handleLoadMoreCategory}
          >
            See more
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryManage;
