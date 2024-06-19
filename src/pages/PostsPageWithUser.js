import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useParams } from "react-router-dom";
import Heading from "../components/layout/Heading";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase-app/firebase-config";
import PostItem from "../module/post/PostItem";

const PostsPageWithUser = () => {
  const params = useParams();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("user.username", "==", params.username)
      );
      onSnapshot(docRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(results);
      });
    }
    fetchData();
  }, [params.username]);

  if (posts.length <= 0) return null;

  return (
    <Layout>
      <div className="container">
        <div className="mt-5 ">
          <Heading>Danh mục {params.username}</Heading>
          <div className="grid-layout grid-layout--primary">
            {posts.length > 0 &&
              posts.map((post) => (
                <PostItem key={post.id} data={post}></PostItem>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostsPageWithUser;
