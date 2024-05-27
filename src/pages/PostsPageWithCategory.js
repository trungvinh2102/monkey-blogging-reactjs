import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useParams } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase-app/firebase-config";
import Heading from "../components/layout/Heading";
import PostItem from "../module/post/PostItem";

const PostsPageWithCategory = () => {
  const params = useParams();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("category.slug", "==", params.slug)
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
  }, [params.slug]);

  if (posts.length <= 0) return null;
  return (
    <Layout>
      <div className="container">
        <div className="mt-8">
          <Heading>Danh mục {params.slug}</Heading>
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

export default PostsPageWithCategory;
