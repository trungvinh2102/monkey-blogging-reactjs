import { Table } from "../../components/table";
import { Dropdown } from "../../components/dropdown";
import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
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
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import Swal from "sweetalert2";
import { debounce } from "lodash";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { postStatus, roleStatus, userStatus } from "../../utils/constants";
import { LabelStatus } from "../../components/label";
import { useAuth } from "../../contexts/auth-context";

const POST_PER_PAGE = 2;

const PostManage = () => {
  //
  const navigate = useNavigate();

  // state
  const [filter, setFilter] = useState(undefined);
  console.log("PostManage ~ filter:", filter);
  const [total, setTotal] = useState(0);
  const [postList, setPostList] = useState([]);
  const [nextDoc, setNextDoc] = useState();
  const [categories, setCategories] = useState([]);

  //
  const {
    formState: { isSubmitting },
  } = useForm({ mode: "onChange" });

  // fetch data posts
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const queries = filter
        ? query(
          colRef,
          where("title", ">=", filter),
          where("title", "<=", filter + "utf8")
        )
        : query(colRef, limit(POST_PER_PAGE));
      const documentSnapshots = await getDocs(queries);
      // Get the last visible document
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
        setPostList(results);
      });
      setNextDoc(lastVisible);
    }
    fetchData();
  }, [filter]);

  // delete post
  const handleDeletePost = (docId) => {
    const colRef = doc(db, "posts", docId);
    Swal.fire({
      title: "Bạn có muốn xóa bài viết này không?",
      text: "Khi đã xóa bạn không thể hoàn tác lại!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Hủy",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire({
          title: "Xóa bài viết thành công!",
          icon: "success",
        });
      }
    });
  };

  // load more post
  const handleLoadMorePost = async () => {
    const nextRef = query(
      collection(db, "posts"),
      startAfter(nextDoc),
      limit(POST_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPostList([...postList, ...results]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setNextDoc(lastVisible);
  };

  //
  useEffect(() => {
    async function fetchDataCategories() {
      const q = query(
        collection(db, "categories"),
        where("status", "==", postStatus.APPROVED)
      );
      let results = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(results);
    }
    fetchDataCategories();
  }, []);

  //
  const renderUserStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type="success">Active</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case userStatus.BAN:
        return <LabelStatus type="danger">Rejected</LabelStatus>;
      default:
        break;
    }
  };

  // search post
  const handleSearchPost = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  //
  const { userInfo } = useAuth();
  if (userInfo.role !== roleStatus.ADMIN) return null;

  return (
    <>
      <DashboardHeading
        title="Bài viết"
        desc="Quản lí bài viết"
      ></DashboardHeading>
      <div className="flex justify-end gap-5 mb-10">
        <div className="w-full max-w-[200px]">
          <Dropdown>
            <Dropdown.Select placeholder="Danh mục"></Dropdown.Select>
            <Dropdown.List>
              {/* call and display */}
              {categories.length > 0 &&
                categories.map((item) => (
                  <Dropdown.Option key={item.id}>{item.name}</Dropdown.Option>
                ))}
            </Dropdown.List>
          </Dropdown>
        </div>
        <div className="w-full max-w-[300px]">
          <input
            onChange={handleSearchPost}
            type="text"
            className="w-full p-4 border border-gray-300 border-solid rounded-lg"
            placeholder="Tìm kiếm..."
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Bài viết</th>
            <th>Danh mục</th>
            <th>Tác giả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 &&
            postList.map((posts) => {
              const date = posts?.createdAt?.seconds
                ? new Date(posts?.createdAt?.seconds * 1000)
                : new Date();
              const formatDate = new Date(date).toLocaleDateString("vi-VI");
              return (
                <tr key={posts.id}>
                  <td title={posts.id}>{posts.id.slice(0, 5) + "..."}</td>
                  <td>
                    <div className="flex items-center mr-8 gap-x-3">
                      <img
                        src={posts.image}
                        alt=""
                        className="w-[66px] h-[55px] rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{posts.title}</h3>
                        <time className="text-sm text-gray-500">
                          Date: {formatDate}
                        </time>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-gray-500">
                      {posts?.category.name}
                    </span>
                  </td>
                  <td>
                    <span className="text-gray-500">
                      {posts?.user.fullname}
                    </span>
                  </td>
                  <td>{renderUserStatus(Number(posts.status))}</td>
                  <td>
                    <div className="flex items-center text-gray-500 gap-x-3">
                      <ActionView
                        onClick={() => navigate(`/${posts.slug}`)}
                      ></ActionView>
                      <ActionEdit
                        onClick={() =>
                          navigate(`/manage/update-post?id=${posts.id}`)
                        }
                      ></ActionEdit>
                      <ActionDelete
                        onClick={() => handleDeletePost(posts.id)}
                      ></ActionDelete>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      {total > postList.length && (
        <div className="mt-10 text-center">
          <Button
            kind="primary"
            className="mx-auto w-[200px]"
            type="submit"
            onClick={handleLoadMorePost}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Xem thêm
          </Button>
        </div>
      )}
    </>
  );
};

export default PostManage;
