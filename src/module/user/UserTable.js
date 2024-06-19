import React, { useEffect, useState } from "react";
import { Table } from "../../components/table";
import { ActionDelete, ActionEdit } from "../../components/action";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { useNavigate } from "react-router-dom";
import { LabelStatus } from "../../components/label";
import { roleStatus, userStatus } from "../../utils/constants";
import Swal from "sweetalert2";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form";

const USER_PER_PAGE = 2;

const UserTable = () => {
  //
  const navigate = useNavigate();

  //
  const [userList, setUserList] = useState([]);
  const [nextDoc, setNextDoc] = useState();
  const [total, setTotal] = useState(0);

  //
  const {
    formState: { isSubmitting },
  } = useForm({ mode: "onChange" });

  //
  useEffect(() => {
    async function fetchUser() {
      const colRef = collection(db, "users");
      const queries = query(colRef, limit(USER_PER_PAGE));
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
        setUserList(results);
      });
      setNextDoc(lastVisible);
    }
    fetchUser();
  }, []);

  //
  const renderRoleStatus = (status) => {
    switch (status) {
      case roleStatus.ADMIN:
        return <p className="text-base font-medium">Admin</p>;
      case roleStatus.MOD:
        return <p className="text-base font-medium">Moderator</p>;
      case roleStatus.EDITOR:
        return <p className="text-base font-medium">Editor</p>;
      case roleStatus.USER:
        return <p className="text-base font-medium">User</p>;
      default:
        break;
    }
  };

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

  //
  const handleDeleteUser = (docId) => {
    const colRef = doc(db, "users", docId);
    Swal.fire({
      title: "Bạn có muốn xóa người dùng này không?",
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

  // load more user
  const handleLoadMoreUser = async () => {
    const nextRef = query(
      collection(db, "users"),
      startAfter(nextDoc),
      limit(USER_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList([...userList, ...results]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setNextDoc(lastVisible);
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Thông tin người dùng</th>
            <th>Username</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Quyền</th>
            <th>Hàng động</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((user) => (
              <tr key={user.id} className=" whitespace-nowrap">
                <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
                <td>
                  <div className="flex items-center justify-center gap-x-3">
                    <img
                      src={
                        user.avatar
                          ? user.avatar
                          : "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      }
                      alt=""
                      className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
                    />
                    <div className="flex-1">
                      <h3>{user.fullname}</h3>
                      <time className="text-sm text-gray-400">
                        {new Date(
                          user?.createdAt?.seconds * 1000
                        ).toLocaleDateString("vi-VI")}
                      </time>
                    </div>
                  </div>
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{renderUserStatus(Number(user.status))}</td>
                <td>{renderRoleStatus(Number(user.role))}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-user?id=${user.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteUser(user.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > userList.length && (
        <div className="mt-10">
          <Button
            type="button"
            kind="primary"
            className="mx-auto"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            onClick={handleLoadMoreUser}
          >
            Xem thêm
          </Button>
        </div>
      )}
    </>
  );
};

export default UserTable;
