import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase-app/firebase-config";

const UserBox = ({ userId = "" }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchDataUser() {
      const docRef = doc(db, "users", userId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.data()) {
        setUser(docSnapshot.data());
      }
    }
    fetchDataUser();
  }, [userId]);

  return (
    <div className="author">
      <div className="author-image">
        <img src={user.avatar} alt="" />
      </div>
      <div className="author-content">
        <h3 className="author-name">{user.fullname}</h3>
        <p className="author-desc">{user.description}</p>
      </div>
    </div>
  );
};

export default UserBox;
